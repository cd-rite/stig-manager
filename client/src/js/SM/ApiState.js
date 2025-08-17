Ext.ns('SM.ApiState')

SM.ApiState = {
    isMaintenance: false,
}

SM.ApiState.setupStateWorker = async function () {
  const stateWorker = new SharedWorker("js/stateWorker.js", { name: 'stigman-state-worker', type: "module" })
  stateWorker.port.start()
  const response = await sendWorkerRequest({ request: 'initialize', apiBase: STIGMAN.Env.apiBase })
  this.stateWorkerChannel = new BroadcastChannel(response.channelName)
  this.stateWorkerChannel.onmessage = this.handleBroadcastMessage.bind(this)
  return {worker: stateWorker, channel: this.stateWorkerChannel}

  function sendWorkerRequest (request) {
    const requestId = crypto.randomUUID()
    const port = stateWorker.port
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
}

SM.ApiState.alertTpl = new Ext.XTemplate(
  '<div style="padding: 10px">',

  '<tpl if="currentState !== \'available\'">',
  '<p><b>The API is currently unavailable</b></p>',
  '<p>Database: {values.dependencies.db}</p>',
  '<p>Authentication: {values.dependencies.oidc}</p>',
  '</tpl>',

  '<tpl if="mode.currentMode === \'maintenance\'">',
  '<p><b>The API is currently undergoing maintenance</b></p>',
  '<p>Started by: {values.mode.startedBy}</p>',
  '<p>Message: {values.mode.message}</p>',
  '</tpl>',

  '</div>',
);

SM.ApiState.alertWindow = new Ext.Window({
  title: `<div class="sm-alert-icon" style="padding-left:20px">API Status</div>`,
  width: 400,
  height: 110,
  modal: true,
  tpl: SM.ApiState.alertTpl,
  closable: false,
  safeUpdate: function (data) {
    if (this.rendered) {
      this.update(data)
    }
    else {
      this.data = data
    }
  }
})

SM.ApiState.handleBroadcastMessage = function (event) {
  console.log('[State Broadcast] Received message:', event.data)
  this.state = SM.safeJSONParse(event.data.data)
  const type = event.data.type
  if (type === 'mode-changed') {
    if (this.state?.mode?.currentMode === 'maintenance') {
      // const html = `<div style="padding: 10px">The API is currently undergoing maintenance. Initiated by ${this.state?.mode?.initiatedBy}</div>`
      // this.alertWindow.safeUpdate(html)
      this.alertWindow.safeUpdate(this.state)
      this.alertWindow.show()
    }
    else {
      this.alertWindow?.hide()
    }
  }
  else if (type === 'state-changed') {
    if (this.state?.currentState !== 'available') {
      // const html = `<div style="padding: 10px">The API state is currently ${this.state?.currentState}<br><br>${JSON.stringify(this.state?.dependencies)}</div>`
      // this.alertWindow.safeUpdate(html)
      this.alertWindow.safeUpdate(this.state)
      this.alertWindow.show()
    }
    else {
      this.alertWindow?.hide()
    }
  }
  else if (type === 'state-error') {
    const html = `<div style="padding: 10px">An error occurred while fetching the API state.</div>`
    this.alertWindow.safeUpdate(html)
    this.alertWindow.show()
  }
  else if (type === 'state-report' && this.state?.mode.currentMode === 'normal' && this.state?.currentState === 'available' ) {
    this.alertWindow.hide()
  }
}

SM.ApiState.showMaintenanceTab = function ({ treePath }) {
}

