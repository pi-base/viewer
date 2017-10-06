import * as React from 'react'
import { graphql, gql } from 'react-apollo'
import { Link } from 'react-router'

import { GRAPHQL_SERVER_URL } from '../../constants'

interface GraphProps {
  me: {
    name: string
  }
}

interface Props {
  data?: GraphProps
}

function UserTab(data: any) {
  const me = data && data.me

  return (
    <ul className="nav navbar-nav pull-right">
      { me
      ? (
        <li>
          <Link to="/user">{me.name}</Link>
        </li>
      )
      : (
        <li>
          <a href={`${GRAPHQL_SERVER_URL}/auth/page/github/forward?location=${window.location}`}>
            Login with Github
          </a>
        </li>
      ) }
    </ul>
  )
}

export default graphql(gql`{
  me {
    name
  }
  viewer {
    properties {
      uid
      name
    }
  }
}`)(UserTab)
