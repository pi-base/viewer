import { Branch } from '../types'
import { Action } from '../actions'

export type State = {
  branch: Branch
  sha: string | null
}

export const initial = {
  branch: 'audited',
  sha: null
}

export const reducer = (
  state: State | undefined,
  action: Action
) => {
  state = state || initial as State

  switch (action.type) {
    case 'CHANGE_BRANCH':
      return { ...state, branch: action.branch }
    case 'PERSIST_SUCCESS':
      return { ...state, sha: action.version }
    default:
      return state
  }
}

export default reducer