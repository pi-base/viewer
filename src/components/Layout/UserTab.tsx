import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import * as A from '../../actions'
import { loginUrl } from '../../graph'
import { Dispatch, State } from '../../types'

type StateProps = {
  username: string | undefined
}
type DispatchProps = {
  startLogin: () => void
  logout: () => void
}
type Props = StateProps & DispatchProps & RouteComponentProps<{}>

const UserTab = ({ username, startLogin, logout }: Props) => {
  if (username) {
    return (
      <ul className="nav navbar-nav pull-right">
        <li>
          <Link to="/user">{username}</Link></li>
        <li>
          <a href="#" onClick={() => logout()}>Logout</a>
        </li>
      </ul>
    )
  } else {
    return (
      <ul className="nav navbar-nav pull-right">
        <li>
          <a href="#" onClick={() => startLogin()}>
            Login with Github
          </a>
        </li>
      </ul>
    )
  }
}

export default withRouter(connect<StateProps, DispatchProps>(
  (state: State): StateProps => ({
    username: state.user === 'unauthenticated' ? undefined : state.user.name
  }),
  (dispatch: Dispatch, { history }: Props): DispatchProps => ({
    startLogin: () => {
      // FIXME: decouple
      localStorage.setItem('piBase.returnTo', window.location.pathname);
      // tslint:disable-next-line no-any
      (window as any).location = loginUrl({ redirectTo: window.location })
    },
    logout: () => dispatch(A.logout)
  })
)(UserTab))