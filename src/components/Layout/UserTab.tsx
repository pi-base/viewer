import * as React from 'react'
import { connect } from 'react-redux'
import { graphql, gql } from 'react-apollo'
import { Link } from 'react-router'

import { client } from '../../graph'
import * as T from '../../types'

interface Props {
  user: T.UserState
}

function UserTab({ user }: Props) {
  return (
    <ul className="nav navbar-nav pull-right">
      <li>
        {user.name
          ? <Link to="/user">{user.name}</Link>
          : <a href={client.loginUrl({ redirectTo: window.location })}>
            Login with Github
          </a>
        }
      </li>
    </ul>
  )
}

export default connect(
  (state) => ({ user: state.user })
)(UserTab)
