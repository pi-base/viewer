import { applyMiddleware, compose, createStore, Store } from 'redux'
import persistState from 'redux-localstorage'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import * as G from './graph'
import rootReducer, { State } from './reducers'
import { TokenStorage } from './types'

const inDevelopment = process.env.NODE_ENV === 'development'

// tslint:disable-next-line no-any
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const localToken = {
  get: () => localStorage.getItem('piBase.token'),
  set: token => localStorage.setItem('piBase.token', token)
}

const makeMiddleware = ({ graph, token }: { graph: G.Client, token: TokenStorage }) => {
  const middleware = [
    thunk.withExtraArgument({ graph, token })
  ]

  if (inDevelopment) {
    middleware.push(createLogger({ collapsed: true }))
  }

  return middleware
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

export function makeStore({ graph, token }: { graph: G.Client, token: TokenStorage }): Store<State> {
  const enhancers = [
    applyMiddleware(...makeMiddleware({ graph, token }))
  ]

  if (inDevelopment) {
    enhancers.push(loadFromLocalStorage)
  }

  return createStore<State>(
    rootReducer,
    composeEnhancers(...enhancers)
  )
}