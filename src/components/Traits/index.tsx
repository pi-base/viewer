import React from 'react'

import Detail from './Detail.svelte'
import { Store, default as S } from '../../models/Store'
import RouteLookup from '../Shared/RouteLookup'
import { Svelte } from '../Svelte'

const findTrait = (
  store: Store,
  { spaceId, propertyId }: { spaceId: string; propertyId: string }
) => {
  if (!spaceId || !propertyId) {
    return
  }

  const space = S.space(store, spaceId)
  const property = S.property(store, propertyId)
  const trait = S.trait(store, { space: spaceId, property: propertyId })

  return property && space && trait && { property, space, trait }
}

export function Trait(props: any) {
  return <Svelte component={Detail} props={props} />
}

export default function Traits({ path }: { path: string }) {
  return <RouteLookup path={path} lookup={findTrait} component={Trait} />
}
