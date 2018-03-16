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

  let branches

  switch (action.type) {
    case 'CHANGE_BRANCH':
      return { ...state, active: action.branch }
    case 'UPDATE_BRANCH':
      branches = new Map(state.branches)
      const branch = branches.get(action.branch)
      if (branch) { branch.sha = action.sha }
      return { ...state, branches }
    case 'LOGIN':
      branches = new Map()
      action.branches.forEach(b => branches.set(b.name, b))
      // TODO: this should check that the SHA matches the loaded data
      let active = action.branches.find(b => b.access === 'read')!.name
      return { ...state, branches, active }
    case 'PERSIST_SUCCESS':
      return state
    default:
      return state
  }
}

export default reducer