import { createContext, useContext } from 'react'
import { compact, unique } from './util'
import * as Sentry from '@sentry/browser'
import * as Build from './build'

export type Level = 'info' | 'error'

export interface Handler {
  error: (error: any, meta?: Object) => void
}

const noOp: Handler = {
  error() {},
}

export const Context = createContext<Handler>(noOp)
export const Provider = Context.Provider

export function useErrorHandler() {
  const handler = useContext(Context)
  if (handler === null) {
    throw new Error('Store cannot be null, please add a context provider')
  }
  return handler
}

export function log() {
  return {
    error(e: any, meta: Object = {}) {
      console.error({ error: e, meta })
    },
  }
}

export function inMemory() {
  const errors: { error: any; meta: Object }[] = []

  return {
    error(e: any, meta: Object = {}) {
      errors.push({ error: e, meta })
    },

    reset() {
      errors.splice(0, errors.length)
    },

    get errors() {
      return errors
    },
  }
}

export function sentry(dsn: string) {
  const release = Build.commitRef || 'dev'

  const environment =
    Build.deployUrl === Build.deployPrimeUrl ? 'production' : 'deploy-preview'

  const allowUrls = unique(
    compact(['pi-base.org', Build.deployPrimeUrl, Build.deployUrl])
  )

  Sentry.init({
    dsn,
    release,
    environment,
    allowUrls,
  })

  return {
    error(e: any, meta: Object = {}) {
      Sentry.withScope((scope) => {
        Object.entries(meta).forEach(([key, value]) => {
          scope.setExtra(key, value)
        })
        Sentry.captureException(e)
      })
    },
  }
}
