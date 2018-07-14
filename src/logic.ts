import * as F from './models/Formula'
import * as I from 'immutable'
import * as Q from './queries'
import * as T from './types'

import { TraitData } from './reducers/traits'
import { union } from './utils'

export type Proof = I.List<T.Theorem> | 'tautology'

type Evidence = {
  theorem: T.Id,
  properties: T.Id[]
}

type Formula = F.Formula<T.Id>

export const converse = (theorem: T.Theorem): T.Theorem => ({
  ...theorem,
  if: theorem.then,
  then: theorem.if
})

const evaluate = (f: Formula, traitMap: Map<string, { value: boolean }>) => {
  let boolMap = new Map()
  traitMap.forEach((t, id) => boolMap.set(id, t.value))
  return F.evaluate(f, boolMap)
}

function buildContradiction(
  theoremsById: I.Map<T.Id, T.Theorem>,
  theorem: T.Theorem,
  proofs: Map<T.Id, Evidence>
): Proof {
  if (theorem.uid === 'given') { return 'tautology' }

  let theoremUsedByProp = new Map<T.Id, T.Id>() // propertyId => theoremId that proved it
  let properties = Array.from(Q.theoremProperties(theorem))

  while (properties.length > 0) {
    const pid = properties.shift()
    if (!theoremUsedByProp.get(pid!)) {
      const ev = proofs.get(pid!)
      if (ev) { // TODO: understand when this happens
        if (ev.theorem !== 'given') {
          theoremUsedByProp = theoremUsedByProp.set(pid!, ev.theorem)
        }
        properties = properties.concat(ev.properties)
      }
    }
  }

  let theoremIds = I.List<T.Id>(theoremUsedByProp.values()).push(theorem.uid)
  return theoremIds.map(id => theoremsById.get(id!)).toList()
}

interface ForceOptions {
  formula: Formula,
  theorem: { uid: T.Id | 'given' }
  support: Set<T.Id> // list of property ids
  traits: Map<T.Id, TraitData> // propertyId => value
  recordProof: (property: T.Id, value: boolean, proof: Evidence) => void
}
function force(opts: ForceOptions) {
  const { formula, theorem, support, traits, recordProof } = opts

  // And
  if (formula.kind === 'and') {
    formula.subs.forEach((sf: Formula) => force({ ...opts, formula: sf }))

    // Or
  } else if (formula.kind === 'or') {
    interface OrMeta {
      falses: Formula[]
      unknown: Formula | undefined
    }
    const reducer = (meta: OrMeta | undefined, sf: Formula) => {
      if (!meta) { return undefined }

      const value = evaluate(sf, traits) // FIXME: should we need this conversion?
      if (value === true) {
        return undefined // Can't force anything
      } else if (value === false) {
        meta.falses.push(sf)
      } else if (meta.unknown) {
        return undefined // Can't determine which to force
      } else {
        meta.unknown = sf
      }
      return meta
    }
    const fs: Formula[] = []
    const result = formula.subs.reduce(reducer, {
      falses: fs,
      unknown: undefined
    })

    if (result) {
      const falseProps = union(...result.falses.map(F.properties))

      if (result.falses.length === formula.subs.length) {
        throw { theorem, properties: falseProps }
      } else if (result.unknown) {
        force({
          ...opts,
          formula: result.unknown,
          support: union(support, falseProps)
        })
      }
    }

    // Atom
  } else {
    const property = formula.property
    const trait = traits.get(property)
    if (trait) {
      if (trait.value !== formula.value) {
        throw { theorem, properties: [property] }
      }
    } else {
      traits.set(property, {
        value: formula.value,
        deduced: true,
        description: '',
        references: []
      })
      recordProof(property, formula.value, {
        theorem: theorem.uid,
        properties: Array.from(support)
      })
    }
  }
}

interface ApplyOptions {
  theorem: T.Theorem
  traits: Map<T.Id, TraitData>
  recordProof: (property: T.Id, value: boolean, proof: Evidence) => void
}
export function apply(opts: ApplyOptions) {
  const { theorem, traits, recordProof } = opts
  const a = theorem.if
  const c = theorem.then
  const av = evaluate(a, traits)
  const cv = evaluate(c, traits)

  if (av === true && cv === false) {
    throw { theorem, properties: union(F.properties(a), F.properties(c)) }
  } else if (av === true) {
    force({
      formula: c,
      support: F.properties(a),
      theorem,
      traits,
      recordProof
    })
  } else if (cv === false) {
    force({
      formula: F.negate(a),
      support: F.properties(c),
      theorem,
      traits,
      recordProof
    })
  }
}

export function disprove(theorems: T.Theorem[], formula: Formula): (Proof | undefined) {
  let traits = new Map<string, TraitData>()
  let contradiction: Proof | undefined = undefined

  let theoremsByProp = {}
  theorems.forEach((t: T.Theorem) => {
    Q.theoremProperties(t).forEach((uid: T.Id) => {
      theoremsByProp[uid] = theoremsByProp[uid] || []
      theoremsByProp[uid].push(t)
    })
  })

  let checkQ: T.Theorem[] = []
  let proofs = new Map()

  const recordProof = (property: T.Id, value: boolean, proof: Evidence) => {
    if (!proofs.get(property)) {
      proofs.set(property, proof)
      const q = theoremsByProp[property] || []
      checkQ = checkQ.concat(q)
    }
  }

  try {
    force({
      support: new Set(),
      theorem: ({ uid: 'given' }),
      formula,
      traits,
      recordProof
    })

    while (checkQ.length > 0) {
      const theorem = checkQ.shift()!
      const before = I.Map(traits)
      apply({ theorem, traits, recordProof })
      if (I.Map(traits) !== before) {
        // If our initial formula to force is (a | b) => c
        //   and we have just proved ~b, we need to re-force
        // TODO: diff traits and only run this when the formula applies
        force({
          support: new Set(),
          theorem: theorem!,
          formula,
          traits,
          recordProof
        })
      }
    }

  } catch (e) {
    if (e.theorem.uid === 'given' && e.properties.length === 1) {
      return 'tautology'
    } else {
      const theoremsById: I.Map<T.Id, T.Theorem> = I.Map<T.Id, T.Theorem>().withMutations(m => {
        theorems.forEach(t => {
          m.set(t!.uid, t!)
        })
      })
      return buildContradiction(theoremsById, e.theorem, proofs)
    }
  }

  return
}

// TODO: this should probably rule out tautologies
export function proveConverse(theorems: T.Theorem[], theorem: T.Theorem): Proof | undefined {
  return disprove(
    theorems,
    F.and(
      F.negate(theorem.if),
      theorem.then
    )
  )
}
