const EventEmitter = require('events')
const logger = require('./logger')

/**
 * Represents the state of the API.
 * @typedef {'starting' | 'fail' | 'available' | 'unavailable' | 'stop'} StateString
 */

/**
 * Represents the mode of the API.
 * @typedef {'normal' | 'maintenance'} ModeString
 */

/**
 * @typedef {Object} Mode
 * @property {ModeString} currentMode - The current mode of the API.
 * @property {Date} since - The time when the API entered the current mode.
 * @property {string} requestedBy - The user ID of the user who initiated the mode change.
 * @property {boolean} isLocked - Whether the mode is locked.
 * @property {string} message - An optional message associated with the mode.
 * @property {ModeChange} changeScheduled 
*/

/**
 * @typedef {Object} ModeChange
 * @property {ModeString} newMode - The requested new mode of the API.
 * @property {string} newMessage - The message to be associated with the new mode.
 * @property {string} requestedBy - The user ID of the user who made the request.
 * @property {Number} scheduledIn - The time in seconds to delay the mode change.
 * @property {string} message - An optional message associated with the new mode.
*/


/**
 * @typedef {Object} DependencyStatus
 * @property {boolean} db - The status of the database dependency.
 * @property {boolean} oidc - The status of the OIDC dependency.
 */

/**
 * Class representing the state and mode of the API.
 * @extends EventEmitter
 */
class State extends EventEmitter {
  /** @type {StateString} */
  #currentState
  
  /** @type {StateString} */
  #previousState
  
  /** @type {Date} */
  #stateDate

  /** @type {DependencyStatus} */
  #dependencyStatus

  /** @type {Object} */
  #dbPool

  /** @type {Mode} */
  #mode

  /** @type {Object} */
  #endpoints

  /** @type {Number} */
  #changeTimeoutId

