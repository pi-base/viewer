import { Action } from '../actions'

export type State = {
  name: string
  token: string
} | 'unauthenticated'

export const initial = 'unauthenticated'

export const reducer = (
  state: State | undefined,
  action: Action
) => {
  state = state || initial as State

  switch (action.type) {
    case 'LOGIN':
      return {
        name: action.user.name,
        token: action.token
      }
    default:
      return state
  }
}

export default reducer