import {
  createStore,
  applyMiddleware
} from 'redux'

import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import reducer from './reducers'

const devLogger = createLogger()

const middleware = applyMiddleware(
  devLogger,
  thunkMiddleware
)

export const makeStore = (state) => {
  return createStore(reducer, state, middleware)
}
