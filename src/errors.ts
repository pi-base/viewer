// tslint:disable no-console

import { User } from './types'

if (window && window.Rollbar) {
  const app = process.env.REACT_APP_GIT_VERSION
  const db = process.env.REACT_APP_DB_VERSION

  window.Rollbar.configure({
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    enabled: process.env.NODE_ENV === 'production',
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

export const setUser = (user: User) => {
  window.Rollbar.options.payload.person = {
    username: user.name
  }
}

export const error = (...e) => window.Rollbar.error(...e)
export const info = (...e) => window.Rollbar.info(...e)

export default error
