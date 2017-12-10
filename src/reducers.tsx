import { combineReducers } from 'redux'
import * as form from 'redux-form'

import { Action } from './types'

import * as properties from './reducers/properties'
import * as prover from './reducers/prover'
import * as search from './reducers/search'
import * as spaces from './reducers/spaces'
import * as theorems from './reducers/theorems'
import * as traits from './reducers/traits'
import * as user from './reducers/user'
import * as version from './reducers/version'

export type State = {
  proofs: prover.State
  properties: properties.State
  search: search.State
  spaces: spaces.State
  theorems: theorems.State
  traits: traits.State
  user: user.State
  version: version.State
}

const combined = combineReducers<State>({
  proofs: (s) => s || prover.initial,
  properties: properties.reducer,
  search: (s) => s || search.initial,
  spaces: spaces.reducer,
  traits: traits.reducer,
  theorems: theorems.reducer,
  user: user.reducer,
  version: version.reducer,
  form: form.reducer
})

const reducer = (state: State, action: Action): State => {
  let next = combined(state, action)
  next = prover.reducer(next, action)
  return {
    ...next, search: search.reducer(next, action)
  }
}

export default reducer