const logPrefix = '[StateWorker]:'
const channelName = 'stigman-state-worker'

let initialized = false
let apiBase = ''

const messageHandlers = {
  initialize,
  setApiMode,
  getApiState
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
      stateWorkerChannel.postMessage({ type: 'state-error', data: event.data })
    }

    for (const event of ['mode-changed', 'state-changed', 'state-report', 'mode-change-scheduled', 'mode-change-unscheduled']) {
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

async function setApiMode({mode, message, force, token}) {
  const url = `${apiBase}/op/state/mode?elevate=true${force ? '&force=true' : ''}`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ mode, message })
  })
  if (!response.ok) {
    throw new Error(`Failed to set mode: ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  console.log(`${logPrefix} Mode set:`, data)
  return { success: true, data }
}

async function getApiState() {
  const url = `${apiBase}/op/state`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to get API state: ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  return { success: true, data }
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


