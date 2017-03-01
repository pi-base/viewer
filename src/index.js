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

  if (window.Rollbar && process.env.NODE_ENV === 'production') {
    window.Rollbar.configure({
      accessToken: "1d48576f7fa242babd4f366dda8e57b5",
      captureUncaught: true,
      captureUnhandledRejections: true,
      payload: {
        environment: process.env.NODE_ENV,
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
