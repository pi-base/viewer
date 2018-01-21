import * as React from 'react'
import { Dispatch, connect } from 'react-redux'

import Branches from './Branch/Table'

import { Action, State, User } from '../types'

type StateProps = {
  user: {
    name: string
  } | undefined
}
type Props = StateProps

const User = ({ user }: Props) => {
  if (!user) {
    return (<div />)
  } else {
    return (
      <div className="container">
        <h1>{user.name}</h1>
        <Branches />
      </div>
    )
  }
}

export default connect<StateProps>(
  (state: State): StateProps => {
    if (state.user === 'unauthenticated') {
      return { user: undefined }
    } else {
      return { user: { name: state.user.name } }
    }
  }
)(User)
