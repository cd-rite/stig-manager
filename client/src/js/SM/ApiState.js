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

SM.ApiState.alertWindow = new Ext.Window({
  title: `<div class="sm-alert-icon" style="padding-left:20px">API Status</div>`,
  width: 400,
  height: 110,
  modal: true,
  html: '',
  closable: false,
})

SM.ApiState.handleBroadcastMessage = function (event) {
  console.log('[State Broadcast] Received message:', event.data)
  this.state = JSON.parse(event.data.data)
  const type = event.data.type
  if (type === 'mode-changed') {
    if (this.state?.mode?.currentMode === 'maintenance') {
      const html = `<div style="padding: 10px">The API is currently undergoing maintenance</div>`
      if (this.alertWindow.rendered) {
        this.alertWindow.update(html)
      }
      else {
        this.alertWindow.html = html
      }
      this.alertWindow.show()
    }
    else {
      this.alertWindow?.hide()
    }
  }
  else if (type === 'state-changed') {
    if (this.state.currentState !== 'available') {
      const html = `<div style="padding: 10px">The API state is currently ${this.state.currentState}<br><br>${JSON.stringify(this.state.dependencies)}</div>`
      if (this.alertWindow.rendered) {
        this.alertWindow.update(html)
      }
      else {
        this.alertWindow.html = html
      }
      this.alertWindow.show()
    }
    else {
      this.alertWindow?.hide()
    }
  }
}

