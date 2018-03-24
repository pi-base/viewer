import * as React from 'react'
import { Dispatch, connect } from 'react-redux'

import * as A from '../../actions'
import { Branch, State } from '../../types'
import { by } from '../../utils'

type StateProps = {
  branches: (Branch & { active: boolean })[]
}
type DispatchProps = {
  changeBranch: (branch: Branch) => void
  submitBranch: (branch: Branch) => void
}
type Props = StateProps & DispatchProps

const Branches = ({ branches, changeBranch, submitBranch }: Props) => {
  if (!branches) { return null }

  return (
    <table className="table table-condensed">
      <thead>
        <tr>
          <th />
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {branches.map(branch => (
          <tr key={branch.name}>
            <td>
              {branch.active
                ? <button className="btn btn-default" disabled={true}>Current</button>
                : <button className="btn btn-default" onClick={() => changeBranch(branch)}>Switch</button>
              }
            </td>
            <td>{branch.name}</td>
            <td>
              {branch.active && branch.access === 'admin'
                ? <a className="btn btn-primary btn-sm" onClick={() => submitBranch(branch)}>Submit for Review</a>
                : null
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default connect<StateProps, DispatchProps>(
  (state: State): StateProps => {
    if (state.user === 'unauthenticated') {
      return { branches: [] }
    } else {
      const branches = Array.from(state.version.branches.values()).sort(by('name'))
      return {
        branches: branches.map(branch => ({
          ...branch,
          active: branch.name === state.version.active
        }))
      }
    }
  },
  (dispatch, ownProps): DispatchProps => ({
    changeBranch: (branch) => dispatch(A.changeBranch(branch.name)),
    submitBranch: (branch) => dispatch(A.submitBranch(branch.name))
  })
)(Branches)