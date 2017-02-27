import * as I from 'immutable'

import * as F from './models/Formula'


// Utilities

const hydrateTheorem = (state, t) => {
  // TODO: refactor formulae to be immutable
  const hydrate = (f) =>
    F.map(f.toJS(), (p) => {
      return state.getIn(['properties', p]).toJS()
    })

  return t.merge({
    antecedent: hydrate(t.get('antecedent')),
    consequent: hydrate(t.get('consequent'))
  })
}

const escapeRegExp = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string

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
  const rexp = new RegExp(escapeRegExp(frag) + '$')

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

// Filtration

export const filterByText = (state, {
  text,
  spaces
}) => {
  const finder = state.get('spaces.finder')
  spaces = spaces || state.get('spaces')

  if (!text) {
    return spaces
  }

  const matches = finder.search(text)
  return I.OrderedMap(matches.map(uid => [uid, spaces.get(uid)]))
}

export const filterByFormula = (state, {
  formula,
  spaces,
  value
}) => {
  return spaces.filter(s => {
    const traits = state.getIn(['traitTable', s.get('uid')])
    if (!traits) {
      return false
    }
    return formula.evaluate(traits) === value
  })
}

export const filter = (state, {
  text,
  formula,
  spaces,
  value
}) => {
  // TODO: validate params
  spaces = spaces || state.get('spaces')
  if (formula) {
    return filterByFormula(state, {
      formula,
      spaces,
      value
    })
  } else {
    return filterByText(state, {
      text,
      spaces
    })
  }
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
      if (!id) {
        throw new Error("id not found")
      }
      return state.getIn(['properties', id])
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

const searchByFormula = (state, formula, value = true) => {
  return state.get('traitTable').filter((traits) => {
    return formula.evaluate(traits) === value
  }).keySeq()
}

const searchWhereUnknown = (state, formula) =>
  searchByFormula(state, formula, undefined)


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
    return I.List([])
  }

  const finder = state.get('properties.finder')
  return finder.suggestionsFor(getFragment(query), limit)
}

export const spaceTraits = (state, space) => {
  const traits = state.getIn(['traitTable', space.get('uid')])
  if (!traits) {
    return I.List([])
  }

  return traits.valueSeq().map(t => t.merge({
    space: state.getIn(['spaces', t.get('space')]),
    property: state.getIn(['properties', t.get('property')])
  })).sortBy((t, _id) => t.getIn(['property', 'name'])).toList()
}

export const traitTable = (state, spaces, properties) => {
  // TODO: actually filter?
  return state.get('traitTable')
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
  const proof = state.getIn(['proofs', trait.get('uid')])

  if (!proof) {
    return
  }
  return I.Map({
    theorems: proof.get('0').map(fetchTheorem(state)),
    traits: proof.get('1').map(fetchTrait(state))
  })
}

export const counterexamples = (state, theorem) => {
  const f = F.and([
    F.negate(theorem.get('antecedent')),
    theorem.get('consequent')
  ])

  return searchByFormula(state, f).map(id => state.getIn(['spaces', id]))
}

export const theoremProperties = (t) => {
  const a = F.properties(t.get('antecedent'))
  const c = F.properties(t.get('consequent'))

  return I.List(a.concat(c))
}

export const relatedTheorems = (state, prop) => {
  return state.get('theorems').filter(t => {
    return theoremProperties(t).includes(prop.get('uid'))
  }).keySeq().map(id => findTheorem(state, id))
}
