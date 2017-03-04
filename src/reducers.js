import I from 'immutable'

import * as A from './actions'

import * as F from './models/Formula'
import PropertyFinder from './models/PropertyFinder'

const index = (map, collectionK, idK) => {
  idK = idK || 'uid'
  return I.Map(map.get(collectionK).map(obj => [obj.get(idK), obj]))
}

const hydrate = (state) => {
  const h = (f) =>
    F.fromJSON(f.toJS()).mapProperty(p => state.getIn(['properties', p]))

  const theorems = state.get('theorems').map(t => {
    return t.merge({
      antecedent: h(t.get('antecedent')),
      consequent: h(t.get('consequent'))
    })
  })

  return state.merge({
    theorems: theorems
  })
}

const init = I.fromJS({
  version: {},
  spaces: {},
  'spaces.finder': null,
  properties: {},
  'properties.finder': null,
  traits: {},
  theorems: {},
  traitTable: {},
  proofs: {}
})

const reducer = (state, action) => {
  state = state || init

  switch (action.type) {
    case A.fetch(A.DONE, A.OBJECTS):
      const u = I.fromJS(action.payload)

      return hydrate(state.merge({
        spaces: index(u, 'spaces'),
        'spaces.finder': new PropertyFinder(u.get('spaces')),
        properties: index(u, 'properties'),
        'properties.finder': new PropertyFinder(u.get('properties')),
        theorems: index(u, 'theorems'),
        // TODO: unify these two vvv
        traits: index(u, 'traits'),
        traitTable: u.get('traits').groupBy(t => t.get('space')).map(
          ts => I.Map(ts.map(t => [t.get('property'), t]))
        ),
        proofs: u.get('proofs')
      }))

    case A.PAGE_NOT_FOUND:
      if (window.Rollbar) {
        window.Rollbar.info('404', {
          path: action.path
        })
      }
      return state

    default:
      return state
  }
}

export default reducer
