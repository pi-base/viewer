import * as A from '../actions'
import * as T from '../types'

const initialState: T.UserState = {
    name: null,
    token: null,
    branch: 'default'
}

function reducer(previous: T.UserState = initialState, action: A.Action): T.UserState {
    switch (action.type) {
        case 'SET_USER':
            return { ...previous, name: action.user.name }
        case 'SET_TOKEN':
            return { ...previous, token: action.token }
        case 'CHANGE_BRANCH':
            return { ...previous, branch: action.branch }
        default:
            return previous
    }
}

export default reducer