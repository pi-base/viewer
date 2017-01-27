import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import * as actions from './actions'
import * as queries from './queries'

const search = (state, action) => {
    return state || { q: '', results: [], formula: null }
}
const noop = (state, action) => (state || {})

const reducers = combineReducers({
    search: search,
    form:   formReducer,

    // TODO: ...
    spaces:     noop,
    properties: noop,
    traits:     noop
})

const reducer = (state, action) => {
    state = reducers(state, action)

    switch (action.type) {
    case '@@redux-form/CHANGE':
        if (action.meta.form !== 'search' || action.meta.field !== 'q') {
            return state
        }
        state.search.q = action.payload

        const formula = queries.parseSearchFormula(state, action.payload)
        if (formula) {
            state.search.formula = formula
            state.search.results = queries.runSearch(state, formula)
        }
        return state
    case 'FETCH_DONE':
        state.spaces     = action.payload.spaces
        state.properties = action.payload.properties
        state.traits     = action.payload.traits
        return state
    default:
        return state
    }
}

export default reducer