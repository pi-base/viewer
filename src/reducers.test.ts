import { describe, expect, it } from 'vitest'
import { reducer } from './reducers'

import type { Action } from './actions'
import { Store, initial, status } from './models/Store'
import { defaultStore } from './__test__'

import * as immer from 'immer'

immer.enableMapSet()

describe('reducer', () => {
  function reduce(initial: Store, ...actions: Action[]) {
    return actions.reduce(reducer, initial)
  }

  describe('loaded', () => {
    it('replaces the store', () => {
      const next = reduce(initial, { action: 'loaded', value: defaultStore })

      expect(next).toEqual(defaultStore)
    })
  })

  describe('fetch.started', () => {
    it('replaces the store', () => {
      const next = reduce(defaultStore, {
        action: 'fetch.started',
        branch: 'test',
        host: 'http://example.com',
      })

      expect(status(next)).toEqual({ state: 'fetching' })
      expect(next.remote.branch).toEqual('test')
      expect(next.remote.host).toEqual('http://example.com')
    })
  })

  describe('fetch.error', () => {
    it('is no longer fetching', () => {
      const next = reduce(
        defaultStore,
        { action: 'fetch.started', branch: 'test', host: 'http://example.com' },
        { action: 'fetch.error', error: new Error('Not found') }
      )

      expect(status(next).state).not.toEqual('fetching')
    })
  })

  it('check', () => {
    const next = reduce(
      defaultStore,
      { action: 'check', space: defaultStore.bundle.spaces.get('S1')! },
      { action: 'check', space: defaultStore.bundle.spaces.get('S2')! }
    )

    expect(status(next)).toEqual({ state: 'ready' })
  })
})
