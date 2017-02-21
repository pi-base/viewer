import I from 'immutable'

import * as A from './actions'

import PropertyFinder from './models/PropertyFinder'

const index = (map, collectionK, idK) => {
  idK = idK || 'uid'
  return I.Map(map.get(collectionK).map(obj => [obj.get(idK), obj]))
}

const reducer = (state, action) => {
  state = state || I.fromJS({
    spaces: {},
    'spaces.finder': null,
    properties: {},
    'properties.finder': null,
    traits: {},
    theorems: {},
    traitTable: {},
    proofs: {}
  })

  switch (action.type) {
    case A.fetch(A.DONE, A.OBJECTS):
      const u = I.fromJS(action.payload)

      return state.merge({
        spaces: index(u, 'spaces'),
        'spaces.finder': new PropertyFinder(u.get('spaces').toJS()),
        properties: index(u, 'properties'),
        'properties.finder': new PropertyFinder(u.get('properties').toJS()),
        theorems: index(u, 'theorems'),
        // TODO: unify these two vvv
        traits: index(u, 'traits'),
        traitTable: u.get('traits').groupBy(t => t.get('space')).map(
          ts => I.Map(ts.map(t => [t.get('property'), t]))
        ),
        proofs: u.get('proofs')
      })

    default:
      return state
  }
}

export default reducer
