import ifetch from 'isomorphic-fetch'
import V from '../config/version'

export const STORAGE_KEY = ':pi-base:'

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

const storage = typeof(localStorage) === 'undefined' ? {
  getItem: () => {
    return
  },
  setItem: () => {
    return
  }
} : localStorage

const doFetch = ({
    type,
    url,
    onSuccess
  }) =>
  (dispatch) => {
    dispatch({
      type: fetch(STARTING, type)
    })

    return ifetch(path(url))
      .then(r => r.json())
      .then(data => {
        const processed = onSuccess(data) || data
        return dispatch({
          type: fetch(DONE, type),
          payload: processed
        })
      })
      .catch(err =>
        dispatch({
          type: fetch(FAILED, type),
          payload: err
        })
      )
  }

const cacheKey = (type) => `${STORAGE_KEY}:${type}`

export const cachedFetch = ({
    type,
    url,
    force,
    onSuccess
  }) =>
  (dispatch) => {
    let key = cacheKey(type)
    if (force) {
      storage.removeItem(key)
    }
    let cached = storage.getItem(key)

    if (cached && !force) {
      return dispatch({
        type: fetch(DONE, type),
        payload: JSON.parse(cached)
      })
    }

    doFetch({
      type: type,
      url: url,
      onSuccess: (data) => {
        storage.setItem(key, JSON.stringify(data))
        onSuccess(data)
        return data
      }
    })(dispatch)
  }

export const fetchUniverse = (dispatch, force) => {
  const loaded = storage.getItem(cacheKey('version'))
  cachedFetch({
    type: OBJECTS,
    url: `db/${V.db}.json`,
    force: force || (loaded !== V.db),
    onSuccess: () => {
      storage.setItem(cacheKey('version'), V.db)
    }
  })(dispatch)
}
