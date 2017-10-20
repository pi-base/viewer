import * as React from 'react'
import { connect } from 'react-redux'
import { graphql, gql, compose } from 'react-apollo'

const User = props => {
  if (props.data.loading || !props.user) { return null }

  const branch = (name) => () => {
    props.changeBranch(name)
  }

  return (
    <div>
      <h1>{props.data.me.name}</h1>

      <h3>Branch</h3>
      <p>{props.user.branch}</p>

      <button onClick={branch('default')}>Default</button>
      <button onClick={branch('user')}>User</button>
    </div>
  )
}

export default compose(
  graphql(gql`{
    me {
      name
    }
  }`)
)(User)
