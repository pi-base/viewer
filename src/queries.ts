import * as I from 'immutable'

import { Finder } from './models/Finder'
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
  if (!q) { return '' }

  const frag = getFragment(q)
  const rexp = new RegExp(escapeRegExp(frag) + '$')

  return q.replace(rexp, expanded)
}

// Other exports

export function suggestionsFor(finder: Finder<T.Property>, query: string, limit: number): I.List<T.Property> {
  return finder.search(getFragment(query), limit).toList()
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
