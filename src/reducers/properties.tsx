import * as A from '../actions'
import * as T from '../types'

const reducer = (
  state: Map<T.Id, T.Property> | undefined,
  action: A.Action
) => {
  state = state || new Map()
  let next

  switch (action.type) {
    case 'LOAD_VIEWER':
      next = new Map()
      action.viewer.properties.forEach(p => {
        next.set(p.uid, {
          uid: p.uid,
          name: p.name,
          description: p.description
        })
      })
      return new Map([...state, ...next])

    case 'ADD_PROPERTY':
      next = new Map(state)
      next.set(action.property.uid, action.property)
      return next

    default:
      return state
  }
}

export default reducer