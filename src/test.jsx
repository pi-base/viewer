import React from 'react'
import {
  Router
} from 'react-router'
import {
  Provider
} from 'react-redux'

import * as A from './actions'

import { makeStore } from './store'
import reducer from './reducers'
import routes from './routes'

import fs from 'fs'
import paths from '../config/paths'

const dataPath = paths.appPublic
let data
if (process.env.CI) {
  var request = require('sync-request')
  const result = request('GET', 'https://topology.jdabbs.com/db/test.json')
  data = JSON.parse(result.getBody())
} else {
  data = JSON.parse(fs.readFileSync(paths.appPublic + '/db/test.json', 'utf8'))
}

export const state = reducer(null, {
  type: A.fetching(A.DONE, A.OBJECTS),
  payload: data
})

export const store = makeStore(state)

import {cache} from './cache'
cache.set('version', process.env.REACT_APP_DB_VERSION)
cache.set(A.OBJECTS, data)

export class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          {routes}
        </Router>
      </Provider>
    )
  }
}
