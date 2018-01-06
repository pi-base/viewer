import { DocumentNode } from 'graphql'
import { v4 as uuid } from 'uuid'

import * as G from './graph'
import * as T from './types'
import { Dispatch } from 'redux';

export type AddProperty = { type: 'ADD_PROPERTY', property: T.Property }
export type AddSpace = { type: 'ADD_SPACE', space: T.Space }
export type AssertTheorem = { type: 'ASSERT_THEOREM', theorem: T.Theorem }
export type AssertTrait = { type: 'ASSERT_TRAIT', trait: T.Trait }
export type CheckProofs = { type: 'CHECK_PROOFS', spaces?: T.Space[] }
export type ChangeBranch = { type: 'CHANGE_BRANCH', branch: T.Branch }
export type LoadViewer = { type: 'LOAD_VIEWER', viewer: G.ViewerQuery }
export type Login = { type: 'LOGIN', token: T.Token, user: T.User, branches: T.Branch[] }
export type Logout = { type: 'LOGOUT' }
export type Search = { type: 'SEARCH', text?: string, formula?: string }

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

type QueryParams = {
  client: G.Client
  dispatch: T.Dispatch
  q: DocumentNode
  // tslint:disable-next-line no-any
  context?: any
}
export function query<Response>({ client, dispatch, q, context }: QueryParams): Promise<Response> {
  const id = uuid()
  dispatch({ type: 'QUERY_START', id, query: q })

  if (!context) {
    context = {
      headers: {
        authorization: 'token'
      }
    }
  }

  return client.query<Response>({ query: q, context }).then(response => {
    const data = response.data
    dispatch({ type: 'QUERY_SUCCESS', id, data })
    return data
  }).catch(error => {
    dispatch({ type: 'QUERY_ERROR', id, error })
    throw error
  })
}

const load = (client, dispatch): Promise<G.ViewerQuery> => {
  return query<G.ViewerQuery>({ client, dispatch, q: G.viewer })
}
export const boot = (client: G.Client, dispatch: T.Dispatch) => {
  load(client, dispatch).then((data: G.ViewerQuery) => {
    dispatch({ type: 'LOAD_VIEWER', viewer: data })
    dispatch({ type: 'CHECK_PROOFS' })
  })
}

export const addProperty = (property: T.Property): Action => ({
  type: 'ADD_PROPERTY', property
})

export const addSpace = (space: T.Space): Action => ({
  type: 'ADD_SPACE', space
})

export const createSpace = (client: G.Client, dispatch: T.Dispatch, space: T.Space) => {
  dispatch(addSpace(space))
  return client.mutate({
    mutation: G.createSpace,
    variables: {
      input: {
        name: space.name,
        description: space.description
      }
    }
  }).then(response => {
    dispatch({ ...(response.data as any).createSpace, type: 'PERSIST_SUCCESS' })
  }).catch(() => {
    dispatch({ type: 'PERSIST_ERROR', space })
  })
}

export const assertTheorem = (theorem: T.Theorem): Action => ({
  type: 'ASSERT_THEOREM', theorem
})

export const assertTrait = (trait: T.Trait): Action => ({
  type: 'ASSERT_TRAIT', trait
})

export const changeBranch = (branch: T.Branch): Action => ({
  type: 'CHANGE_BRANCH', branch
})

export const checkProofs = (spaces?: T.Space[]): Action => ({
  type: 'CHECK_PROOFS', spaces
})

export const login = (
  client: G.Client,
  dispatch: T.Dispatch,
  token: T.Token
): Promise<T.Token> => {
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
    return token
  })
}

export const logout = (
  dispatch: T.Dispatch
): Promise<void> => {
  dispatch({ type: 'LOGOUT' })
  return Promise.resolve()
}

export const search = ({ text, formula }: { text?: string, formula?: string }): Action => {
  return { type: 'SEARCH', text, formula }
}