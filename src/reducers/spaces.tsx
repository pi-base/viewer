import * as A from '../actions'
import * as T from '../types'

const reducer = (
  state: Map<T.Id, T.Space> | undefined,
  action: A.Action
) => {
  state = state || new Map()

  switch (action.type) {
    case 'ADD_SPACE':
      return state.set(action.space.uid, action.space)
    case 'LOAD_VIEWER':
      const spaces = new Map()
      action.viewer.spaces.forEach(s => {
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