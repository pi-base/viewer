import { createSelector } from 'reselect'
import * as I from 'immutable'

import * as T from './types'
import { State } from './reducers'
import { Finder } from './models/Finder'

export const propertyFinder = createSelector(
  (state: State) => state.properties.values(),
  properties => new Finder(I.List<T.Property>(properties))
)

export const spaceFinder = createSelector(
  (state: State) => state.spaces.values(),
  spaces => new Finder(I.List<T.Space>(spaces))
)

export const editing = (state: State) => state.version.branch === 'user'