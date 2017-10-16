import { client } from './graph'
import * as T from './types'

export function login(token: string) {
  return dispatch => {
    return client.login(token).then(user => {
      dispatch(setToken(token))
      dispatch(setUser(user))
    })
  }
}

export type ChangeBranch = { type: 'CHANGE_BRANCH', branch: string }
export function changeBranch(branch: string): ChangeBranch {
  return { type: 'CHANGE_BRANCH', branch }
}

export type UpdateVersion = { type: 'UPDATE_VERSION', version: string }
export function updateVersion(version: string): UpdateVersion {
  return { type: 'UPDATE_VERSION', version }
}

export type LoadedView = { type: 'LOADED_VIEW', view: any }
export function loadedView(view: any): LoadedView {
  return { type: 'LOADED_VIEW', view }
}

export type SetToken = { type: 'SET_TOKEN', token: T.Token }
export function setToken(token: T.Token): SetToken {
  return { type: 'SET_TOKEN', token }
}

export type SetUser = { type: 'SET_USER', user: T.User }
export function setUser(user: T.User): SetUser {
  return { type: 'SET_USER', user }
}

export type PageNotFound = { type: 'PAGE_NOT_FOUND', path: string }
export function pageNotFound(path: string): PageNotFound {
  return { type: 'PAGE_NOT_FOUND', path }
}

export type Action = SetToken
  | SetUser
  | ChangeBranch
  | LoadedView
  | UpdateVersion
  | PageNotFound