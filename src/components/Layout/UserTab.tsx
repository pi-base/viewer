import * as React from 'react'
import { connect } from 'react-redux'
import { graphql, gql } from 'react-apollo'
import { Link } from 'react-router'

import { client } from '../../graph'
import * as T from '../../types'

interface GraphProps {
  me: {
    name: string
  }
}

interface Props {
  data?: GraphProps
}

function UserTab(user?: T.User) {
  return (
    <ul className="nav navbar-nav pull-right">
      { user
      ? (
        <li>
          <Link to="/user">{user.name}</Link>
        </li>
      )
      : (
        <li>
          <a href={client.loginUrl({redirectTo: window.location})}>
            Login with Github
          </a>
        </li>
      ) }
    </ul>
  )
}

export default connect(
  (state) => ({
    user: state.user
  })
)(UserTab)
