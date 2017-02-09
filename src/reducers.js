import I from 'immutable'

import Universe from './models/Universe'

import * as actions from './actions'

const reducer = (state, action) => {
  state = state || I.Map({
    universe: null
  })

  switch (action.type) {
    case actions.CACHE_UNIVERSE:
      return state.merge({
        universe: new Universe(
          action.payload.spaces,
          action.payload.properties,
          JSON.parse(action.payload.traitTable)
        )
      })

    default:
      return state
  }
}

export default reducer
