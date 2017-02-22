import 'babel-polyfill'

import React      from 'react'
import ReactDOM   from 'react-dom'

import App from './components/App'
import './index.css'

import V from '../config/version'

if (window) {
  const err = window.onerror
  window.onerror = (e) => {
    const m = window.$('#errorModal')

    m.find('.details').html(`<pre>${e}</pre>`)
    m.modal('show')

    err(e)
  }

  if (window.Rollbar) {
    window.Rollbar.configure({
      context: {
        enabled: process.env.NODE_ENV === 'production'
      },
      payload: {
        db: V.db,
        client: {
          javascript: {
            code_version: V.app
          }
        }
      }
    })
  }
}


ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
