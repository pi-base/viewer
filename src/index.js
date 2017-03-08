import 'babel-polyfill'

import React      from 'react'
import ReactDOM   from 'react-dom'

import App from './components/App'
import './index.css'

if (window) {
  const err = window.onerror
  window.onerror = (e) => {
    const m = window.$('#errorModal')

    m.find('.details').html(`<pre>${e}</pre>`)
    m.modal('show')

    err(e)
  }

  if (window.Rollbar && process.env.NODE_ENV === 'production') {
    const app = process.env.REACT_APP_GIT_VERSION
    const db = process.env.REACT_APP_DB_VERSION

    window.Rollbar.configure({
      accessToken: "1d48576f7fa242babd4f366dda8e57b5",
      captureUncaught: true,
      captureUnhandledRejections: true,
      payload: {
        environment: process.env.NODE_ENV,
        db: db,
        client: {
          javascript: {
            code_version: app,
            source_map_enabled: true,
            guess_uncaught_frames: true
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
