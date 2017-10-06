// tslint:disable no-any
import { Dispatch } from 'react-redux'
import { cache } from './cache'

import { SERVER_URL } from './constants'
import * as T from './types'

export type FetchStart = { type: 'FETCH_START' }
export function fetchStart(): Action {
  return { type: 'FETCH_START' }
}

export type FetchDone = { type: 'FETCH_DONE', data: any }
export function fetchDone(data: any): FetchDone {
  return { type: 'FETCH_DONE', data }
}

export type FetchFailed = { type: 'FETCH_FAILED', error: any }
export function fetchFailed(error: any): FetchFailed {
  return { type: 'FETCH_FAILED', error }
}

export type SetUser = { type: 'SET_USER', user: T.User }
export function setUser(user: T.User): SetUser {
  return { type: 'SET_USER', user }
}

export type PageNotFound = { type: 'PAGE_NOT_FOUND', path: string }
export function pageNotFound(path: string): PageNotFound {
  return { type: 'PAGE_NOT_FOUND', path }
}

export type Action = FetchStart
                   | FetchDone
                   | FetchFailed
                   | SetUser
                   | PageNotFound

// Async actions

export function fetchUniverse(
  dispatch: Dispatch<FetchStart | FetchDone | FetchFailed>,
  version?: string,
  force?: boolean
) {
  version = version || process.env.REACT_APP_DB_VERSION
  force = force || version !== cache.get('version')

  cachedFetch(dispatch, `db/${version}.json`, force).then((data: any) => {
    cache.set('version', data.version)
    dispatch(fetchDone(data))
  })
}

export function login(dispatch: Dispatch<SetUser>, token: string) {
  cache.set('token', token)
  dispatch(setUser({ name: token, token: token }))
}

// Helper functions

const path = (rel: string) => (`${SERVER_URL}/${rel}`)

function doFetch(
  dispatch: Dispatch<FetchStart | FetchDone | FetchFailed>,
  url: string
) {
  dispatch(fetchStart())

  return fetch(path(url))
    .then(r => r.json())
    .then(data => {
      dispatch(fetchDone(data))
      return data
    })
    .catch(err => {
      dispatch(fetchFailed(err))
      throw err
    })
}

export function cachedFetch(
  dispatch: Dispatch<FetchStart | FetchDone | FetchFailed>,
  url: string,
  force: boolean
) {
  return cache.load({
    key: 'objects',
    force: force,
    loader: () => doFetch(dispatch, url)
  })
}
