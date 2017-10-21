import * as I from 'immutable'

import report from './errors'
import * as F from './models/Formula'
import * as Q from './queries'
import * as T from './types'

export type Disproof = I.List<T.Theorem> | 'tautology'

interface Proof {
  theorem: T.Id,
  properties: T.Id[]
}

type Formula = F.Formula<T.Id>

function evaluate(f: Formula, traitMap: I.Map<string, { value: boolean }>) {
  const boolMap = traitMap.map(trait => trait!.value).toMap()
  return F.evaluate(f, boolMap)
}

function buildContradiction(
  theoremsById: I.Map<T.Id, T.Theorem>,
  theorem: T.Theorem,
  proofs: Map<T.Id, Proof>
): Disproof {
  if (theorem.uid === 'given') { return 'tautology' }

  let theoremUsedByProp = new Map<T.Id, T.Id>() // propertyId => theoremId that proved it
  let properties = Q.theoremProperties(theorem).toJS()

  while (properties.length > 0) {
    const pid = properties.shift()
    if (!theoremUsedByProp.get(pid)) {
      const ev = proofs.get(pid)
      if (ev) { // TODO: understand when this happens
        if (ev.theorem !== 'given') {
          theoremUsedByProp = theoremUsedByProp.set(pid, ev.theorem)
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
  theorem: T.Theorem
  support: I.Set<T.Id> // list of property ids
  traits: Map<T.Id, boolean> // propertyId => value
  recordProof: (property: T.Id, proof: Proof) => any
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

      const value = F.evaluate(sf, I.Map(traits)) // FIXME: should we need this conversion?
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
      const falseProps = result.falses.reduce(
        (acc, f) => {
          return acc.union(F.properties(f))
        },
        I.Set<T.Id>()
      )

      if (result.falses.length === formula.subs.size) {
        throw { theorem, properties: falseProps }
      } else if (result.unknown) {
        force({
          ...opts,
          formula: result.unknown,
          support: support.union(falseProps)
        })
      }
    }

    // Atom
  } else {
    const property = formula.property
    const trait = traits.get(property)
    if (trait) {
      if (trait !== formula.value) {
        throw { theorem, properties: [property] }
      }
    } else {
      traits.set(property, formula.value)
      recordProof(property, {
        theorem: theorem.uid,
        properties: support.toArray()
      })
    }
  }
}

export function disprove(theorems: I.List<T.Theorem>, formula: Formula): (Disproof | undefined) {
  let traits = new Map<string, boolean>()
  let contradiction: Disproof | undefined = undefined

  let theoremsByProp = {}
  theorems.forEach((t: T.Theorem) => {
    Q.theoremProperties(t).forEach((uid: T.Id) => {
      theoremsByProp[uid] = theoremsByProp[uid] || []
      theoremsByProp[uid].push(t)
    })
  })

  let checkQ: T.Theorem[] = []
  let proofs = new Map()

  const recordProof = (property: T.Id, proof: Proof) => {
    if (!proofs.get(property)) {
      proofs.set(property, proof)
      const q = theoremsByProp[property] || []
      checkQ = checkQ.concat(q)
    }
  }

  function apply(theorem: T.Theorem) {
    const a = theorem.if
    const c = theorem.then
    const ts = I.Map<string, boolean>(traits)
    const av = F.evaluate(a, ts)
    const cv = F.evaluate(c, ts)

    if (av === true && cv === false) {
      throw { theorem, properties: F.properties(a).union(F.properties(c)) }
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

  try {
    force({
      support: I.Set(),
      theorem: ({ uid: 'given' } as any), // FIXME
      formula,
      traits,
      recordProof
    })

    while (checkQ.length > 0) {
      const theorem = checkQ.shift()
      const before = I.Map(traits)
      apply(theorem!)
      if (I.Map(traits) !== before) {
        // If our initial formula to force is (a | b) => c
        //   and we have just proved ~b, we need to re-force
        // TODO: diff traits and only run this when the formula applies
        force({
          support: I.Set(),
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
export function proveConverse(theorems: I.List<T.Theorem>, theorem: T.Theorem): Disproof | undefined {
  return disprove(
    theorems,
    F.and(
      F.negate(theorem.if),
      theorem.then
    )
  )
}
