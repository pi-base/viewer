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
}
type Props = StateProps & DispatchProps

const Branches = ({ branches, changeBranch }: Props) => {
  if (!branches) { return null }

  return (
    <table className="table table-condensed">
      <thead>
        <tr>
          <th>{' '}</th>
          <th>Branch</th>
          <th>Access</th>
        </tr>
      </thead>
      <tbody>
        {branches.map(branch => (
          <tr key={branch.name}>
            <td>
              {branch.active
                ? <span className="label label-success">Current</span>
                : <a className="btn btn-default" onClick={() => changeBranch(branch)}>Switch</a>
              }
            </td>
            <td>{branch.name}</td>
            <td>{branch.access}</td>
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
    changeBranch: (branch) => dispatch(A.changeBranch(branch.name))
  })
)(Branches)