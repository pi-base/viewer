import { createStore, applyMiddleware } from 'redux'

import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import reducer from './reducers'

const loggerMiddleware = createLogger({
  predicate: (getState, action) => (
    // !action.type.endsWith('/CHANGE')
    !action.type.startsWith('@@redux-form')
  )
})

const middleware = applyMiddleware(
  loggerMiddleware,
  thunkMiddleware
)

export const makeStore = (state) => {
    return createStore(reducer, state, middleware)
}
