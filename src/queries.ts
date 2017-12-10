import { Finder } from './models/Finder'
import * as F from './models/Formula'
import { Id, Property, Theorem } from './types'
import { union } from './utils'

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

export const parseFormula = (
  finder: Finder<Property>,
  text: string
): F.Formula<Id> | undefined => {
  const parsed = F.parse(text)
  if (!parsed) { return }

  let errors = false
  const result = F.mapProperty(
    id => {
      const property = finder.find(id)
      if (!property) { errors = true }
      return property as Property
    },
    parsed
  )
  return errors ? undefined : F.mapProperty(p => p.uid, result)
}

export function suggestionsFor(finder: Finder<Property>, query: string, limit: number): Property[] {
  return finder.search(getFragment(query), limit)
}

export function theoremProperties(t: Theorem): Set<Id> {
  return union(F.properties(t.if), F.properties(t.then))
}

export function relatedTheorems(
  theorems: Theorem[],
  prop: Property
): Theorem[] {
  return theorems.filter(t => {
    return theoremProperties(t).has(prop.uid)
  })
}
