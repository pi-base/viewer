import { Action } from '../actions'
import { Id } from '../types'

export type State = Map<Id, Map<Id, boolean>>

const clone = (state: State): State => {
  const next = new Map()
  state.forEach((props, sid) => {
    next.set(sid, new Map([...props]))
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
          next.set(s.uid, new Map())
        }
        const props = next.get(s.uid)!
        s.traits.forEach(t => {
          props.set(t.property.uid, t.value)
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
      next
        .get(action.trait.space.uid)!
        .set(action.trait.property.uid, action.trait.value)
      return next
    default:
      return state
  }
}

export default reducer