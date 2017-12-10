import { combineReducers } from 'redux'
import * as form from 'redux-form'

import * as T from './types'
import * as A from './actions'

import * as properties from './reducers/properties'
import prover, { ProofState } from './reducers/prover'
import * as search from './reducers/search'
import spaces from './reducers/spaces'
import theorems from './reducers/theorems'
import traits, { State as TraitState } from './reducers/traits'
import * as user from './reducers/user'
import * as version from './reducers/version'

export type State = {
  proofs: ProofState
  properties: properties.State
  search: search.State
  spaces: Map<T.Id, T.Space>
  theorems: Map<T.Id, T.Theorem>
  traits: TraitState
  user: user.State
  version: version.State
}

const combined = combineReducers<State>({
  proofs: (s) => s || new Map(),
  properties: properties.reducer,
  search: (s) => s || search.initial,
  spaces,
  traits,
  theorems,
  user: user.reducer,
  version: version.reducer,
  form: form.reducer
})

const reducer = (state: State, action: A.Action): State => {
  let next = combined(state, action)
  next = prover(next, action)
  return {
    ...next, search: search.reducer(next, action)
  }
}

export default reducer