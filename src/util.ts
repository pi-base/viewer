import type { Theorem as BTheorem } from '@pi-base/core'
import type { Collection } from './stores'
import type { Property, Theorem } from './types'

import * as F from '@pi-base/core/lib/Formula'

export function hydrate(
  theorem: BTheorem,
  properties: Collection<Property, string>,
): Theorem {
  const { when, then, ...rest } = theorem

  // TODO: handle lookup failure
  const ant = F.mapProperty((p) => properties.find(p) as Property, when)
  const con = F.mapProperty((p) => properties.find(p) as Property, then)
  const name = `${F.render(ant, (p) => p.name)} ⇒ ${F.render(
    con,
    (p) => p.name,
  )}`

  return {
    name,
    when: ant,
    then: con,
    ...rest,
  }
}

export function idToInt(id: string) {
  return parseInt(id.slice(1))
}
