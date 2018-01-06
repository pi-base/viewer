import { Branch, BranchName } from '../types'
import { Action } from '../actions'

export type State = {
  active: BranchName | undefined
  branches: Map<BranchName, Branch>
}

export const initial = {
  active: undefined,
  branches: new Map()
}

export const reducer = (
  state: State | undefined,
  action: Action
): State => {
  state = state || initial as State

  switch (action.type) {
    case 'CHANGE_BRANCH':
      return { ...state, active: action.branch.name }
    case 'LOGIN':
      const branches = new Map()
      action.branches.forEach(b => branches.set(b.name, b))
      return { ...state, branches }
    case 'PERSIST_SUCCESS':
      return state
    default:
      return state
  }
}

export default reducer