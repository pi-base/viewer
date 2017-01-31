import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import PropertyFinder from './models/PropertyFinder'
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
    let next = Object.assign({}, reducers(state, action))

    switch (action.type) {
    case '@@redux-form/CHANGE':
        if (action.meta.form !== 'search' || action.meta.field !== 'q') {
          return next
        }

        next.search.q = action.payload

        const formula = queries.parseSearchFormula(next, action.payload)
        if (formula) { next.search.formula = formula }
        return next
    case 'FETCH_DONE':
        next.spaces = action.payload.spaces,
        next.properties = action.payload.properties,
        next.traits =action.payload.traits
        next.properties.finder = new PropertyFinder(next.properties)
        return next
    default:
        return next
    }
}

export default reducer
