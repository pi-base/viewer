import fetch from 'isomorphic-fetch'

export const search = (q) => ({
    type: '@@redux-form/CHANGE',
    meta: { field: 'q', form: 'search' },
    payload: q
})

const path = (rel) => (`http://localhost:3001/${rel}`)

export const fetchCache = () =>
  (dispatch) => {
    dispatch({ type: 'FETCH_STARTING' })

    return fetch(path('traits')).
      then(r => r.json()).
      then(data =>
        dispatch({ type: 'FETCH_DONE', payload: data })
      ).
      catch(r =>
        dispatch({ type: 'FETCH_FAILED', payload: r })
      )
  }
