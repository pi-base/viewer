import { beforeEach, describe, expect, it } from 'vitest'
import { Action, boot, refresh } from './actions'

import { defaultStore } from './__test__'

function inMemory() {
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

describe('actions', () => {
  const errors = inMemory()
  const branch = 'test1'
  const host = 'http://example.com'

  let dispatched: Action[] = []

  beforeEach(() => {
    dispatched = []
    errors.reset()
  })

  function dispatch(action: Action) {
    dispatched.push(action)
  }

  describe('boot', () => {
    it('loads from storage and starts a sync', async () => {
      await boot(dispatch, errors, () => defaultStore)

      expect(dispatched[0]).toEqual({ action: 'loaded', value: defaultStore })
      expect(dispatched[1].action).toEqual('fetch.started')
    })

    it('reports errors', async () => {
      await boot(dispatch, errors, () => JSON.parse("{'"))

      expect(errors.errors[0].error.message).toContain('Unexpected token')
      expect(dispatched[0].action).toEqual('fetch.started')
    })
  })

  describe('refresh', () => {
    it('fetches and checks proofs', async () => {
      await refresh({
        branch,
        dispatch,
        async fetch() {
          return { bundle: defaultStore.bundle, etag: 'test' }
        },
        host,
        store: undefined,
        handler: errors,
      })

      expect(dispatched.map((e) => e.action)).toEqual([
        'fetch.started',
        'fetch.done',
        'loaded',
        'check.started',
        'check',
        'check',
        'check.done',
      ])
    })

    it('skips re-loading if the remote has the same version', async () => {
      await refresh({
        branch,
        dispatch,
        async fetch() {
          return null
        },
        host,
        store: defaultStore,
        handler: errors,
      })

      expect(dispatched.map((e) => e.action)).toEqual([
        'fetch.started',
        'fetch.done',
      ])
    })
  })
})
