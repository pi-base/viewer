import 'babel-polyfill'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { makeStore } from './restore'
import { makeClient } from './regraph'

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

const store = makeStore()
const apollo = makeClient()
const App = makeApp({ apollo, store })

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
