import { Action, Id, Theorem } from '../types'

import * as F from '../models/Formula'

export type State = Map<Id, Theorem>
export const initial = new Map()

export const reducer = (
  state: Map<Id, Theorem> | undefined,
  action: Action
) => {
  state = state || initial
  let next

  switch (action.type) {
    case 'LOAD_VIEWER':
      next = new Map(state)
      action.viewer.viewer.theorems.forEach(t => {
        next.set(t.uid, {
          uid: t.uid,
          if: F.fromJSON(JSON.parse(t.if)),
          then: F.fromJSON(JSON.parse(t.then)),
          references: t.references,
          description: t.description
        })
      })
      return next

    case 'CHANGE_BRANCH':
      return new Map()

    case 'ASSERT_THEOREM':
      next = new Map(state)
      next.set(action.theorem.uid, action.theorem)
      return next

    default:
      return state
  }
}

export default reducer