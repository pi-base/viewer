import 'babel-polyfill'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { makeClient } from './graph'
import { makeStore } from './store'

import makeApp from './components/App'

import './img/jumbotron.jpg'
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
