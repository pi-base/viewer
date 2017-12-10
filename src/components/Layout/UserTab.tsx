import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { loginUrl } from '../../graph'
import { State } from '../../types'

type StoreProps = {
  username: string | undefined
}
type Props = StoreProps

const UserTab = ({ username }: Props) => (
  <ul className="nav navbar-nav pull-right">
    <li>
      {username
        ? <Link to="/user">{username}</Link>
        : <a href={loginUrl({ redirectTo: window.location })}>
          Login with Github
          </a>
      }
    </li>
  </ul>
)

export default connect(
  (state: State): StoreProps => ({
    username: state.user === 'unauthenticated' ? undefined : state.user.name
  })
)(UserTab)