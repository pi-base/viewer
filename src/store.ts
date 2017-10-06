import { createStore, combineReducers, applyMiddleware } from 'redux'
import { ApolloClient } from 'apollo-client'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import { StoreState } from './types'

let middleware = [thunkMiddleware]

/* tslint:disable no-string-literal */
if (typeof window['__REDUX_DEVTOOLS_EXTENSION__'] !== undefined) {
  middleware.unshift(window['__REDUX_DEVTOOLS_EXTENSION__'])
}
/* tslint:enable no-string-literal */

if (process.env.NODE_ENV === 'development') {
  middleware.unshift(createLogger())
}

export function makeStore(client: ApolloClient, state?: StoreState) {
  const reducers = {
    apollo: client.reducer()
  }

  return createStore(
    combineReducers(reducers),
    state, 
    applyMiddleware(...middleware))
}
