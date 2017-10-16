import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { ApolloClient } from 'apollo-client'
import { createLogger } from 'redux-logger'
import persistState from 'redux-localstorage'
import thunkMiddleware from 'redux-thunk'
import { reducer as formReducer } from 'redux-form'

import { Client } from './graph/client'
import userReducer from './reducers/user'
import viewerReducer from './reducers/viewer'
import { StoreState } from './types'

const nullMiddleware = ({ dispatch, getState }) => next => action => next(action)

function makeLogger() {
  if (process.env.NODE_ENV === 'development') {
    return createLogger({
      collapsed: (getState, action) => {
        if (!action.type) { return false }
        return action.type.startsWith('APOLLO_') || action.type.startsWith('@@redux-form/')
      },
      predicate: (getState, action) => {
        return action.type !== '@@redux-form/CHANGE'
      }
    })
  }
  return nullMiddleware
}

export function makeStore(client: Client, state?: StoreState) {
  const reducers = {
    form: formReducer,
    user: userReducer,
    viewer: viewerReducer,
    apollo: client.apollo.reducer()
  }

  const middleware = [
    thunkMiddleware,
    makeLogger(),
    client.apollo.middleware()
  ]

  const storage = persistState(['user'], {
    key: 'pi-base-state',
    merge: (initial, persisted) => {
      if (persisted.user.token) {
        client.token = persisted.user.token
      }
      return persisted ? { ...initial, ...persisted } : initial
    }
  })

  return createStore(
    combineReducers(reducers),
    state,
    compose(
      applyMiddleware(...middleware),
      storage
    )
  )
}
