const logPrefix = '[StateWorker]:'
const channelName = 'stigman-state-worker'

let initialized = false
let apiBase = ''

const messageHandlers = {
  initialize
}

// Worker entry point
onconnect = function (e) {
  const port = e.ports[0]
  port.onmessage = onMessage
  port.start()
}

function initialize(options) {
  if (!initialized) {
    apiBase = options.apiBase
    const stateWorkerChannel = new BroadcastChannel(channelName)
    const evtSource = new EventSource(`${apiBase}/op/state/sse`)

    evtSource.onerror = (event) => {
      console.log(`${logPrefix} SSE error:`, event)
    }

    for (const event of ['mode-changed', 'state-changed', 'state-report']) {
      evtSource.addEventListener(event, (event) => {
        console.log(`${logPrefix} ${event.type} event:`, event)
        stateWorkerChannel.postMessage({ type: event.type, data: event.data })
      })
    }

    console.log(`${logPrefix} setup event source`)
    initialized = true

    return { success: true, channelName }
  }
}

function onMessage(e) {
  const port = e.target
  const { requestId, request, ...options } = e.data
  const handler = messageHandlers[request]
  if (handler) {
    try {
      const response = handler(options)
      port.postMessage({ requestId, response })
    } catch (error) {
      port.postMessage({ requestId, error: error.message })
    }
  } else {
    port.postMessage({ requestId, error: 'Unknown request' })
  }
}


