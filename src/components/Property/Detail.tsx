import * as React from 'react'

import Aliases from '../Aliases'
import Detail from '../Shared/Detail'
import { Property } from '../../types'
import Tex from '../Tex'

type Props = { property: Property }

const Property: React.SFC<Props> = ({ property, ...props }) => (
  <Detail<Property> {...props} object={property}>
    <Tex>
      {property.name}
      {property.aliases ? <Aliases aliases={property.aliases} /> : ''}
    </Tex>
  </Detail>
)

export default Property