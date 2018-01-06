import { applyMiddleware, compose, createStore, Store } from 'redux'
import persistState from 'redux-localstorage'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer, { State } from './reducers'

// tslint:disable-next-line no-any
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const logger = createLogger({
  collapsed: true
})

const middleware = [
  thunk,
  logger
]

export function makeStore(): Store<State> {
  return createStore<State>(
    rootReducer,
    composeEnhancers(
      applyMiddleware(...middleware),
      persistState(null, {
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
    )
  )
}