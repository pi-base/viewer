import * as React from 'react'

import * as I from 'immutable'
import * as T from '../../types'

import Aliases from '../Aliases'
import Markdown from '../Markdown'
import NotFound from '../NotFound'
import RelatedTheorems from './RelatedTheorems'
import Tex from '../Tex'

export interface Props {
  properties: T.Finder<T.Property>
  theorems: I.List<T.Theorem>
  params: {
    propertyId: string
  }
}

export default function Show({ properties, theorems, params: { propertyId } }: Props) {
  const property = properties.records.get(propertyId)
  if (!property) { return <NotFound /> }

  return (
    <div>
      <h1>
        <Tex>
          {property.name}
          {property.aliases ? <Aliases aliases={property.aliases} /> : ''}
        </Tex>
      </h1>
      <Tex><Markdown text={property.description} /></Tex>
      <hr />

      <RelatedTheorems property={property} theorems={theorems} properties={properties} />
    </div>
  )
}