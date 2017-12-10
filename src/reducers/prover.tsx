import * as A from '../actions'
import { Id } from '../types'

import * as Logic from '../logic'
import { State as StoreState } from '../reducers'

type Deduction = { theorem: Id, properties: Id[] }
type Proof = { type: 'asserted' }
  | { type: 'deduced' } & Deduction

export type State = Map<Id, Proof>

export const initial = new Map()

const checkProofs = (state: StoreState): StoreState => {
  const traits = new Map()
  const proofs = new Map(state.proofs)

  state.spaces.forEach(space => {
    const recordProof = (propertyId: Id, proof: Deduction) => {
      proofs.set(`${space.uid}|${propertyId}`, { ...proof, type: 'deduced' })
    }
    const spaceTraits = new Map([...state.traits.get(space.uid) || []])

    state.theorems.forEach(theorem => {
      Logic.apply({ theorem, traits: spaceTraits, recordProof })
    })

    traits.set(space.uid, spaceTraits)
  })

  return { ...state, traits, proofs }
}

export const reducer = (
  state: StoreState,
  action: A.Action
): StoreState => {
  switch (action.type) {
    case 'LOAD_VIEWER':
      const proofs = new Map([...state.proofs])
      action.viewer.spaces.forEach(space => {
        space.traits.forEach(trait => {
          proofs.set(
            `${space.uid}|${trait.property.uid}`,
            { type: 'asserted' }
          )
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