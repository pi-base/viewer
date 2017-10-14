import * as A from '../actions'
import * as T from '../types'

const initialState: T.UserState = {
    user: null,
    token: null,
    branch: 'default'
}

function reducer(previous: T.UserState = initialState, action: A.Action): T.UserState {
    switch (action.type) {
        case 'SET_USER':
            return { ...previous, user: action.user }
        case 'CHANGE_BRANCH':
            return { ...previous, branch: action.branch }
        default:
            return previous
    }
}

export default reducer