import React from 'react'
import { Link as A } from 'react-router-dom'

import Inline from '../Shared/Inline'
import * as Id from '../Shared/Id'
import * as Store from '../../models/Store/state'
import { Property } from '../../models'
import * as paths from '../../paths'

export function Link({ property }: { property: Property }) {
  return (
    <A
      to={paths.property(property)}
    >
      <Inline body={property.name} />
    </A>
  )
}

export function Container({ store, id }: { store: Store.Store, id: number }) {
  const property = Store.property(store, Id.expand('P', id)) // FIXME

  return property ? <Link property={property} /> : null
}