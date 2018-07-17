import 'babel-polyfill'
import './index.css'
import './errors'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { boot, login, toggleDebug } from './actions'
import { localToken, makeStore } from './store'

import { PiBase } from './types'
import makeApp from './components/App'
import { makeClient } from './graph'

const graph = makeClient({ token: localToken })
const store = makeStore({ graph, token: localToken })

const state = store.getState()
const dispatch = (action) => store.dispatch(action) // async or not
if (state.spaces.size === 0) { dispatch(boot()) }

declare global {
  interface Window {
    piBase: PiBase
    // tslint:disable-next-line no-any
    $: any
    // tslint:disable-next-line no-any
    Rollbar: any
  }
}

if (window) {
  window.piBase = {
    debug: () => {
      dispatch(toggleDebug())
    },

    showError: (e) => {
      const m = window.$('#errorModal')

      m.find('.details').html(`<pre>${e}</pre>`);

      // tslint:disable-next-line no-any
      (m as any).modal('show') // added by bootstrap
    },

    // N.B. this does _not_ clear the login token out of localStorage
    refreshRedux: () => {
      localStorage.removeItem('redux')
      location.reload()
    },

    clearStorage: () => {
      localStorage.clear()
      location.reload()
    },

    clientError: () => {
      // tslint:disable-next-line no-any
      ('' as any).floop('')
    }
  }

  const err = window.onerror

  window.onerror = (e) => {
    window.piBase.showError(e)
    err(e)
  }

}

if (state.user === 'unauthenticated') {
  const token = localToken.get()
  if (token) { dispatch(login(token)) }
}

const App = makeApp({
  graph,
  store
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
