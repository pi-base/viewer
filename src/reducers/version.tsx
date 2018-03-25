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

const updateBranch = (state, name, updates) => {
  const branches = new Map(state.branches)
  let branch = branches.get(name)
  if (branch) {
    branches.set(name, { ...branch, ...updates })
  }
  return { ...state, branches }
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
      return updateBranch(state, action.branch, { sha: action.sha })
    case 'LOGIN':
      branches = new Map()
      action.branches.forEach(b => branches.set(b.name, b))
      // TODO: this should check that the SHA matches the loaded data
      let active = action.branches.find(b => b.access === 'read')!.name
      return { ...state, branches, active }
    case 'PERSIST_SUCCESS':
      return state
    case 'SUBMITTING_BRANCH':
      return updateBranch(state, action.branch.name, {
        submitting: true
      })
    case 'SUBMITTED_BRANCH':
      return updateBranch(state, action.branch.name, {
        submitting: false,
        pullRequestUrl: action.url
      })
    default:
      return state
  }
}

export default reducer