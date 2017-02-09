import fetch from 'isomorphic-fetch'

export const FORM_CHANGE = '@@redux-form/CHANGE'
export const FETCH_DONE = 'FETCH_DONE'
export const FILTER_SPACE_TRAITS = 'FILTER_SPACE_TRAITS'
export const CACHE_UNIVERSE = 'CACHE_UNIVERSE'

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

export const cacheUniverse = (u) => ({
  type: CACHE_UNIVERSE,
  payload: u
})

const path = (rel) => (`http://localhost:3001/${rel}`)

export const fetchCache = () =>
  (dispatch) => {
    dispatch({
      type: 'FETCH_STARTING'
    })

    return fetch(path('traits'))
      .then(r => r.json())
      .then(data =>
        dispatch({
          type: FETCH_DONE,
          payload: data
        })
      )
      .catch(err =>
        dispatch({
          type: 'FETCH_FAILED',
          payload: err
        })
      )
  }
