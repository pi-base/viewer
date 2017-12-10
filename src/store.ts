import { applyMiddleware, compose, createStore, Store } from 'redux'
import persistState from 'redux-localstorage'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer, { State } from './reducers'

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

          const traits = new Map()
          json.traits.forEach(([sid, ts]) => {
            const map = ts.reduce(
              (acc, [pid, trait]) => acc.set(pid, trait),
              new Map()
            )
            traits.set(sid, map)
          })

          const proofs = new Map()
          json.proofs.forEach(([sid, ps]) => {
            const map = ps.reduce(
              (acc, [pid, proof]) => acc.set(pid, proof),
              new Map()
            )
            proofs.set(sid, map)
          })

          return {
            ...json,
            proofs,
            traits,
            properties: new Map(json.properties),
            spaces: new Map(json.spaces),
            theorems: new Map(json.theorems)
          }
        }
      })
    )
  )
}