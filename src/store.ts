import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { ApolloClient } from 'apollo-client'
import { createLogger } from 'redux-logger'
import persistState from 'redux-localstorage'
import thunkMiddleware from 'redux-thunk'

import userReducer from './reducers/user'
import { StoreState } from './types'

const nullMiddleware = ({ dispatch, getState }) => next => action => next(action)

function makeLogger() {
  if (process.env.NODE_ENV === 'development') {
    return createLogger({
      collapsed: (getState, action) => {
        return action.type && action.type.startsWith('APOLLO_')
      }
    })
  }
  return nullMiddleware
}

export function makeStore(client: ApolloClient, state?: StoreState) {
  const reducers = {
    user: userReducer,
    apollo: client.reducer()
  }

  const middleware = [
    thunkMiddleware,
    makeLogger(),
    client.middleware()
  ]

  const storage = persistState(['user'], {
    key: 'pi-base-state'
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
