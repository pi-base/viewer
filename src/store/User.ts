import { computed, observable } from 'mobx'

import * as T from '../types'

class User {
  @observable name: string

  @computed get current(): T.User | undefined {
    if (name) {
      return { name: this.name }
    }
    return
  }
}

export default User