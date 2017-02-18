import I from 'immutable'

import * as A from './actions'

import PropertyFinder from './models/PropertyFinder'

const index = (key, collection) => {
  return I.Map(collection.map(obj => [obj.get(key), obj]))
}

const reducer = (state, action) => {
  state = state || I.fromJS({
    spaces: [],
    properties: [],
    traits: [],
    theorems: []
  })

  switch (action.type) {
    case A.fetch(A.DONE, A.OBJECTS):
      const u = I.fromJS(action.payload)

      return state.merge({
        spaces: index('uid', u.get('spaces')),
        properties: index('uid', u.get('properties')),
        'properties.finder': new PropertyFinder(u.get('properties').toJS()),
        theorems: index('uid', u.get('theorems')),
        // TODO: unify these two vvv
        traits: index('uid', u.get('traits')),
        traitTable: u.get('traits').groupBy(t => t.get('space')),
        proofs: u.get('proofs')
      })

    default:
      return state
  }
}

export default reducer
