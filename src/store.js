import {
  createStore,
  applyMiddleware
} from 'redux'


import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import reducer from './reducers'

let middleware = [thunkMiddleware]

if (process.env.NODE_ENV === 'development') {
  middleware.unshift(createLogger())
}

export const makeStore = (state) => {
  return createStore(reducer, state, applyMiddleware(...middleware))
}
