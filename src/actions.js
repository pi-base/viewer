import ifetch from 'isomorphic-fetch'

export const STORAGE_KEY = ':pi-base:'

export const FORM_CHANGE = '@@redux-form/CHANGE'
export const FILTER_SPACE_TRAITS = 'FILTER_SPACE_TRAITS'

// Fetch states
export const STARTING = 'STARTING'
export const DONE = 'DONE'
export const FAILED = 'FAILED'

// Fetch types
export const OBJECTS = 'OBJECTS'

export const fetch = (status, type) => {
  return `FETCH:${type}:${status}`
}

export const search = (q) => ({
  type: FORM_CHANGE,
  meta: {
    field: 'q',
    form: 'search'
  },
  payload: q
})

export const filterSpaceTraits = (filter) => ({
  type: FILTER_SPACE_TRAITS,
  payload: filter
})

const path = (rel) => (`http://localhost:3001/${rel}`)

export const doFetch = (type, url) =>
  (dispatch) => {
    let key = `${STORAGE_KEY}:${type}`
    let cached = localStorage.getItem(key)
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
        localStorage.setItem(key, JSON.stringify(data))
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

export const fetchUniverse = doFetch(OBJECTS, 'db')
