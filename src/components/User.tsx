import * as React from 'react'
import { withApollo } from 'react-apollo'
import { Dispatch, connect } from 'react-redux'

import * as A from '../actions'
import { Action, Branch, BranchName, State, User } from '../types'
import { by } from '../utils'

type StateProps = {
  branches: (Branch & { active: boolean })[]
  username: string | undefined
}
type DispatchProps = {
  changeBranch: (branch: Branch) => void
}
type Props = StateProps & DispatchProps

const User = ({ username, branches, changeBranch }: Props) => {
  if (!username) {
    return (<div />)
  } else {
    return (
      <div>
        <h1>{username}</h1>

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
      </div>
    )
  }
}

export default withApollo(
  connect<StateProps, DispatchProps>(
    (state: State): StateProps => {
      if (state.user === 'unauthenticated') {
        return { username: undefined, branches: [] }
      } else {
        const branches = Array.from(state.version.branches.values()).sort(by('name'))
        return {
          username: state.user.name,
          branches: branches.map(branch => ({
            ...branch,
            active: branch.name === state.version.active
          }))
        }
      }
    },
    (dispatch, ownProps): DispatchProps => ({
      changeBranch: (branch) => dispatch(A.changeBranch(branch))
    })
  )(User))
