import { combineReducers } from 'redux'
import * as form from 'redux-form'

import * as T from './types'
import * as A from './actions'

import properties from './reducers/properties'
import prover, { ProofState } from './reducers/prover'
import spaces from './reducers/spaces'
import theorems from './reducers/theorems'
import traits, { State as TraitState } from './reducers/traits'
import * as version from './reducers/version'

export type State = {
  spaces: Map<T.Id, T.Space>
  properties: Map<T.Id, T.Property>
  theorems: Map<T.Id, T.Theorem>
  traits: TraitState
  proofs: ProofState
  version: version.State
}

const combined = combineReducers<State>({
  spaces,
  properties,
  traits,
  theorems,
  proofs: (state) => (state || new Map()),
  version: version.reducer,
  form: form.reducer
})

const reducer = (state: State, action: A.Action): State => {
  const next = combined(state, action)
  return prover(next, action)
}

export default reducer