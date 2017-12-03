import * as A from '../actions'
import * as T from '../types'

import * as Logic from '../logic'
import { State } from '../reducers'

type Asserted = 0
type Proof = T.Proof | Asserted

export type ProofState = Map<T.Id, Map<T.Id, Proof>>

const checkProofs = (state: State): State => {
  const traits = new Map()
  const proofs = new Map(state.proofs)

  state.spaces.forEach(space => {
    const ts = new Map(state.traits.get(space.uid) || [])

    if (!proofs.has(space.uid)) {
      proofs.set(space.uid, new Map())
    }

    const recordProof = (propertyId, proof) => {
      proofs.get(space.uid)!.set(propertyId, proof)
    }

    state.theorems.forEach(theorem => {
      Logic.apply({ theorem, traits: ts, recordProof })
    })

    traits.set(space.uid, ts)
  })

  console.log('proofs', proofs)

  return { ...state, traits, proofs }
}

const reducer = (
  state: State,
  action: A.Action
): State => {
  switch (action.type) {
    case 'LOAD_VIEWER':
      const proofs: ProofState = new Map()
      if (!state.proofs) { state.proofs = new Map() }
      state.proofs.forEach((ps, sid) => {
        proofs.set(sid, new Map(ps))
      })
      action.viewer.spaces.forEach(s => {
        if (!proofs.has(s.uid)) {
          proofs.set(s.uid, new Map())
        }
        const ps = proofs.get(s.uid)!
        s.traits.forEach(t => {
          ps.set(t.property.uid, 0)
        })
      })
      return { ...state, proofs }

    case 'CHECK_PROOFS':
      return checkProofs(state)

    default:
      return state
  }
}

export default reducer