import { Branch } from '../types'
import { Action } from '../actions'

export type State = {
  branch: Branch
}

export const initial = {
  branch: 'audited'
}

export const reducer = (
  state: State | undefined,
  action: Action
) => {
  state = state || initial as State

  switch (action.type) {
    case 'CHANGE_BRANCH':
      return { ...state, branch: action.branch }
    default:
      return state
  }
}

export default reducer