import { Action } from '../actions'
import { setUser } from '../errors'

export type State = {
  name: string
  token: string
} | 'unauthenticated'

export const initial = 'unauthenticated'

export const reducer = (
  state: State | undefined,
  action: Action
): State => {
  state = state || initial as State

  switch (action.type) {
    case 'LOGIN':
      setUser(action.user)

      return {
        name: action.user.name,
        token: action.token
      }
    case 'LOGOUT':
      return 'unauthenticated'
    default:
      return state
  }
}

export default reducer