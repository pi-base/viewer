import ifetch from 'isomorphic-fetch'

import Cache from './cache'

const storage = typeof(window.localStorage === 'undefined') ? {} : window.localStorage
const cache = new Cache(storage)

// Fetch states
export const STARTING = 'STARTING'
export const DONE = 'DONE'
export const FAILED = 'FAILED'

// Fetch types
export const OBJECTS = 'OBJECTS'

export const fetch = (status, type) => {
  return `FETCH:${type}:${status}`
}

const ROOT = process.env.NODE_ENV === 'production' ?
  'https://pi-base.firebaseapp.com' :
  'http://localhost:3000'


const path = (rel) => (`${ROOT}/${rel}`)

export const PAGE_NOT_FOUND = 'PAGE_NOT_FOUND'
export const pageNotFound = (path) => ({
  type: PAGE_NOT_FOUND,
  path
})

const doFetch = (dispatch, {
  type,
  url
}) => {
  dispatch({
    type: fetch(STARTING, type)
  })

  return ifetch(path(url))
    .then(r => r.json())
    .then(data => {
      dispatch({
        type: fetch(DONE, type),
        payload: data
      })
      return data
    })
    .catch(err => {
      dispatch({
        type: fetch(FAILED, type),
        payload: err
      })
      throw err
    })
}

export const cachedFetch = (dispatch, {
  type,
  url,
  force
}) => {
  return cache.load({
    key: type,
    force: force,
    loader: () => {
      return doFetch(dispatch, {
        type,
        url
      })
    }
  })
}

export const fetchUniverse = (dispatch, version) => {
  cachedFetch(dispatch, {
    type: OBJECTS,
    url: `db/${version}.json`,
    force: version !== cache.get('version'),
  }).then(data => {
    cache.set('version', data.version)
  })
}
