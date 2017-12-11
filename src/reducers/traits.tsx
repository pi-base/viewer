import { Action } from '../actions'
import { Id } from '../types'

export type State = Map<Id, Map<Id, boolean>>

export const reducer = (
  state: State | undefined,
  action: Action
) => {
  state = state || new Map()

  switch (action.type) {
    case 'LOAD_VIEWER':
      const traits: State = new Map()
      state.forEach((props, sid) => {
        traits.set(sid, new Map(props))
      })
      action.viewer.viewer.spaces.forEach(s => {
        if (!traits.has(s.uid)) {
          traits.set(s.uid, new Map())
        }
        const props = traits.get(s.uid)!
        s.traits.forEach(t => {
          props.set(t.property.uid, t.value)
        })
      })
      return traits
    default:
      return state
  }
}

export default reducer