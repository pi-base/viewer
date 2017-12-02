import * as React from 'react'
import { observer } from 'mobx-react'

import * as T from '../types'
import store from '../store'

class User extends React.Component<{}, {}> {
  render() {
    const branch = (name: T.Branch) => () => {
      store.changeBranch(name)
    }

    return (
      <div>
        <h1>{store.user.current.name}</h1>

        <h3>Branch</h3>
        <p>{store.branch}</p>

        <button onClick={branch('audited')}>Reviewed</button>
        <button onClick={branch('user')}>User</button>
      </div>
    )
  }
}

export default User
