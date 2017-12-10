import { applyMiddleware, compose, createStore, Store } from 'redux'
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
      applyMiddleware(...middleware)
    )
  )
}