Ext.ns('SM.ApiState')

SM.ApiState = {
  isMaintenance: false,
  stateWorkerChannel: null,
  stateWorker: null
}

SM.ApiState.setupStateWorker = async function () {
  this.stateWorker = new SharedWorker("js/stateWorker.js", { name: 'stigman-state-worker', type: "module" })
  this.stateWorker.port.start()
  const response = await this.sendWorkerRequest({ request: 'initialize', apiBase: STIGMAN.Env.apiBase })
  this.stateWorkerChannel = new BroadcastChannel(response.channelName)
  this.stateWorkerChannel.onmessage = this.handleBroadcastMessage.bind(this)
  return { worker: this.stateWorker, channel: this.stateWorkerChannel }
}

SM.ApiState.sendWorkerRequest = function (request) {
  const requestId = crypto.randomUUID()
  const port = this.stateWorker.port
  port.postMessage({ ...request, requestId })
  return new Promise((resolve) => {
    function handler(event) {
      if (event.data.requestId === requestId) {
        port.removeEventListener('message', handler)
        resolve(event.data.response)
      }
    }
    port.addEventListener('message', handler)
  })
}

SM.ApiState.AlertWindow = Ext.extend(Ext.Window, {
  initComponent: function () {
    const title = `<div class="sm-alert-icon" style="padding-left:20px">API Alert</div>`;
    const config = {
      title,
      width: 400
    }
    Ext.apply(this, Ext.apply(this.initialConfig, config))
    this.superclass().initComponent.call(this)
  }
})

SM.ApiState.handleBroadcastMessage = function (event) {
  console.log('[State Broadcast] Received message:', event.data)
  this.state = SM.safeJSONParse(event.data.data)
  const type = event.data.type
  if (type === 'mode-changed') {
    if (this.state?.mode?.currentMode === 'maintenance') {
      const html = `<div style="padding: 10px">
      <p><b>The API is currently undergoing maintenance</b></p>
      <p>Started by: ${this.state?.mode?.startedBy}</p>
      <p>Message: ${this.state?.mode?.message}</p>
      ${curUser.privileges.admin ? `<p><a href="${this.state?.endpoints?.ui}" target="_blank">Open Maintenance App</a></p>` : ''}
      </div>`

      const buttons = []
      if (curUser.privileges.admin) {
        buttons.push(new Ext.Button({
          text: 'Change to Normal Mode',
          handler: async () => {
            const response = await SM.ApiState.sendWorkerRequest({ request: 'setApiMode', mode: 'normal', token: window.oidcWorker.token })
          }
        }))
      }
      this.alertModal = new SM.ApiState.AlertWindow({ html, buttons, closable: false, modal: true })
      this.alertModal.show()
      this.alertToast?.close()
    }
    else {
      this.alertModal?.close()
    }
  }
  else if (type === 'state-changed') {
    if (this.state?.currentState !== 'available') {
      const html = `<div style="padding: 10px">
      <p><b>The API is currently unavailable</b></p>
      <p>Database: ${this.state?.dependencies?.db}</p>
      <p>Authentication: ${this.state?.dependencies?.oidc}</p>
      </div>`
      this.alertModal = new SM.ApiState.AlertWindow({ html, closable: false, modal: true })
      this.alertModal.show()
      this.alertToast?.close()

    }
    else {
      this.alertModal?.close()
    }
  }
  else if (type === 'state-error') {
    const html = `<div style="padding: 10px">
      <p><b>An error occurred while fetching the API state</b></p>
      </div>`
    this.alertModal = new SM.ApiState.AlertWindow({ html, closable: false, modal: true })
    this.alertModal.show()
  }
  else if (type === 'state-report' && this.state?.mode.currentMode === 'normal' && this.state?.currentState === 'available') {
    this.alertModal?.close()
  }
  else if (type === 'mode-change-scheduled') {
    const html = `<div style="padding: 10px">
      <p><b>A mode change has been scheduled</b></p>
      <p>New mode: ${this.state?.mode?.scheduled?.nextMode}</p>
      <p>Scheduled for: ${this.state?.mode?.scheduled?.scheduledFor}</p>
      <p>Message: ${this.state?.mode?.scheduled?.scheduledMessage}</p>
      </div>`
    this.alertToast = new SM.ApiState.AlertWindow({
      html,
      closable: false,
      bodyStyle: {
        backgroundColor: 'hsl(29 100% 26% / 1)',
      },
      modal: false,
      y: 5,
      listeners: {
        show: function (win) {
          win.getEl().slideIn('t', { // Slide in from the top
            easing: 'easeOut',
            duration: 0.5,
          })
        }
      }
    })
    this.alertToast.show()
  }
  else if (type === 'mode-change-unscheduled') {
    const html = `<div style="padding: 10px">
      <p><b>The scheduled mode change has been cancelled</b></p>
      </div>`
    if (this.alertToast) this.alertToast.close()
    this.alertToast = new SM.ApiState.AlertWindow({ html, closable: true, modal: false })
    this.alertToast.show(Ext.getBody())
  }
}

SM.ApiState.showModeDialog = function ({ treePath }) {
  const _this = this
  const modeMessage = new Ext.form.TextArea({
    fieldLabel: 'Message',
    anchor: '100%',
  })
  const dialog = new Ext.Window({
    title: 'Maintenance Mode',
    width: 400,
    layout: 'form',
    padding: 20,
    modal: true,
    items: [
      modeMessage
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: function () {
          dialog.close()
        }
      },
      {
        text: 'Start Maintenance Mode',
        handler: async function () {
          try {
            const message = modeMessage.getValue()
            const response = await _this.sendWorkerRequest({ request: 'setApiMode', mode: 'maintenance', message, token: window.oidcWorker.token })
          }
          catch (error) {
            Ext.Msg.alert('Error', `Failed to set maintenance mode. Please try again. ${error}`)
          }
          finally {
            dialog.close()
          }
        }
      },
    ]
  })
  dialog.show()
}


