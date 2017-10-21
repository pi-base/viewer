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
  traits: T.TraitMap,
  spaces: I.List<T.Space>,
  formula: F.Formula<T.Id>
): I.List<T.Space> {
  return spaces.filter((s: T.Space) => {
    const ts = traits.get(s.uid)
    if (!ts) { return false }
    return F.evaluate(formula, ts) === true
  }).toList()
}

export function filter(
  finder: Finder<T.Space>,
  traits: T.TraitMap,
  spaces: I.List<T.Space>,
  { text, formula }: { text?: string, formula?: F.Formula<T.Id> }
): I.List<T.Space> {
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
  if (!finder) { return }

  const parsed = F.parse('' + q)
  if (!parsed) { return }

  try {
    const f = (p: string) => {
      const property = finder.find(p)
      if (!property) {
        throw new Error(`${p} not found`)
      }
      return property
    }
    return F.mapProperty(f, parsed)
  } catch (e) {
    // TODO: show error if properties not found
    return undefined
  }
}

export function suggestionsFor(finder: Finder<T.Property>, query: string, limit: number): I.List<T.Property> {
  return finder.search(getFragment(query), limit).toList()
}

export function counterexamples(
  spaces: I.List<T.Space>,
  traits: T.TraitMap,
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
    return theoremProperties(t).includes(prop.uid)
  }).valueSeq().toList()
}
