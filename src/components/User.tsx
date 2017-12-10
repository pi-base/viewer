import * as React from 'react'
import { Dispatch, connect } from 'react-redux'

import * as A from '../actions'
import { Action, Branch, State, User } from '../types'

type StateProps = {
  branch: Branch
  username: string | undefined
}
type DispatchProps = {
  changeBranch: (branch: Branch) => void
}
type Props = StateProps & DispatchProps

const User = ({ username, branch, changeBranch }: Props) => {
  if (!username) {
    return (<div />)
  } else {
    return (
      <div>
        <h1>{username}</h1>

        <h3>Branch</h3>
        <p>{branch}</p>

        <button onClick={() => changeBranch('audited')}>Reviewed</button>
        <button onClick={() => changeBranch('user')}>User</button>
      </div>
    )
  }
}

const mapStateToProps = (state: State): StateProps => ({
  branch: state.version.branch,
  username: state.user === 'unauthenticated' ? undefined : state.user.name
})

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => ({
  changeBranch: (branch) => dispatch(A.changeBranch(branch))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)
