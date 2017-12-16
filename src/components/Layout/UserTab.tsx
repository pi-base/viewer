import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import { loginUrl } from '../../graph'
import { Dispatch, State } from '../../types'

type StateProps = {
  username: string | undefined
}
type DispatchProps = {
  startLogin: () => void
}
type Props = StateProps & DispatchProps & RouteComponentProps<{}>

const UserTab = ({ username, startLogin }: Props) => (
  <li>
    {username
      ? <Link to="/user">{username}</Link>
      : <a onClick={() => startLogin()}>
        Login with Github
      </a>
    }
  </li>
)

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
    }

  })
)(UserTab))