  /**
   * Creates an instance of State.
   * @param {Object} options - Options for initializing the state.
   * @param {StateString} [options.initialState='starting'] - The initial state of the API.
   * @param {Mode} [options.initialMode='normal'] - The initial mode of the API.
   */
  constructor({ 
    initialState = 'starting', 
    initialMode = {currentMode: 'normal', since: new Date(), requestedBy: '', message: '', isLocked: false, changeScheduled: null}, 
    endpoints = { 
      ui: { 
        normal: '/', 
        maintenance: '/maintenance' 
      } 
    } 
  } = {}) {
    super()
    this.#currentState = initialState
    this.#stateDate = new Date()
    this.#mode = initialMode
    this.#dependencyStatus = {
      db: false,
      oidc: false
    }
    this.#endpoints = endpoints
  }

  /**
   * Emits 'statechanged', passing the previous and current state and dependency status.
   * @private
   */
  #emitStateChangedEvent() {
    this.emit('statechanged', this.#currentState, this.#previousState, this.#dependencyStatus)
  }

  /**
   * Emits 'modechanged', passing the current mode.
   * @private
   */
  #emitModeChangedEvent() {
    this.emit('modechanged', this.#mode)
  }

  #emitModeScheduledEvent() {
    this.emit('mode-scheduled', this.#mode)
  }

  #emitModeUnscheduledEvent() {
    this.emit('mode-unscheduled', this.#mode)
  }

  /**
   * Sets the state based on the dependency status.
   * @private
   */
  #setStateFromDependencyStatus() {
    if (this.#dependencyStatus.db && this.#dependencyStatus.oidc) {
      this.setState('available')
    }
    else {
      this.setState(this.#currentState === 'starting' ? 'starting' : 'unavailable')
    }
  }

  /**
   * Sets the state to the provided state and emits statechanged event.
   * @param {StateString} state - The new state.
   */
  setState(state) {
    if (this.#currentState === state) return
    this.#previousState = this.#currentState
    this.#currentState = state
    this.#stateDate = new Date()
    this.#emitStateChangedEvent()
  }

  changeMode({ newMode, newMessage, requestedBy, scheduledIn = 0, message }) {
    // clear any timer that would change the mode
    clearTimeout(this.#changeTimeoutId)

    if (scheduledIn === 0) {
      // immediate mode change
      this.setMode({ currentMode: newMode, requestedBy, message: newMessage, changeScheduled: null })
    }

    if (scheduledIn > 0) {
      // scheduled a mode change
      this.#mode.changeScheduled = { newMode, newMessage, requestedBy, scheduledIn, message }
      this.#changeTimeoutId = setTimeout(() => {
        this.setMode({ currentMode: newMode, requestedBy, message: newMessage, changeScheduled: null })
      }, scheduledIn * 1000)
      this.#mode.changeScheduled = { newMode, newMessage, requestedBy, scheduledIn, message }
      this.#emitModeScheduledEvent()
    } else if (scheduledIn < 0) {
      // unschedule a mode change (timer is already cleared)
      this.#mode.changeScheduled = null
      this.#emitModeUnscheduledEvent()
    }
  }

  /**
   * Sets the mode to the provided mode and emits modechanged event.
   * @param {Mode} mode - The new mode.
   * @param {boolean} force - Whether to force the mode change.
   * @private
   */
  setMode({ currentMode = 'normal', requestedBy = '', message = '', changeScheduledIn = 0, isLocked = false } = {}, force = false) {
    const currentChangeScheduledIn = this.#mode.changeScheduledIn
    const events = []
    if (this.#mode.isLocked && !force)
      return false

    if (currentChangeScheduledIn > 0) {
      // there is a mode change already scheduled
      if (changeScheduledIn > 0) {
        events.push(this.#emitModeScheduledEvent)
      } else if (changeScheduledIn < 0) {
        events.push(this.#emitModeUnscheduledEvent)
      }
      this.#mode = { currentMode, requestedBy, message, changeScheduledIn, isLocked }

      if (this.#mode.changeScheduledIn === 0) {
        this.#emitModeChangedEvent()
      }
    }
    return true
  }

  /**
   * Sets the status of the database dependency.
   * @param {boolean} status - The new status of the database dependency.
   */
  setDbStatus(status) {
    if (this.#dependencyStatus.db === status) return
    this.#dependencyStatus.db = status
    this.#setStateFromDependencyStatus()
  }

  /**
   * Sets the status of the OIDC dependency.
   * @param {boolean} status - The new status of the OIDC dependency.
   */
  setOidcStatus(status) {
    if (this.#dependencyStatus.oidc === status) return
    this.#dependencyStatus.oidc = status
    this.#setStateFromDependencyStatus()
  }

  lockMode() {
    const wasLocked = this.#mode.isLocked
    this.#mode.isLocked = true
    if (!wasLocked) this.#emitModeChangedEvent()
  }

  unlockMode() {
    const wasLocked = this.#mode.isLocked
    this.#mode.isLocked = false
    if (wasLocked) this.#emitModeChangedEvent()
  }

  /**
   * Gets the current state.
   * @type {StateString}
   * @readonly
   */
  get currentState() {
    return this.#currentState
  }

  /**
   * Gets the dependency status.
   * @type {DependencyStatus}
   * @readonly
   */
  get dependencyStatus() {
    return {...this.#dependencyStatus}
  }

  /**
   * Gets the current mode.
   * @type {Mode}
   * @readonly
   */
  get currentMode() {
    return this.#mode.currentMode
  }

  get mode() {
    return this.#mode
  }

  /**
   * Sets the mode.
   * @param {Mode} mode - The new mode.
   */
  set mode(mode) {
    this.setMode(mode)
  }

  /**
   * Sets the database pool.
   * @param {Object} pool - The new database pool.
   */
  set dbPool(pool) {
    this.#dbPool = pool
  }

  /**
   * Gets the database pool.
   * @type {Object}
   * @readonly
   */
  get dbPool() {
    return this.#dbPool
  }

  /**
   * Gets the API state.
   * @type {Object}
   * @readonly
   */
  get apiState() {
    const publicMode = {...this.#mode}
    delete publicMode.requestedBy
    return {
      currentState: this.#currentState,
      since: this.#stateDate,
      mode: publicMode,
      dependencies: this.#dependencyStatus,
      endpoints: {
        ui: this.#endpoints.ui[this.#mode.currentMode]
      },
    }
  }
}

const state = new State()
state.on('statechanged', async (currentState, previousState, dependencyStatus) => {
  logger.writeInfo('state','statechanged', {currentState, previousState, dependencyStatus})
  let exitCode = 0
  switch (currentState) {
    case 'fail':
      exitCode = 1
      logger.writeError('state','fail', {message:'Application failed', exitCode})
      process.exit(exitCode)
      break
    case 'stop':
      try {
        await state.dbPool?.end()
      }
      catch (err) {
        logger.writeError('state','stop', {message:'Error closing database pool', error: serializeError(err)})
      } 
      logger.writeInfo('state','stop', {message:'Application stopped', exitCode})
      process.exit(exitCode)
      break
  }
})

module.exports = state