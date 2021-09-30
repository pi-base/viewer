import produce from 'immer'

import { check } from '@pi-base/core'

import { Action } from './actions'
import { Store, initial as initialStore, theoremIndex } from './models/Store'

export const initial = initialStore

export type Dispatch = (action: Action) => void
export type Reducer = (store: Store, action: Action) => Store

export const reducer: Reducer = produce((state: Store, action: Action) => {
  switch (action.action) {
    case 'loaded':
      Object.assign(state, action.value)
      return

    case 'fetch.started':
      state.remote.branch = action.branch
      state.remote.host = action.host
      state.remote.state = 'fetching'
      return

    case 'fetch.error':
      state.error = action.error.message
    // fallthrough
    case 'fetch.done':
      state.remote.state = 'done'
      state.remote.fetched = new Date()
      return

    case 'check':
      if (state.checked.has(action.space.uid)) {
        return
      }

      const result = check(state.bundle, action.space, theoremIndex(state))

      switch (result.kind) {
        case 'bundle':
          state.bundle = result.bundle
          state.checked.add(action.space.uid)
          return
        case 'contradiction':
          state.bundle = initial.bundle
          state.error = `Found contradiction in space=${
            action.space.uid
          }: properties=${result.contradiction.properties.join(
            ','
          )} theorems=${result.contradiction.theorems.join(',')}`
          return
      }
  }
})
