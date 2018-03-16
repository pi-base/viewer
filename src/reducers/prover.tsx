import * as A from '../actions'
import { Id, Space, Theorem } from '../types'

import * as Q from '../queries'
import * as Logic from '../logic'
import { State as StoreState } from '../reducers'

type Deduction = { theorem: Id, properties: Id[] }
type Proof = { type: 'asserted' }
  | { type: 'deduced' } & Deduction

export type State = Map<Id, Proof>

export const initial = new Map()

class UQueue<P> {
  queue: P[]
  queued: Map<P, boolean>

  constructor(ps: IterableIterator<P>) {
    this.queued = new Map()

    this.queue = Array.from(ps)
    this.queue.forEach(p => this.queued.set(p, true))
  }

  concat(ps: IterableIterator<P>) {
    Array.from(ps).forEach(p => {
      if (!this.queued.get(p)) {
        this.queued.set(p, true)
        this.queue.push(p)
      }
    })
  }

  shift(): P | undefined {
    const p = this.queue.shift()
    if (p) { this.queued.set(p, false) }
    return p
  }
}

const checkProofs = (state: StoreState, spaces: Space[]): StoreState => {
  const traits = new Map()
  const proofs = new Map(state.proofs)

  // FIXME: unify this and Logic.disprove
  let theoremsByProp = new Map()
  state.theorems.forEach((t: Theorem) => {
    Q.theoremProperties(t).forEach((uid: Id) => {
      const props = theoremsByProp.get(uid) || []
      props.push(t)
      theoremsByProp.set(uid, props)
    })
  })

  spaces.forEach(space => {
    const applyQ: UQueue<Theorem> = new UQueue(state.theorems.values())
    const recordProof = (propertyId: Id, proof: Deduction) => {
      const key = `${space.uid}|${propertyId}`
      if (!proofs.has(key)) {
        proofs.set(key, { ...proof, type: 'deduced' })
        applyQ.concat(theoremsByProp.get(propertyId))
      }
    }
    const spaceTraits = new Map(state.traits.get(space.uid) || [])

    let theorem
    while (theorem = applyQ.shift()) {
      Logic.apply({ theorem, traits: spaceTraits, recordProof })
    }

    traits.set(space.uid, spaceTraits)
  })

  return { ...state, traits, proofs }
}

export const reducer = (
  state: StoreState,
  action: A.Action
): StoreState => {
  let proofs: State
  switch (action.type) {
    case 'LOAD_VIEWER':
      proofs = new Map(state.proofs)
      action.viewer.viewer.spaces.forEach(space => {
        space.traits.forEach(trait => {
          proofs.set(
            `${space.uid}|${trait.property.uid}`,
            { type: 'asserted' }
          )
        })
      })
      return { ...state, proofs }

    case 'ASSERT_TRAIT':
      proofs = new Map(state.proofs)
      proofs.set(
        `${action.trait.space.uid}|${action.trait.property.uid}`,
        { type: 'asserted' }
      )
      return { ...state, proofs }

    case 'CHECK_PROOFS':
      return checkProofs(
        state,
        action.spaces || Array.from(state.spaces.values())
      )

    default:
      return state
  }
}

export default reducer