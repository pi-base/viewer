import React from 'react'
import { Link as A } from 'react-router-dom'

import Inline from '../Shared/Inline'
import * as Id from '../Shared/Id'
import * as Store from '../../models/Store/state'
import { Space } from '../../models'
import * as paths from '../../paths'

export function Link({ space }: { space: Space }) {
  return (
    <A
      to={paths.space(space)}
    >
      <Inline body={space.name} />
    </A>
  )
}

export function Container({ store, id }: { store: Store.Store, id: number }) {
  const space = Store.space(store, Id.expand('S', id)) // FIXME

  return space ? <Link space={space} /> : null
}