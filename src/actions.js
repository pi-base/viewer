import ifetch from 'isomorphic-fetch'

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

export const cachedFetch = (type, url) =>
  (dispatch) => {
    let key = `${STORAGE_KEY}:${type}`
    let cached = storage.getItem(key)
    if (cached) {
      dispatch({
        type: fetch(DONE, type),
        payload: JSON.parse(cached)
      })
      return
    }

    // Not cached; do the fetch
    dispatch({
      type: fetch(STARTING, type)
    })

    return ifetch(path(url))
      .then(r => r.json())
      .then(data => {
        storage.setItem(key, JSON.stringify(data))
        return dispatch({
          type: fetch(DONE, type),
          payload: data
        })
      })
      .catch(err =>
        dispatch({
          type: fetch(FAILED, type),
          payload: err
        })
      )
  }

export const fetchUniverse = cachedFetch(OBJECTS, 'db')
