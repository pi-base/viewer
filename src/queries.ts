import * as I from 'immutable'

import { Finder } from './models/PropertyFinder'
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

function all<X>(coll: string, key: string = 'name') {
  return (state: T.StoreState) => {
    const objs = state[coll] || I.List()
    return objs.sortBy((obj: I.Map<string, X>) =>
      obj[key]
    ).valueSeq()
  }
}

export const allSpaces = all<T.Space>('spaces')
export const allProperties = all<T.Property>('properties')
export const allTheorems = all<T.Theorem>('theorems')

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
  finder: Finder<T.Space>,
  spaces: I.List<T.Space>,
  text: string | undefined
): I.List<T.Space> {
  if (!text) { return spaces }
  return I.List<T.Space>(finder.search(text)) // FIXME: might have results not in `spaces`
}

export function filterByFormula(
  traits: T.TraitTable,
  spaces: I.List<T.Space>,
  formula: T.Formula
): I.List<T.Space> {
  return spaces.filter((s: T.Space) => {
    const ts = traits.get(s.uid)
    if (!ts) { return false }
    return F.evaluate(formula, ts) === true
  }).toList()
}

export function filter(
  finder: Finder<T.Space>,
  traits: T.TraitTable,
  spaces: I.List<T.Space>,
  { text, formula }: { text?: string, formula?: T.Formula }
): I.List<T.Space> {
  // TODO: validate params
  if (formula) {
    spaces = filterByFormula(traits, spaces, formula)
  }
  if (text) {
    spaces = filterByText(finder, spaces, text)
  }
  return spaces
}

// Other exports

export function parseFormula(
  finder: Finder<T.Property>,
  q: string
): F.Formula<T.Property> | undefined {
  const parsed = F.parse(q)
  if (!parsed) { return }

  try {
    const f = (p: string) => {
      const property = finder.find(p)
      if (!property) {
        throw new Error('id not found')
      }
      return property
    }
    return F.mapProperty(f, parsed)
  } catch (e) {
    // TODO: show error if properties not found
    return
  }
}

export function suggestionsFor(finder: Finder<T.Property>, query: string, limit: number): I.List<T.Property> {
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
    traits: proof.traits.map(id => findTraitById(state, id!)).toList()
  }
}

export function hasProof(state: T.StoreState, trait: T.Trait) {
  return state.proofs.has(trait.uid)
}

export function counterexamples(
  spaces: I.List<T.Space>,
  traits: T.TraitTable,
  theorem: T.Theorem
): I.List<T.Space> {
  const formula = F.and(F.negate(theorem.if), theorem.then)
  return filterByFormula(traits, spaces, formula)
}

export function theoremProperties(t: T.Theorem) {
  return F.properties(t.if).union(F.properties(t.then))
}

export function relatedTheorems(
  theorems: I.List<T.Theorem>,
  prop: T.Property
): I.List<T.Theorem> {
  return theorems.filter((t: T.Theorem) => {
    return theoremProperties(t).includes(prop)
  }).valueSeq().toList()
}
