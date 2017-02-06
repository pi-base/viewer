import {
  combineReducers
} from 'redux-immutable'
import {
  reducer as formReducer
} from 'redux-form'
import I from 'immutable'

import FuzzyFinder from './models/FuzzyFinder'

import * as actions from './actions'
import * as queries from './queries'

const search = (state, action) => {
  state = state || I.Map({
    q: '',
    formula: null
  })
  return state
}

const spaces = (state, action) => {
  state = state || I.Map({
    entities: {},
    finder: null,
    traitFilter: null
  })

  if (action.type === actions.FILTER_SPACE_TRAITS) {
    return state.merge({
      traitFilter: action.payload
    })
  }

  return state
}

const properties = (state, action) => {
  state = state || new I.Map({
    entities: {},
    finder: null
  })

  return state
}

const traits = (state, action) => {
  state = state || {}
  return state
}

const reducers = combineReducers({
  search: search,
  form: formReducer,
  spaces: spaces,
  properties: properties,
  traits: traits
})

const reducer = (state, action) => {
  state = reducers(state, action)

  switch (action.type) {

    // Search form change
    // * needs access to `properties` to parse the formula
    case actions.FORM_CHANGE:
      if (action.meta.form !== 'search' || action.meta.field !== 'q') {
        return state
      }

      let updates = {
        q: action.payload
      }

      const formula = queries.parseSearchFormula(state, action.payload)
      if (formula) {
        updates.formula = formula
      }

      return state.mergeIn(['search'], updates)

    case actions.FETCH_DONE:
      return state.merge({
        spaces: I.fromJS({
          entities: I.Map(action.payload.spaces),
          finder: new FuzzyFinder(action.payload.spaces)
        }),
        properties: I.fromJS({
          entities: I.Map(action.payload.properties),
          finder: new FuzzyFinder(action.payload.properties)
        }),
        traits: I.Map(action.payload.traits)
      })

    default:
      return state
  }
}

export default reducer
