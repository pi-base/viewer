import 'babel-polyfill'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { boot, login } from './actions'
import { makeClient } from './graph'
import { makeStore, localToken } from './store'

import makeApp from './components/App'

import './index.css'
import './errors'

if (window) {
  const err = window.onerror
  window.onerror = (e) => {
    // const m = window.$('#errorModal')

    // m.find('.details').html(`<pre>${e}</pre>`)
    // m.modal('show')

    err(e)
  }
}

const graph = makeClient({ token: localToken })
const store = makeStore({ graph, token: localToken })

const state = store.getState()
if (state.spaces.size === 0) { store.dispatch(boot()) }

if (state.user === 'unauthenticated') {
  const token = localToken.get()
  if (token) { store.dispatch(login(token)) }
}

const App = makeApp({
  graph,
  store
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
