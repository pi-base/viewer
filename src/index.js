import 'babel-polyfill'

import React    from 'react'
import ReactDOM from 'react-dom'

import makeApp from './components/App'
import './index.css'

import './errors'

if (window) {
  const err = window.onerror
  window.onerror = (e) => {
    const m = window.$('#errorModal')

    m.find('.details').html(`<pre>${e}</pre>`)
    m.modal('show')

    err(e)
  }
}

const App = makeApp()

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
