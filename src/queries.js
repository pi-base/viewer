import * as I from 'immutable'

import * as F from './models/Formula'


// Utilities

const hydrateTheorem = (state, t) => {
  const hydrate = (f) =>
    F.map(f.toJS(), (p) => {
      return state.getIn(['properties', p]).toJS()
    })

  return t.merge({
    antecedent: hydrate(t.get('antecedent')),
    consequent: hydrate(t.get('consequent'))
  })
}

const matches = (formula, traits) => {
  return formula.check((prop, targetValue) => {
    const t = traits.find(t => t.get('property') === prop.uid)
    return t && t.get('value') === targetValue
  })
}

const getFragment = (str) => {
  if (!str) {
    return ''
  }
  const parts = str.split(/[~+&|\(\)]/)
  return parts[parts.length - 1].trim()
}

const findAll = (coll, ids) => {
  return ids.map((id) => coll.get(id))
}


// Generic finders

const all = (coll, key) => {
  key = key || 'name'
  return (state) => {
    const objs = state.get(coll) || I.List()
    return objs.sortBy(obj => obj.get(key)).valueSeq()
  }
}

export const allSpaces = all('spaces')
export const allTheorems = (state) => {
  const ts = all('theorems', 'uid')(state)
  return ts.map(t => hydrateTheorem(state, t))
}

const scan = (coll, key) =>
  (state, val) => {
    const objs = state.get(coll)
    const obj = objs.find((o, _id) => o.get(key) === val)
    return obj ? obj.toJS() : obj
  }

export const findSpace = scan('spaces', 'name')
export const findProperty = scan('properties', 'name')

const fetchTheorem = (state) => {
  return (id) => {
    const t = state.getIn(['theorems', id])
    return hydrateTheorem(state, t)
  }
}

export const findTheorem = (state, id) => fetchTheorem(state)(id)

const fetchTrait = (state) =>
  (id) => {
    const t = state.getIn(['traits', id])
    return t.merge({
      space: state.getIn(['spaces', t.get('space')]),
      property: state.getIn(['properties', t.get('property')])
    })
  }


// Other exports

export const parseFormula = (state, q) => {
  const parsed = F.parse(q)
  if (!parsed) {
    return
  }
  const finder = state.get('properties.finder')
  const formula = parsed.mapProperty(p => {
    const id = finder.getId(p)
    return state.getIn(['properties', id]).toJS()
  })
  // TODO: show error if properties not found

  return formula
}

export const runSearch = (state, formula) => {
  if (!formula) {
    return I.List()
  }

  const spaceIds = state.get('traitTable').filter((traits) => {
    return matches(formula, traits)
  }).keySeq()

  return findAll(state.get('spaces'), spaceIds)
}

export const suggestionsFor = (state, query, limit) => {
  if (!query) {
    return []
  }

  const finder = state.get('properties.finder')
  return finder.suggestionsFor(getFragment(query), limit)
}

export const spaceTraits = (state, space) => {
  const traits = state.getIn(['traitTable', space.uid])
  return traits.map(t => t.merge({
    space: state.getIn(['spaces', t.get('space')]),
    property: state.getIn(['properties', t.get('property')])
  })).sortBy((t, _id) => t.getIn(['property', 'name'])).toJS()
}

export const findTrait = (state, space, property) => {
  const s = findSpace(state, space)
  const p = findProperty(state, property)
  const trait = state.getIn(['traitTable', s.uid]).find(t => {
    return t.get('property') === p.uid
  }).toJS()

  trait.space = s
  trait.property = p
  return trait
}

export const getProof = (state, trait) => {
  const proof = state.getIn(['proofs', trait.uid])

  if (!proof) {
    return
  }
  return I.Map({
    theorems: proof.get('0').map(fetchTheorem(state)),
    traits: proof.get('1').map(fetchTrait(state))
  }).toJS()
}

export const counterexamples = (state, theorem) => {
  const ant = F.fromJSON(theorem.antecedent)
  const con = F.fromJSON(theorem.consequent)

  const f = new F.Conjunction([
    F.negate(ant),
    con
  ])

  return runSearch(state, f)
}
