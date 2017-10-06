import * as React from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'

import { getClient } from './graph'
import { makeStore } from './store'
import reducer from './reducers'
import routes from './routes'

import * as fs from 'fs'
import * as paths from '../config/paths'

import { cache } from './cache'

let data
if (process.env.CI) {
  var request = require('sync-request')
  const result = request('GET', 'https://topology.jdabbs.com/db/test.json')
  data = JSON.parse(result.getBody())
} else {
  data = JSON.parse(fs.readFileSync(paths.appPublic + '/db/test.json', 'utf8'))
}

export const state = reducer(undefined, {
  type: 'FETCH_DONE',
  data: data
})

const client = getClient()
export const store = makeStore(client)

cache.set('version', process.env.REACT_APP_DB_VERSION)
cache.set('objects', data)

export function App() {
  return (
    <Provider store={store}>
      <Router>
        {routes}
      </Router>
    </Provider>
  )
}
