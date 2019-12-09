const clone = o => JSON.parse(JSON.stringify(o))
const isObject = val => val != null && typeof val === 'object' && Array.isArray(val) === false
const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

class Pubsub {
  constructor () {
    this.callbackList = []
  }

  publish (currentState, nextState) {
    if (!isObject(currentState)) throw new Error('currentState should be and object')
    if (!isObject(nextState)) throw new Error('nextState should be and object')
    this.callbackList.forEach(item => {
      const currentValue = item.config(currentState)
      const nextValue = item.config(nextState)
      if (!isEqual(currentValue, nextValue)) {
        item.callback(nextValue)
      }
    })
  }

  subscribe (callback, config) {
    if (typeof callback !== 'function') { throw new Error('callback should be a function') }
    if (typeof config !== 'function') { throw new Error('config should be a function') }
    this.callbackList = [
      ...this.callbackList,
      { callback, config }
    ]
    return true
  }
}

class Store {
  constructor (initialState = {}) {
    if (!isObject(initialState)) throw new Error('initial state must be a object')
    this.internalState = initialState
    this.pubsub = new Pubsub()
  }

  get state () {
    return clone(this.internalState)
  }

  set state (value) {
    return false
  }

  setState (value) {
    if (!isObject(value)) throw new Error('value must be a object')
    const currentState = clone(this.internalState)
    const nextState = Object.assign(clone(currentState), clone(value))
    this.pubsub.publish(currentState, nextState)
    this.internalState = nextState
  }

  subscribe (config, callback) {
    return this.pubsub.subscribe(callback, config)
  }
}

export default new Store()
