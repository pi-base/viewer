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
      const next = new Map(state)
      action.viewer.viewer.spaces.forEach(s => {
        next.set(s.uid, {
          uid: s.uid,
          name: s.name,
          aliases: s.aliases,
          description: s.description,
          references: s.references as T.Citation[] // TODO: check `type` against enum
        })
      })
      return new Map(next)

    default:
      return state
  }
}

export default reducer