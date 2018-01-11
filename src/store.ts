import { applyMiddleware, compose, createStore, Store } from 'redux'
import persistState from 'redux-localstorage'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import * as G from './graph'
import rootReducer, { State } from './reducers'

// tslint:disable-next-line no-any
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const makeMiddleware = (client: G.Client) => {
  const logger = createLogger({ collapsed: true })

  return [
    thunk.withExtraArgument({ client }),
    logger
  ]
}

const loadFromLocalStorage = persistState(null, {
  deserialize: (json) => {
    // Arbitrary Maps don't round-trip through JSON
    json = JSON.parse(json)
    if (json === null) { return null }

    const traits = new Map()
    json.traits.forEach(([sid, ts]) => {
      const map = ts.reduce(
        (acc, [pid, trait]) => acc.set(pid, trait),
        new Map()
      )
      traits.set(sid, map)
    })

    return {
      ...json,
      traits,
      proofs: new Map(json.proofs),
      properties: new Map(json.properties),
      spaces: new Map(json.spaces),
      theorems: new Map(json.theorems),
      version: {
        active: json.version.active,
        branches: new Map(json.version.branches)
      }
    }
  }
})

export function makeStore(client: G.Client): Store<State> {
  const middleware = makeMiddleware(client)
  return createStore<State>(
    rootReducer,
    composeEnhancers(
      applyMiddleware(...middleware),
      loadFromLocalStorage
    )
  )
}