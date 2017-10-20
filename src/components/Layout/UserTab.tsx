import * as React from 'react'
import { graphql, gql } from 'react-apollo'
import { Link } from 'react-router'

import { observer } from 'mobx-react'
import store from '../../store'

import { client } from '../../graph'
import * as T from '../../types'

interface Props {
  user: T.UserState
}

@observer
class UserTab extends React.Component {
  render() {
    const user = store.user.current
    return (
      <ul className="nav navbar-nav pull-right">
        <li>
          {user
            ? <Link to="/user">{user.name}</Link>
            : <a href={client.loginUrl({ redirectTo: window.location })}>
              Login with Github
          </a>
          }
        </li>
      </ul>
    )
  }
}

export default UserTab