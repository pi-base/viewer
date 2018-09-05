import * as G from './graph'

import { Action, TokenStorage } from './types'
import { Store, applyMiddleware, compose, createStore } from 'redux'
import field, { Field } from './store/field'
import rootReducer, { State } from './reducers'
import thunk, { ThunkMiddleware } from 'redux-thunk'

import { createLogger } from 'redux-logger'

const inDevelopment = false // process.env.NODE_ENV === 'development'

// tslint:disable-next-line no-any
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const localToken: Field<string> = field('token')

const makeMiddleware = ({ graph, token }: { graph: G.Client, token: TokenStorage }) => {
  const middleware = [
    thunk.withExtraArgument({ graph, token }) as ThunkMiddleware<State, Action>
  ]

  if (inDevelopment) {
    middleware.push(createLogger({ collapsed: true }))
  }

  // TODO: rollbar middleware?

  return middleware
}

const persist = next => (reducer, _) => {
  let load, dump

  const db = field('state')

  if (inDevelopment) {
    dump = state => state
    load = json => {
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
        version: json.version && {
          active: json.version.active,
          branches: new Map(json.version.branches)
        }
      }
    }
  } else {
    dump = (state: State) => ({ version: state.version })
    load = json => {
      return {
        version: json.version && {
          active: json.version.active,
          branches: new Map(json.version.branches)
        }
      }
    }
  }

  const loaded = db.get()
  const initialState = loaded ? load(loaded) : undefined
  const store = next(reducer, initialState)

  store.subscribe(() => {
    const state = store.getState()

    db.set(dump(state))
  })

  return store
}

export function makeStore({ graph, token }: { graph: G.Client, token: TokenStorage }): Store<State> {
  const enhancers = [
    applyMiddleware(...makeMiddleware({ graph, token })),
    persist
  ]

  return createStore<State, Action, {}, {}>(
    rootReducer,
    composeEnhancers(...enhancers)
  )
}