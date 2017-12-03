import * as A from '../actions'
import * as T from '../types'

import * as F from '../models/Formula'

const reducer = (
  state: Map<T.Id, T.Theorem> | undefined,
  action: A.Action
) => {
  state = state || new Map()
  let next

  switch (action.type) {
    case 'LOAD_VIEWER':
      next = new Map()
      action.viewer.theorems.forEach(t => {
        next.set(t.uid, {
          uid: t.uid,
          if: F.fromJSON(JSON.parse(t.if)),
          then: F.fromJSON(JSON.parse(t.then)),
          description: t.description
        })
      })
      return new Map([...state, ...next])

    case 'ADD_THEOREM':
      next = new Map(state)
      next.set(action.theorem.uid, action.theorem)
      return next

    default:
      return state
  }
}

export default reducer