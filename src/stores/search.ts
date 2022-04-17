import { Readable, Writable, derived, writable } from 'svelte/store'
import { Formula, formula as F } from '@pi-base/core'
import type { Property } from '../models'
import { resolveProperty, Store } from '../models/Store/state'

export type Query = {
  text?: string
  formula?: Formula<Property>
}

export type SearchStore = {
  text: Writable<string>
  formula: Writable<string>
  query: Readable<Query>
}

export function searchStore(store: Store) {
  const text = writable('')
  const rawFormula = writable('')

  const formula = derived<Readable<string>, Formula<Property> | null>(
    rawFormula,
    ($rawFormula, set) => {
      if ($rawFormula === '') {
        set(null)
      } else {
        const parsed = parse(store, $rawFormula)
        if (parsed) {
          set(parsed)
        }
      }
    }
  )

  const query = derived([text, formula], ([$text, $formula]) => ({
    text: $text,
    formula: $formula,
  }))

  return {
    text,
    formula: rawFormula,
    query,
  }
}

function parse(store: Store, q: string): Formula<Property> | null {
  const parsed = F.parse(q)
  if (!parsed) {
    return null
  }

  const resolved = F.mapProperty(
    (p: string) => resolveProperty(store, p),
    parsed
  )
  const formula = F.compact(resolved) as Formula<Property>
  return formula || null
}
