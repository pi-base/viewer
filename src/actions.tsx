import uuid from 'uuid/v4'

import * as T from './types'
import * as GQ from './graph/queries'

export type AddProperty = { type: 'ADD_PROPERTY', property: T.Property }
export type AddSpace = { type: 'ADD_SPACE', space: T.Space }
export type AddTheorem = { type: 'ADD_THEOREM', theorem: T.Theorem }
export type CheckProofs = { type: 'CHECK_PROOFS' }
export type ChangeBranch = { type: 'CHANGE_BRANCH', branch: T.Branch }
export type QueryError = { type: 'QUERY_ERROR', id: string, error: any }
export type QueryStart = { type: 'QUERY_START', id: string, query: any }
export type QuerySuccess = { type: 'QUERY_SUCCESS', id: string, data: any }
export type LoadViewer = { type: 'LOAD_VIEWER', viewer: any }

export type Action
  = AddProperty
  | AddSpace
  | AddTheorem
  | ChangeBranch
  | CheckProofs
  | QueryError
  | QueryStart
  | QuerySuccess
  | LoadViewer

export const query = (client, dispatch, q) => {
  const id = uuid()
  dispatch({ type: 'QUERY_START', id, query: q })
  return client.query({ query: q }).then(response => {
    const data = response.data
    dispatch({ type: 'QUERY_SUCCESS', id, data })
    return data
  }).catch(error => {
    dispatch({ type: 'QUERY_ERROR', id, error })
    throw error
  })
}

export const boot = (client, dispatch) => {
  query(client, dispatch, GQ.viewer).then(data => {
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