import * as I from 'immutable'

import * as F from './models/Formula'
import * as T from './types'

// Utilities

const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getFragment = (str: string) => {
  if (!str) {
    return ''
  }
  const parts = str.split(/[~+&|\(\)]/)
  return parts[parts.length - 1].trim()
}

export const replaceFragment = (q: string, expanded: string) => {
  if (!q) {
    return ''
  }

  const frag = getFragment(q)
  const rexp = new RegExp(escapeRegExp(frag) + '$')

  return q.replace(rexp, expanded)
}

// Generic finders

function all<T>(coll: string, key: string = 'name') {
  return (state: T.StoreState) => {
    const objs = state[coll] || I.List()
    return objs.sortBy((obj: I.Map<string, T>) =>
      obj[key]
    ).valueSeq()
  }
}

export const allSpaces     = all<T.Space>('spaces')
export const allProperties = all<T.Property>('properties')
export const allTheorems   = all<T.Theorem>('theorems')

export const findSpace = (state: T.StoreState, uid: T.Id) =>
  state.spaces.get(uid)
export const findProperty = (state: T.StoreState, uid: T.Id) =>
  state.properties.get(uid)

export const findTraitById = (state: T.StoreState, uid: T.Id) => {
  throw new Error('FIXME: findTrait (by id)')
}

const fetchTheorem = (state: T.StoreState) => {
  return (id: T.Id) => {
    return state.theorems.get(id)
  }
}

export const findTheorem = (state: T.StoreState, id: T.Id) =>
  fetchTheorem(state)(id)

export const fetchTrait = (state: T.StoreState) =>
  (id: T.Id) => state.traits.get(id)

// Filtration

export function filterByText(
  state: T.StoreState,
  { text, spaces }: { text?: string, spaces?: I.List<T.Space> }
): I.List<T.Space> {
  const finder = state['spaces.finder']
  spaces = spaces || I.List(state.spaces.values())

  if (!text) { return spaces }

  return I.List<T.Space>(finder.search(text)) // FIXME: might have results not in `spaces`
}

export function filterByFormula(
  state: T.StoreState,
  { formula, spaces }: { formula: T.Formula, spaces: I.List<T.Space> }
): I.List<T.Space> {
  return spaces.filter((s: T.Space) => {
    const traits = state.traits.get(s.uid)
    if (!traits) { return false }

    return F.evaluate(formula, traits) === true
  }).toList()
}

export function filter(
  state: T.StoreState,
  { text, formula, spaces }: { text?: string, formula?: T.Formula, spaces?: I.List<T.Space> }
): I.List<T.Space> {
  // TODO: validate params
  spaces = spaces || state.spaces.valueSeq().toList()
  if (formula) {
    return filterByFormula(state, { formula, spaces })
  } else {
    return filterByText(state, { text, spaces })
  }
}

// Other exports

export function parseFormula(state: T.StoreState, q: string) {
  const parsed = F.parse(q)
  if (!parsed) { return }

  const finder = state['properties.finder']

  try {
    const f = (p: string) => {
      const id = finder.getId(p)
      if (!id) {
        throw new Error('id not found')
      }
      return state.properties.get(id)
    }
    return F.mapProperty(f, parsed)
  } catch (e) {
    // TODO: show error if properties not found
    return
  }
}

export function suggestionsFor(state: T.StoreState, query: string, limit: number): I.List<T.Property> {
  if (!query) { return I.List([]) }

  const finder = state['properties.finder']
  return finder.search(getFragment(query), limit).toList()
}

export function spaceTraits(
  state: T.StoreState,
  space: T.Space
): I.Iterable<number, T.Trait> {
  const traits = state.traits.get(space.uid) || I.Map()
  return traits.valueSeq().sortBy((t: T.Trait) => t.property.name)
}

export function findTrait(state: T.StoreState, spaceId: string, propertyId: string) {
  return state.traits.getIn([spaceId, propertyId])
}

export function getProof(state: T.StoreState, trait: T.Trait): T.Proof | undefined {
  const proof = state.proofs.get(trait.uid)

  if (!proof) { return }

  return {
    theorems: proof.theorems.map(id => findTheorem(state, id!)).toList(),
    traits:   proof.traits.map(id => findTraitById(state, id!)).toList()
  }
}

export function hasProof(state: T.StoreState, trait: T.Trait) {
  return state.proofs.has(trait.uid)
}

export function counterexamples(state: T.StoreState, theorem: T.Theorem) {
  const formula = F.and(F.negate(theorem.if), theorem.then)
  return filterByFormula(state, {formula, spaces: state.spaces.valueSeq().toList()})
}

export function theoremProperties(t: T.Theorem) {
  return F.properties(t.if).union(F.properties(t.then))
}

export function relatedTheorems(state: T.StoreState, prop: T.Property) {
  return allTheorems(state).filter((t: T.Theorem) => {
    return theoremProperties(t).includes(prop)
  }).valueSeq().toList()
}
