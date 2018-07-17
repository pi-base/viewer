import * as React from 'react'

import { State, User } from './types'

import { connect } from 'react-redux'
import { getPatch } from './queries'

if (window && window.Rollbar) {
  const app = process.env.REACT_APP_GIT_VERSION
  const db = process.env.REACT_APP_DB_VERSION

  window.Rollbar.configure({
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    enabled: process.env.NODE_ENV === 'production',
    captureUncaught: true,
    captureUnhandledRejections: true,
    logLevel: 'info',
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
  window.Rollbar.configure({
    payload: {
      username: user.name
    }
  })
}

export const error = (...e) => window.Rollbar.error(...e)
export const info = (...e) => window.Rollbar.info(...e)

export default error

type RollbarOpts = Partial<{
  level: 'debug' | 'info' | 'warn' | 'error'
  error: Object
  extra: Object
}>

export interface RollbarProps {
  report: (message: string, opts?: RollbarOpts) => void
}

export const withRollbar = connect(
  (state: State) => ({
    report: (message: string, opts: RollbarOpts = {}) => {
      const level = opts.level || 'error'
      const extra = opts.extra || {}
      const patch = getPatch(state)
      window.Rollbar[level].call({
        message,
        err: opts.error,
        custom: { ...extra, patch }
      })
    }
  })
)
