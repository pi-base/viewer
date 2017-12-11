import { DocumentNode } from 'graphql'
import uuid from 'uuid/v4'

import * as G from './graph'
import * as T from './types'

export type AddProperty = { type: 'ADD_PROPERTY', property: T.Property }
export type AddSpace = { type: 'ADD_SPACE', space: T.Space }
export type AddTheorem = { type: 'ADD_THEOREM', theorem: T.Theorem }
export type CheckProofs = { type: 'CHECK_PROOFS' }
export type ChangeBranch = { type: 'CHANGE_BRANCH', branch: T.Branch }
export type LoadViewer = { type: 'LOAD_VIEWER', viewer: G.ViewerQuery }
export type Login = { type: 'LOGIN', token: T.Token, user: T.User }
export type Search = { type: 'SEARCH', text?: string, formula?: string }

// tslint:disable no-any
export type QueryError = { type: 'QUERY_ERROR', id: string, error: any }
export type QueryStart = { type: 'QUERY_START', id: string, query: any }
export type QuerySuccess = { type: 'QUERY_SUCCESS', id: string, data: any }
// tslint:enable no-any

export type Action
  = AddProperty
  | AddSpace
  | AddTheorem
  | ChangeBranch
  | CheckProofs
  | LoadViewer
  | Login
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
  type: 'ADD_PROPERTY',
  property
})

export const addTheorem = (theorem: T.Theorem): Action => ({
  type: 'ADD_THEOREM',
  theorem
})

export const changeBranch = (branch: T.Branch): Action => ({
  type: 'CHANGE_BRANCH', branch: branch
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
    dispatch({ type: 'LOGIN', token, user: data.me })
    return token
  })
}

export const search = ({ text, formula }: { text?: string, formula?: string }): Action => {
  return { type: 'SEARCH', text, formula }
}