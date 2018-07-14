import { Citation, Id } from '../types'

import { Action } from '../actions'

export type TraitData = {
  uid?: Id
  value: boolean
  deduced: boolean
  description?: string
  references?: Citation[]
}
export type State = Map<Id, Map<Id, TraitData>>

const clone = (state: State): State => {
  const next = new Map()
  state.forEach((props, sid) => {
    next.set(sid, new Map(props))
  })
  return next
}

export const reducer = (
  state: State | undefined,
  action: Action
): State => {
  state = state || new Map()

  let next: State
  switch (action.type) {
    case 'LOAD_VIEWER':
      next = new Map()
      state.forEach((props, sid) => {
        next.set(sid, new Map(props))
      })
      action.viewer.viewer.spaces.forEach(s => {
        if (!next.has(s.uid)) {
          next.set(s.uid, new Map<Id, TraitData>())
        }
        const props = next.get(s.uid)!
        s.traits.forEach(t => {
          props.set(t.property.uid, {
            value: t.value,
            description: t.description || '',
            deduced: t.deduced,
            references: t.references as Citation[]
          })
        })
      })
      return next

    case 'CHANGE_BRANCH':
      return new Map()

    case 'ASSERT_TRAIT':
      next = clone(state)
      if (!next.has(action.trait.space.uid)) {
        next.set(action.trait.space.uid, new Map())
      }
      const data: TraitData = {
        value: action.trait.value,
        deduced: action.trait.deduced
      }
      if (action.trait.uid) { data.uid = action.trait.uid }
      if (action.trait.description) { data.description = action.trait.description }
      if (action.trait.references) { data.references = action.trait.references }

      next
        .get(action.trait.space.uid)!
        .set(action.trait.property.uid, data)
      return next
    default:
      return state
  }
}

export default reducer