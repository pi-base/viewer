import * as I from 'immutable'
// import * as D from './display'

import report from './errors'
import * as F from './models/Formula'
import * as Q from './queries'
import * as T from './types'

export type Disproof = I.List<T.Theorem> | 'tautology'

type Evidence = {
  theorem: T.Theorem | 'given'
  properties: I.List<T.Property>
}

type EvidenceMap = I.Map<string, Evidence> // propertyId => ...

function buildContradiction(theorem: T.Theorem | 'given', evidence: EvidenceMap): Disproof {
  if (theorem === 'given') {
    throw new Error('Contradiction from `given`')
  }

  let theorems = I.Map<T.Property, T.Theorem>()
  let properties = Q.theoremProperties(theorem).toJS()

  while (properties.length > 0) {
    const pid = properties.shift().uid
    if (!theorems.get(pid)) {
      const ev = evidence[pid]
      if (ev) { // TODO: understand when this happens
        if (ev.theorem !== 'given') {
          theorems = theorems.set(pid, ev.theorem)
        }
        properties = properties.concat(ev.properties.toJS())
      }
    }
  }

  return theorems.valueSeq().toList().push(theorem)
}

export function disprove(state: T.StoreState, formula: T.Formula): (Disproof | undefined) {
  // console.log(D.formula(state, formula))

  let traits = I.Map<string, { value: boolean, deduced: boolean }>()
  let evidence: EvidenceMap = I.Map<string, Evidence>()
  let contradiction: Disproof | undefined = undefined

  let theoremsByProp = {}
  Q.allTheorems(state).forEach(t => {
    Q.theoremProperties(t).forEach((p: T.Property) => {
      theoremsByProp[p.uid] = theoremsByProp[p.uid] || []
      theoremsByProp[p.uid].push(t)
    })
  })

  let checkQ = []
  const force = (f: T.Formula, theorem: T.Theorem | 'given', properties: I.List<T.Property>) => {
    if (f.kind === 'and') {
      f.subs.forEach((sf: T.Formula) => force(sf, theorem, properties))
    } else if (f.kind === 'or') {
      const reducer = (support, sf: T.Formula) => {
        if (!support) {
          return null
        }

        const value = F.evaluate(sf, traits)
        if (value === true) {
          return null // Can't force anything
        } else if (value === false) {
          support.falses.push(F.properties(sf))
        } else if (support.unknown) {
          return null // Can't determine which to force
        } else {
          support.unknown = sf
        }
        return support
      }
      const result = f.subs.reduce(reducer, {
        falses: [],
        unknown: null
      })

      if (result) {
        if (result.falses.length === f.subs.size) {
          contradiction = buildContradiction(theorem, result.falses)
          throw new Error('Contradiction')
        } else if (result.unknown) {
          force(result.unknown, theorem, result.falses.reduce((acc, props) => acc.concat(props)))
        }
      }
    } else {
      const prop = f.property.uid
      const trait = traits.get(prop)
      if (trait) {
        if (trait.value !== f.value) {
          contradiction = 'tautology'
          throw new Error(`in force: ${theorem}`)
        }
      } else {
        traits = traits.set(prop, { value: f.value, deduced: true })
        evidence = evidence.set(prop, {
          theorem: theorem,
          properties: properties
        })
        checkQ = checkQ.concat(theoremsByProp[prop] || [])
      }
    }
  }

  const apply = (theorem: T.Theorem) => {
    const a = theorem.if
    const c = theorem.then
    const av = F.evaluate(a, traits)
    const cv = F.evaluate(c, traits)

    if (av === true && cv === false) {
      contradiction = buildContradiction(theorem, evidence)
      throw new Error(`in apply: ${theorem}`)
    } else if (av === true) {
      force(c, theorem, F.properties(a).toList())
    } else if (cv === false) {
      force(F.negate(a), theorem, F.properties(c).toList())
    }
  }

  try {
    force(formula, 'given', I.List<T.Property>())

    while (checkQ.length > 0) {
      const theorem = checkQ.shift()
      const before = traits
      // console.log(D.theorem(state, theorem))
      apply(theorem!)
      if (traits !== before) {
        // console.log(D.traits(state, traits))

        // If our initial formula to force is (a | b) => c
        //   and we have just proved ~b, we need to re-force
        // TODO: diff traits and only run this when the formula applies
        force(formula, theorem!, I.List<T.Property>())
      }
    }

    force(formula, 'given', I.List<T.Property>())
  } catch (e) {
    if (!contradiction) {
      report(e)
      return
    }
    return contradiction
  }

  return
}

// TODO: this should probably rule out tautologies
export function proveConverse(state: T.StoreState, theorem: T.Theorem): Disproof | undefined {
  return disprove(
    state,
    F.and(
      F.negate(theorem.if),
      theorem.then
    )
  )
}
