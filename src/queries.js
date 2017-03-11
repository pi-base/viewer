import * as I from 'immutable'

import * as F from './models/Formula'

// Utilities

const escapeRegExp = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

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
export const allTheorems = all('theorems')

export const findSpace = (state, uid) => state.getIn(['spaces', uid])
export const findProperty = (state, uid) => state.getIn(['properties', uid])

const fetchTheorem = (state) => {
  return (id) => {
    return state.getIn(['theorems', id])
  }
}

export const findTheorem = (state, id) => fetchTheorem(state)(id)

export const fetchTrait = (state) =>
  (id) => {
    const t = state.getIn(['traits', id])
    if (!t) {
      return
    }
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
  spaces
}) => {
  return spaces.filter(s => {
    const traits = state.getIn(['traitTable', s.get('uid')])
    if (!traits) {
      return false
    }

    return formula.evaluate(traits)
  })
}

export const filter = (state, {
  text,
  formula,
  spaces
}) => {
  // TODO: validate params
  spaces = spaces || state.get('spaces')
  if (formula) {
    return filterByFormula(state, {
      formula,
      spaces
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

// TODO: do we still need this?
const searchByFormula = (state, formula, value = true) => {
  return state.get('traitTable').filter((traits) => {
    return formula.evaluate(traits) === value
  }).keySeq()
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

export const findTrait = (state, spaceId, propertyId) => {
  const s = findSpace(state, spaceId)
  const p = findProperty(state, propertyId)

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

export const hasProof = (state, trait) => {
  return state.hasIn(['proofs', trait.get('uid')])
}

export const counterexamples = (state, theorem) => {
  const f = F.and(
    theorem.get('if').negate(),
    theorem.get('then')
  )

  return searchByFormula(state, f).map(id => state.getIn(['spaces', id]))
}

export const theoremProperties = (t) => {
  return t.get('if').properties().union(
    t.get('then').properties()
  )
}

export const relatedTheorems = (state, prop) => {
  return allTheorems(state).filter(t => {
    return theoremProperties(t).includes(prop)
  }).valueSeq().toList()
}
