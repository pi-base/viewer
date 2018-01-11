import { DocumentNode } from 'graphql'
import { v4 as uuid } from 'uuid'

import * as G from './graph'
import * as T from './types'
import { Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'

export type AddProperty = { type: 'ADD_PROPERTY', property: T.Property }
export type AddSpace = { type: 'ADD_SPACE', space: T.Space }
export type AssertTheorem = { type: 'ASSERT_THEOREM', theorem: T.Theorem }
export type AssertTrait = { type: 'ASSERT_TRAIT', trait: T.Trait }
export type CheckProofs = { type: 'CHECK_PROOFS', spaces?: T.Space[] }
export type ChangeBranch = { type: 'CHANGE_BRANCH', branch: T.BranchName }
export type LoadViewer = { type: 'LOAD_VIEWER', viewer: G.ViewerQuery }
export type Login = { type: 'LOGIN', token: T.Token, user: T.User, branches: T.Branch[] }
export type Logout = { type: 'LOGOUT' }
export type Search = { type: 'SEARCH', text?: string, formula?: string }
export type UpdateBranch = { type: 'UPDATE_BRANCH', branch: T.BranchName, sha: T.Sha }

// tslint:disable no-any
export type QueryError = { type: 'QUERY_ERROR', id: string, error: any }
export type QueryStart = { type: 'QUERY_START', id: string, query: any }
export type QuerySuccess = { type: 'QUERY_SUCCESS', id: string, data: any }

export type PersistSuccess = { type: 'PERSIST_SUCCESS', version: string }
// tslint:enable no-any

export type Action
  = AddProperty
  | AddSpace
  | AssertTheorem
  | AssertTrait
  | ChangeBranch
  | CheckProofs
  | LoadViewer
  | Login
  | Logout
  | PersistSuccess
  | QueryError
  | QueryStart
  | QuerySuccess
  | Search
  | UpdateBranch

export const addProperty = (property: T.Property): Action => ({
  type: 'ADD_PROPERTY', property
})

export const addSpace = (space: T.Space): Action => ({
  type: 'ADD_SPACE', space
})

const updateBranch = (branch: T.BranchName, sha: T.Sha): Action => ({
  type: 'UPDATE_BRANCH', branch, sha
})

export const assertTheorem = (theorem: T.Theorem): Action => ({
  type: 'ASSERT_THEOREM', theorem
})

export const assertTrait = (trait: T.Trait): Action => ({
  type: 'ASSERT_TRAIT', trait
})

export const checkProofs = (spaces?: T.Space[]): Action => ({
  type: 'CHECK_PROOFS', spaces
})

export const search = ({ text, formula }: { text?: string, formula?: string }): Action => {
  return { type: 'SEARCH', text, formula }
}

type Async<R> = ThunkAction<Promise<R>, T.State, { client: G.Client }>

type QueryParams = {
  client: G.Client
  dispatch: T.Dispatch
  q: DocumentNode
  // tslint:disable-next-line no-any
  context?: any
  variables?: any
}
export function query<Response>({ client, dispatch, q, context, variables }: QueryParams): Promise<Response> {
  const id = uuid()
  dispatch({ type: 'QUERY_START', id, query: q })

  return client.query<Response>({ query: q, context, variables }).then(response => {
    const data = response.data
    dispatch({ type: 'QUERY_SUCCESS', id, data })
    return data
  }).catch(error => {
    dispatch({ type: 'QUERY_ERROR', id, error })
    throw error
  })
}

const fetchViewer = (): Async<void> =>
  (dispatch, getState, { client }) => {
    const p = getPatch(getState())
    const variables = {
      version: p ? p.sha : undefined
    }

    return query<G.ViewerQuery>({
      client,
      dispatch,
      q: G.viewer,
      variables
    }).
      then((viewer: G.ViewerQuery) => {
        dispatch({ type: 'LOAD_VIEWER', viewer })
        dispatch({ type: 'CHECK_PROOFS' })
      })
  }

export const boot = () => fetchViewer()

export const changeBranch = (branch: T.BranchName): Async<void> =>
  (dispatch, getState, { client }) => {
    dispatch({ type: 'CHANGE_BRANCH', branch })
    dispatch(fetchViewer())
    return Promise.resolve()
  }

const getPatch = (state: T.State): G.PatchInput | undefined => {
  const active = state.version.active
  if (!active) { return }
  const branch = state.version.branches.get(active)!
  return {
    branch: branch.name,
    sha: branch.sha
  }
}

export const login = (token: T.Token): Async<T.User> =>
  (dispatch, _, { client }) => {
    const context = {
      headers: {
        authorization: token
      }
    }
    return query<G.MeQuery>({ client, dispatch, q: G.me, context }).then(data => {
      const user = { name: data.me.name }
      const branches = data.me.branches

      const action: Login = {
        type: 'LOGIN',
        token,
        user: { name: data.me.name },
        branches: data.me.branches.map(b => ({
          name: b.name,
          sha: b.sha,
          access: b.access as any
        }))
      }
      dispatch(action)
      return user
    })
  }

export const logout = (): Async<void> =>
  (dispatch, _, { client }) => {
    dispatch({ type: 'LOGOUT' })
    return Promise.resolve()
  }

export const resetBranch = (branch: T.BranchName, to: T.Sha): Async<void> =>
  (dispatch, _, { client }) => {
    return client.mutate({
      mutation: G.resetBranch,
      variables: {
        input: { branch, to }
      }
    }).then(response => {
      dispatch(updateBranch(branch, response.data!.resetBranch.sha))
    })
  }

type PatchParams<V> = {
  before: Action
  mutation: any
  variables: V & { patch?: G.PatchInput }
  field?: string
}
function patch<V>({ before, mutation, variables, field }: PatchParams<V>) {
  return (dispatch, getState, { client }) => {
    const p = getPatch(getState())
    if (!p) { return Promise.resolve() } // FIXME

    dispatch(before)

    // Assume mutation looks like
    // <field> {
    //   version
    //   ...
    // }
    if (!field) {
      field = mutation.definitions[0].selectionSet.selections[0].name.value
    }

    variables.patch = p
    return client.mutate({ mutation, variables }).then(response => {
      const version = response.data![field!].version
      dispatch({ type: 'UPDATE_BRANCH', branch: p.branch, sha: version })
    })
  }
}

export const createSpace = (space: T.Space): Async<void> =>
  patch({
    before: addSpace(space),
    mutation: G.createSpace,
    variables: { space }
  })

export const createProperty = (property: T.Property): Async<void> =>
  patch({
    before: addProperty(property),
    mutation: G.createProperty,
    variables: { property }
  })

export const updateProperty = (property: T.Property): Async<void> =>
  patch({
    before: addProperty(property),
    mutation: G.updateProperty,
    variables: { property }
  })