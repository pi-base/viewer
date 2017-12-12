import * as React from 'react'

import { Property } from '../../types'

import Aliases from '../Aliases'
import Markdown from '../Markdown'
import Tex from '../Tex'

type Props = {
  property: Property
}

const Detail = ({ property }: Props) => (
  <div>
    <h1>
      <Tex>
        {property.name}
        {property.aliases ? <Aliases aliases={property.aliases} /> : ''}
      </Tex>
    </h1>
    <Tex><Markdown text={property.description} /></Tex>
  </div>
)

export default Detail