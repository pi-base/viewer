import { Dispatch } from 'redux'
import uuid from 'uuid/v4'

import { Client } from './graph'
import * as T from './types'
import * as GQ from './graph/queries'

export type AddProperty = { type: 'ADD_PROPERTY', property: T.Property }
export type AddSpace = { type: 'ADD_SPACE', space: T.Space }
export type AddTheorem = { type: 'ADD_THEOREM', theorem: T.Theorem }
export type CheckProofs = { type: 'CHECK_PROOFS' }
export type ChangeBranch = { type: 'CHANGE_BRANCH', branch: T.Branch }
export type LoadViewer = { type: 'LOAD_VIEWER', viewer: any }
export type Login = { type: 'LOGIN', token: T.Token, user: T.User }
export type QueryError = { type: 'QUERY_ERROR', id: string, error: any }
export type QueryStart = { type: 'QUERY_START', id: string, query: any }
export type QuerySuccess = { type: 'QUERY_SUCCESS', id: string, data: any }
export type Search = { type: 'SEARCH', text?: string, formula?: string }

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
  client: Client
  dispatch: Dispatch<Action>
  q: any
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

const load = (client, dispatch): Promise<GQ.ViewerResponse> => {
  return query<GQ.ViewerResponse>({ client, dispatch, q: GQ.viewer })
}
export const boot = (client, dispatch) => {
  load(client, dispatch).then(data => {
    dispatch({ type: 'LOAD_VIEWER', viewer: data.viewer })
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
  client: Client,
  dispatch: Dispatch<Action>,
  token: T.Token
): Promise<T.Token> => {
  const context = {
    headers: {
      authorization: token
    }
  }
  return query<GQ.MeResponse>({ client, dispatch, q: GQ.me, context }).then(data => {
    dispatch({ type: 'LOGIN', token, user: data.me })
    return token
  })
}

export const search = ({ text, formula }: { text?: string, formula?: string }): Action => {
  return { type: 'SEARCH', text, formula }
}