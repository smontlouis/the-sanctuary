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

const initialState = {}
const pubsub = new Pubsub()

export let state = initialState

export const setState = (value) => {
  if (!isObject(value)) throw new Error('value must be a object')
  const currentState = state
  const nextState = { ...currentState, ...value }
  pubsub.publish(currentState, nextState)
  state = nextState
}

export const subscribe = (config, callback) => {
  return pubsub.subscribe(callback, config)
}
