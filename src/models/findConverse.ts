import * as F from '@pi-base/core/lib/Formula'
import type { Space, Property, Theorem } from './index'
import type { Store } from './Store/state'
import { default as S, spacesMatching } from './Store'

export type ConverseResults =
  | { kind: 'holds'; theorems: Theorem[] }
  | { kind: 'counterexample_found'; spaces: Space[]; properties: Property[] }

export function findConverse(
  store: Store,
  theorem: Theorem
): ConverseResults | null {
  if (theorem.converse && theorem.converse.length > 0) {
    const theorems = theorem.converse.map((id) => S.theorem(store, id)!) // TODO
    return { kind: 'holds', theorems }
  }

  const condition = F.and(theorem.then, F.negate(theorem.when))
  const properties = Array.from(
    F.properties(condition),
    (id: string) => S.property(store, id)!
  )

  const results = spacesMatching(store, condition)

  if (results.kind === 'spaces' && results.spaces.length > 0) {
    return {
      kind: 'counterexample_found',
      spaces: results.spaces,
      properties,
    }
  } else if (
    results.kind === 'contradiction' &&
    results.contradiction !== 'tautology'
  ) {
    return {
      kind: 'holds',
      theorems: results.contradiction,
    }
  } else {
    return null
  }
}
