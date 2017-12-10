import { Dispatch as _Dispatch } from 'react-redux'
import { Action } from '../actions'
import { Formula } from '../models/Formula'

export { Action } from '../actions'
export { Finder } from '../models/Finder'
export { Formula } from '../models/Formula'
export { Prover } from '../models/Prover'
export { Table } from '../models/Table'
export { State } from '../reducers'

export type Branch = 'audited' | 'user'
export type Id = string
export type Token = string

export type Dispatch = _Dispatch<Action>

export type PropertyId = Id

export type User = {
  readonly name: string
}

export type Space = {
  readonly uid: Id
  readonly name: string
  readonly aliases?: string[]
  readonly description: string
}

export type Property = {
  readonly uid: Id
  readonly name: string
  readonly aliases?: string[]
  readonly description: string
}

export type TraitId = [Id, Id]
export interface Trait {
  readonly uid: Id
  readonly space: Space
  readonly property: Property
  readonly value: boolean
  readonly deduced: boolean
  readonly description?: string
}

export type Theorem = {
  readonly uid: Id
  readonly if: Formula<Id>
  readonly then: Formula<Id>
  readonly converse?: Id[] // ids of theorems proving converse
  readonly description: string
}

export type ProofIds = {
  readonly traits: Id[]
  readonly theorems: Id[]
}

export type Proof = {
  readonly traits: Trait[]
  readonly theorems: Theorem[]
}

export type TraitTable = Map<Id, Map<Id, Trait>> // spaceId, propertyId => trait