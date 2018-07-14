import * as form from 'redux-form'
import * as properties from './reducers/properties'
import * as prover from './reducers/prover'
import * as search from './reducers/search'
import * as spaces from './reducers/spaces'
import * as theorems from './reducers/theorems'
import * as traits from './reducers/traits'
import * as user from './reducers/user'
import * as version from './reducers/version'

import { Action } from './types'
import { combineReducers } from 'redux'

export type State = {
  debug: boolean
  proofs: prover.State
  properties: properties.State
  search: search.State
  spaces: spaces.State
  theorems: theorems.State
  traits: traits.State
  user: user.State
  version: version.State
  form: form.FormStateMap
}

const debugReducer = (debug: boolean | undefined, action: Action): boolean => {
  if (debug === undefined) { debug = process.env.NODE_ENV === 'development' }
  return action.type === 'TOGGLE_DEBUG' ? !debug : debug
}

const combined = combineReducers<State>({
  debug: debugReducer,
  proofs: (s) => s || prover.initial,
  properties: properties.reducer,
  search: (s) => s || search.initial,
  spaces: spaces.reducer,
  traits: traits.reducer,
  theorems: theorems.reducer,
  user: user.reducer,
  version: version.reducer,
  form: (state, action) => form.reducer(state!, action)
})

const reducer = (state: State, action: Action): State => {
  let next = combined(state, action)
  next = prover.reducer(next, action)
  return {
    ...next, search: search.reducer(next, action)
  }
}

export default reducer