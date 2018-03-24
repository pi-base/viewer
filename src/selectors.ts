import { createSelector } from 'reselect'

import { Formula, Id, Proof, Property, SearchModifier, Space, Table, Theorem, Trait } from './types'
import { State } from './reducers'

import * as F from './models/Formula'
import { Finder } from './models/Finder'
import { Prover } from './models/Prover'
import { union } from './utils'

export const propertyFinder = createSelector(
  (state: State) => state.properties.values(),
  properties => new Finder(Array.from(properties))
)

export const spaceFinder = createSelector(
  (state: State) => state.spaces.values(),
  spaces => new Finder(Array.from(spaces))
)

export const prover = createSelector(
  (state: State) => state.traits,
  (state: State) => state.theorems,
  (traits, theorems) => new Prover(traits, Array.from(theorems.values()))
)

export const asserted = (state: State, sid: Id, pid: Id): boolean => {
  const p = state.proofs.get(`${sid}|${pid}`)
  return p ? p.type === 'asserted' : false
}

export const spaceTraits = (state: State, space: Space): Trait[] => {
  const values = state.traits.get(space.uid)
  if (!values) { return [] }

  const result: Trait[] = []
  values.forEach((value, pid) => {
    result.push({
      space: space,
      property: state.properties.get(pid)!,
      value: value,
      // FIXME:
      uid: '',
      description: '',
      deduced: !asserted(state, space.uid, pid)
    })
  })
  return result
}

export const unknownProperties = (state: State, space: Space): Property[] => {
  const values = state.traits.get(space.uid) || new Map()

  return Array.from(state.properties.values()).reduce<Property[]>(
    (acc, prop) => {
      if (!values.has(prop.uid)) { acc.push(prop) }
      return acc
    },
    []
  )
}

export const getTrait = (state: State, space: Space, propertyId: Id): Trait | undefined => {
  const ts = state.traits.get(space.uid)
  if (!ts) { return undefined }
  const property = state.properties.get(propertyId)
  if (!property) { return undefined }
  const value = ts.get(propertyId)
  if (value === undefined) { return undefined }
  return {
    space,
    property,
    value,
    // FIXME:
    uid: '',
    description: '',
    deduced: !asserted(state, space.uid, propertyId)
  }
}

type SearchOptions = {
  formula?: Formula<Id>
  modifier?: SearchModifier
  text?: string
}

export const search = (
  state: State,
  options: SearchOptions
): Space[] => {
  let spaces: Space[]

  if (options.text) {
    spaces = spaceFinder(state).search(options.text)
  } else {
    spaces = Array.from(state.spaces.values())
  }

  if (options.formula) {
    const matcher = {
      'true': (value) => value === true,
      'false': (value) => value === false,
      'unknown': (value) => value === undefined,
      'not_false': (value) => value !== false
    }[options.modifier || 'true']

    spaces = spaces.filter(s => {
      const ts = state.traits.get(s.uid)
      if (!ts) { return false }
      return matcher(F.evaluate(options.formula!, ts))
    })
  }

  return spaces
}

export const searchFormula = createSelector(
  (state: State) => state.search.formulaMemo,
  (state: State) => state.properties,
  (formula, properties) => {
    if (!formula) { return }
    return F.compact(
      F.mapProperty(
        (p) => properties.get(p),
        formula
      )
    )
  }
)

export const parseFormula = (
  state: State,
  text: string
): F.Formula<Id> | undefined => {
  const parsed = F.parse(text)
  if (!parsed) { return }

  const finder = propertyFinder(state)
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

export const counterexamples = (state: State, theorem: Theorem): Space[] => {
  const formula = F.and(
    theorem.if,
    F.negate(theorem.then)
  )
  return search(state, { formula })
}

export const theoremProperties = (state: State, theorem: Theorem): Property[] => {
  const ids = union(F.properties(theorem.if), F.properties(theorem.then))
  const props: Property[] = []
  ids.forEach(uid => {
    const prop = state.properties.get(uid!)
    if (prop) { props.push(prop) } // FIXME: else?
  })
  return props
}

export const activeBranch = (state: State) => {
  if (!state.version.active) { return undefined } // FIXME
  return state.version.branches.get(state.version.active)!
}
export const editing = (state: State) => {
  const branch = activeBranch(state)
  if (!branch) { return false }
  return branch.access === 'admin'
}

export const proof = (state: State, spaceId: string, propertyId: string): Proof | undefined => {
  const space = state.spaces.get(spaceId)
  if (!space) { return }

  const root = state.proofs.get(`${spaceId}|${propertyId}`)
  if (!root || root.type === 'asserted') { return }

  const theoremIds: Id[] = [root.theorem]

  // TODO: traversal ordering? preserve insertion order of properties
  const queue = root.properties
  const visited: Set<Id> = new Set()
  const assumed: Set<Id> = new Set()
  while (queue.length > 0) {
    const pid = queue.shift()!
    const step = state.proofs.get(`${spaceId}|${pid}`)
    if (!step) { continue }
    if (step.type === 'asserted') {
      assumed.add(pid)
    } else {
      theoremIds.unshift(step.theorem)
      step.properties.forEach(p => {
        if (!visited.has(p)) {
          queue.push(p)
        }
      })
    }
    visited.add(pid)
  }

  const traits = Array.from(assumed).map(pid => getTrait(state, space, pid))
  const theorems = theoremIds.map(t => state.theorems.get(t))

  if (traits.indexOf(undefined) !== -1 || theorems.indexOf(undefined) !== -1) {
    // TODO
    return undefined
  }

  return {
    theorems: theorems as Theorem[],
    traits: traits as Trait[]
  }
}