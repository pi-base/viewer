import jestFetchMock from 'jest-fetch-mock'

import { Bundle, bundle, formula } from '@pi-base/core'
import { Store } from '../models/Store'

import { property, space, theorem } from '@pi-base/core/lib/testUtils'
export { property, space, trait, theorem } from '@pi-base/core/lib/testUtils'

export const fetch = jestFetchMock

// From https://github.com/enzymejs/enzyme/issues/2073#issuecomment-531488981
export function wait(amount = 0) {
  return new Promise((resolve) => setTimeout(resolve, amount))
}

export const defaultStore: Store = {
  bundle: bundle.deserialize({
    spaces: [space({ uid: 'S1' }), space({ uid: 'S2' })],
    properties: [
      property({ uid: 'P1' }),
      property({ uid: 'P2' }),
      property({ uid: 'P3' }),
    ],
    traits: [],
    theorems: [
      theorem({
        uid: 'T1',
        when: formula.atom('P1'),
        then: formula.atom('P2'),
      }),
    ],
    version: {
      ref: 'test',
      sha: 'HEAD',
    },
  }),
  etag: null,
  remote: {
    branch: 'test',
    host: 'https://example.com',
    state: 'done',
    fetched: new Date(),
  },
  checked: new Set(),
  error: null,
}

export function mockBundleFetch(b: Bundle) {
  fetchMock.once(JSON.stringify(bundle.serialize(b)))
}
