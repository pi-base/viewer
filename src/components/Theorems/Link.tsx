import React from 'react'

import Name from './Name'
import * as Id from '../Shared/Id'
import * as Store from '../../models/Store/state'

export function Container({ store, id }: { store: Store.Store, id: number }) {
  const theorem = Store.theorem(store, Id.expand('T', id)) // FIXME

  return theorem ? <Name theorem={theorem} link="theorem" /> : null
}