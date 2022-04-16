import * as Sentry from '@sentry/browser'
import * as Build from './build'

export type Level = 'info' | 'error'

export interface Handler {
  error: (error: any, meta?: Object) => void
}

export function log() {
  return {
    error(e: any, meta: Object = {}) {
      console.error({ error: e, meta })
    },
  }
}

export function sentry(dsn: string) {
  Sentry.init({
    dsn,
    release: Build.commitRef,
    environment: Build.context,
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
