import * as A from '../actions'
import * as T from '../types'

export type State = Map<T.Id, T.Space>

export const reducer = (
  state: State | undefined,
  action: A.Action
): State => {
  state = state || new Map()

  switch (action.type) {
    case 'ADD_SPACE':
      return state.set(action.space.uid, action.space)

    case 'CHANGE_BRANCH':
      return new Map()

    case 'LOAD_VIEWER':
      const spaces = new Map()
      action.viewer.viewer.spaces.forEach(s => {
        spaces.set(s.uid, {
          uid: s.uid,
          name: s.name,
          description: s.description
        })
      })
      return new Map([...state, ...spaces])

    default:
      return state
  }
}

export default reducer