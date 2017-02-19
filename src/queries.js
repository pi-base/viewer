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

export const replaceFragment = (q, expanded) => {
  if (!q) {
    return ''
  }

  const frag = getFragment(q)
  const rexp = new RegExp(frag + '$')

  return q.replace(rexp, expanded)
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
export const allProperties = all('properties')
export const allTheorems = (state) => {
  const ts = all('theorems', 'uid')(state)
  return ts.map(t => hydrateTheorem(state, t))
}

const scan = (state, coll, key, val) => {
  const objs = state.get(coll)
  return objs.find((o, _id) => o.get(key) === val)
}

export const findSpaceByName = (state, name) =>
  scan(state, 'spaces', 'name', name)
export const findPropertyByName = (state, name) =>
  scan(state, 'properties', 'name', name)

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
  try {
    const formula = parsed.mapProperty(p => {
      const id = finder.getId(p)
      return state.getIn(['properties', id]).toJS()
    })
    return formula
  } catch (e) {
    // TODO: show error if properties not found
    return
  }
}

const searchByText = (state, q) => {
  return state.get('spaces.finder').search(q)
}

const searchWhereUnknown = (state, formula) => {
  return state.get('traitTable').filter((traits) => {
    return matches(formula, traits)
  }).keySeq()
}

const searchByFormula = (state, formula) => {
  return state.get('traitTable').filter((traits) => {
    return matches(formula, traits)
  }).keySeq()
}

export const BY_TEXT = 'BY_TEXT'
export const BY_FORMULA = 'BY_FORMULA'
export const WHERE_UNKOWN = 'WHERE_UNKOWN'
export const runSearch = (state, query, formula) => {
  if (!query) {
    return
  }

  let type, ids
  switch (query[0]) {
    case ':':
      type = BY_TEXT
      ids = searchByText(state, query)
      break
    case '?':
      type = WHERE_UNKOWN
      ids = searchWhereUnknown(state, formula)
      break
    default:
      type = BY_FORMULA
      ids = searchByFormula(state, formula)
  }

  const coll = state.get('spaces')
  const spaces = ids.map(id => coll.get(id))

  return {
    type,
    query,
    formula,
    spaces
  }
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
  })).sortBy((t, _id) => t.getIn(['property', 'name']))
}

export const findTrait = (state, space, property) => {
  const s = findSpaceByName(state, space)
  const p = findPropertyByName(state, property)

  const trait = state.getIn(['traitTable', s.get('uid')]).find(t => {
    return t.get('property') === p.get('uid')
  })

  return trait.merge({
    space: s,
    property: p
  })
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
  theorem = theorem.toJS ? theorem.toJS() : theorem

  const f = F.and([
    F.negate(theorem.antecedent),
    theorem.consequent
  ])

  return searchByFormula(state, f).map(id => state.getIn(['spaces', id]))
}

const theoremProperties = (t) => {
  const a = F.properties(t.get('antecedent').toJS())
  const c = F.properties(t.get('consequent').toJS())
  return a.concat(c)
}

export const relatedTheorems = (state, prop) => {
  if (!state) {
    return I.List()
  }

  return state.get('theorems').filter(t => {
    return theoremProperties(t).includes(prop.uid)
  }).keySeq().map(id => findTheorem(state, id))
}
