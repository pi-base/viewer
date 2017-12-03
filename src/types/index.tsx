import * as I from 'immutable'

import * as F from '../models/Formula'

import { Finder } from '../models/Finder'
export { Finder } from '../models/Finder'

export type Branch = 'audited' | 'user'
export type Id = string
export type Token = string

export type PropertyId = Id

export interface User {
  readonly name: string
}

export interface Space {
  readonly uid: Id
  readonly name: string
  readonly aliases?: I.List<string>
  readonly description: string
}

export interface Property {
  readonly uid: Id
  readonly name: string
  readonly aliases?: I.List<string>
  readonly description: string
}

export type TraitId = [Id, Id]
export interface Trait {
  readonly uid: Id
  readonly space: Space
  readonly property: Property
  readonly description: string
  readonly value: boolean
  readonly deduced: boolean
}

export interface Theorem {
  readonly uid: Id
  readonly if: F.Formula<Id>
  readonly then: F.Formula<Id>
  readonly converse?: any // FIXME
  readonly description: string
}

export interface ProofIds {
  readonly traits: I.List<Id>
  readonly theorems: I.List<Id>
}

export interface Proof {
  readonly traits: I.List<Trait>
  readonly theorems: I.List<Theorem>
}

export type TraitMap = I.Map<Id, I.Map<Id, boolean>> // spaceId, propertyId => trait
export type TraitTable = I.Map<Id, I.Map<Id, Trait>> // spaceId, propertyId => trait

export type Index<P> = I.Map<Id, P>

// There's probably a cleaner way to handle this, but this gives us an escape
// hatch for props added by the router
export interface RouterProps {
  // tslint:disable no-any
  router?: any
  params?: any
  location: {
    pathname: string
  }
  // tslint:enable o-any
}
