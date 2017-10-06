import * as I from 'immutable'

import * as A from './actions'

import * as E from './errors'
import * as F from './models/Formula'
import { Finder } from './models/PropertyFinder'

import * as T from './types/index'

/* tslint:disable no-any */
interface VSpace {
  uid:                string
  slug:               string
  name:               string
  description:        string
  proof_of_topology?: string
  aliases?:           string[]
}

interface VProperty {
  uid:         string
  slug:        string
  name:        string
  description: string
  aliases?:    string[]
}

interface VTrait {
  uid:         string
  space:       string
  property:    string
  value:       boolean
  description: string
}

interface VTheorem {
  uid:         string
  if:          any
  then:        any
  description: string
  converse?:   string[]
}

interface Viewer {
  version:    string
  spaces:     VSpace[]
  properties: VProperty[]
  traits:     VTrait[]
  theorems:   VTheorem[],
  proofs:     any
}
/* tslint:enable no-any */

function reducer(previous: T.StoreState | undefined, action: A.Action): T.StoreState {
  const state: T.StoreState = previous || initialState()

  switch (action.type) {
    case 'FETCH_DONE':
      const viewer: Viewer = action.data

      const spaces = index<VSpace, T.Space>(viewer.spaces, (s) => ({
        uid:         s.uid,
        name:        s.name,
        description: s.description,
        aliases:     s.aliases ? I.List<string>(s.aliases) : undefined
      }))

      const properties = index<VProperty, T.Property>(viewer.properties, (p) => ({
        uid:         p.uid,
        name:        p.name,
        description: p.description,
        aliases:     p.aliases ? I.List<string>(p.aliases) : undefined
      }))

      const traits: T.TraitTable = I.Map<string, I.Map<string, T.Trait>>().withMutations(map => {
        viewer.traits.forEach(t => {
          const trait: T.Trait = {
            uid:         t.uid,
            space:       spaces.get(t.space),
            property:    properties.get(t.property),
            description: t.description,
            value:       t.value,
            deduced:     false // FIXME
          }

          map.setIn([t.space, t.property], trait)
        })
      })

      // tslint:disable-next-line no-any
      const hydrate = (f: any): T.Formula =>
        F.mapProperty((p) => properties.get(p) , F.fromJSON(f))

      const theorems = index<VTheorem, T.Theorem>(viewer.theorems, (t) => ({
        uid:         t.uid,
        if:          hydrate(t.if),
        then:        hydrate(t.then),
        description: t.description,
        converse:    t.converse
      }))

      const proofs = I.Map<T.Id, T.ProofIds>().withMutations(map => {
        for (let traitId in viewer) {
          if (viewer.hasOwnProperty(traitId)) {
            const proof = viewer[traitId]
            map.set(traitId, {
              theorems: proof[0],
              traits:   proof[1]
            })
          }
        }
      })

      return { ...state,
        version:             viewer.version,
        spaces:              spaces,
        'spaces.finder':     new Finder(spaces),
        properties:          properties,
        'properties.finder': new Finder(properties),
        traits:              traits,
        theorems:            theorems,
        proofs:              proofs
      }

    case 'SET_USER':
      return { ...state, user: action.user }

    case 'PAGE_NOT_FOUND':
      E.info('404', { path: action.path })
      return state

    default:
      return state
  }
}

function index<P, Q>(collection: P[], transform: (p: P) => Q & { uid: string }): T.Index<Q> {
  return I.Map<string, Q>().withMutations(map => {
    collection.forEach(obj => {
      const transformed = transform(obj)
      map.set(transformed.uid, transformed)
    })
  })
}

function initialState(): T.StoreState {
  return {
    version:             '',
    spaces:              I.Map<T.Id, T.Space>(),
    'spaces.finder':     new Finder(I.List<T.Space>()),
    properties:          I.Map<T.Id, T.Property>(),
    'properties.finder': new Finder(I.List<T.Property>()),
    traits:              I.Map<T.Id, I.Map<T.Id, T.Trait>>(),
    theorems:            I.Map<T.Id, T.Theorem>(),
    proofs:              I.Map<T.Id, T.ProofIds>()
  }
}

export default reducer
