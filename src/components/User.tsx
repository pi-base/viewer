import * as React from 'react'
import { withApollo } from 'react-apollo'
import { Dispatch, connect } from 'react-redux'

import * as A from '../actions'
import { Action, Branch, State, User } from '../types'

type StateProps = {
  branch: Branch
  username: string | undefined
}
type DispatchProps = {
  changeBranch: (branch: Branch) => void
  logout: () => void
}
type Props = StateProps & DispatchProps

const User = ({ username, branch, changeBranch, logout }: Props) => {
  if (!username) {
    return (<div />)
  } else {
    return (
      <div>
        <h1>{username}</h1>
        <button onClick={logout} className="btn btn-default">
          Logout
        </button>

        <h3>Branch</h3>
        <p>{branch}</p>

        <button onClick={() => changeBranch('audited')}>Reviewed</button>
        <button onClick={() => changeBranch('user')}>User</button>
      </div>
    )
  }
}

export default withApollo(
  connect<StateProps, DispatchProps>(
    (state): StateProps => ({
      branch: state.version.branch,
      username: state.user === 'unauthenticated' ? undefined : state.user.name
    }),
    (dispatch, ownProps): DispatchProps => ({
      changeBranch: (branch) => dispatch(A.changeBranch(branch)),
      logout: () => {
        A.logout(ownProps.client, dispatch).then(() => {
          ownProps.history.push('/')
        })
      }
    })
  )(User))
