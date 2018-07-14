import * as React from 'react'

import Detail from '../Shared/Detail'
import Tex from '../Tex'
import { Trait } from '../../types'

type Props = { trait: Trait }

const Trait: React.SFC<Props> = props => {
  const { trait } = props
  const { property, value } = trait

  const label = value === false ? '¬' : ''

  return (
    <Detail<Trait> {...props} object={trait}>
      <Tex>
        {label}{property.name}
      </Tex>
    </Detail>
  )

}

export default Trait