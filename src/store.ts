import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { ApolloClient } from 'apollo-client'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import { StoreState } from './types'

const nullMiddleware = ({ dispatch, getState }) => next => action => next(action)
const id = (x) => (x)

function makeLogger() {
  if (process.env.NODE_ENV === 'development') {
    return createLogger()
  }
  return nullMiddleware
}

function getDevtools() {
  /* tslint:disable no-string-literal */
  return window['__REDUX_DEVTOOLS_EXTENSION__'] || id
  /* tslint:enable no-string-literal */
}

export function makeStore(client: ApolloClient, state?: StoreState) {
  const reducers = {
    apollo: client.reducer()
  }

  const middleware = [
    makeLogger(),
    client.middleware(),
    thunkMiddleware
  ]

  return createStore(
    combineReducers(reducers),
    state, 
    compose(
      applyMiddleware(...middleware),
      getDevtools()
    )
  )
}
