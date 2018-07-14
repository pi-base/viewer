import { Action } from '../actions'
import { Client } from '../graph'
import { Formula } from '../models/Formula'
import { State } from '../reducers'
import { Store } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

export { Action } from '../actions'
export { Finder } from '../models/Finder'
export { Formula } from '../models/Formula'
export { Prover } from '../models/Prover'
export { Table } from '../models/Table'
export { State } from '../reducers'

export type Config = {
  readonly graph: Client
  readonly store: Store<State>
  readonly setToken: (token: Token) => void
}

export type PiBase = {
  debug: () => void
  refreshRedux: () => void
  clearStorage: () => void
  clientError: () => void
  serverError: () => void
  // tslint:disable-next-line no-any
  showError: (e: any) => void
}

export type TokenStorage = {
  get: () => string | null
  set: (token: string) => void
  clear: () => void
}

export type BranchAccess = 'read' | 'admin'

export type Sha = string
export type BranchName = string
export type Branch = {
  name: BranchName,
  sha: Sha,
  access: BranchAccess,
  active: boolean,
  submitting: boolean,
  pullRequestUrl: string | undefined
}

export type Id = string
export type Token = string

export type Dispatch = ThunkDispatch<State, any, Action>

export type PropertyId = Id

export type User = {
  readonly name: string
}

export type SearchModifier = 'true' | 'false' | 'unknown' | 'not_false'
export type CitationType = 'doi' | 'mr' | 'wikipedia'

export type Citation = {
  readonly type: CitationType
  readonly ref: string
  readonly name: string
}

export type Space = {
  readonly uid: Id
  readonly name: string
  readonly aliases?: string[]
  readonly references: Citation[]
  readonly description: string
}

export type Property = {
  readonly uid: Id
  readonly name: string
  readonly aliases?: string[]
  readonly references: Citation[]
  readonly description: string
}

export type TraitId = [Id, Id]
export interface Trait {
  readonly uid: Id
  readonly space: Space
  readonly property: Property
  readonly value: boolean
  readonly deduced: boolean
  readonly description: string
  readonly references: Citation[]
}

export type Theorem = {
  readonly uid: Id
  readonly if: Formula<Id>
  readonly then: Formula<Id>
  readonly converse?: Id[] // ids of theorems proving converse
  readonly references: Citation[]
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