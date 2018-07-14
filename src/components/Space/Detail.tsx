import * as React from 'react'

import Aliases from '../Aliases'
import Detail from '../Shared/Detail'
import { Space } from '../../types'
import Tex from '../Tex'

type Props = { space: Space }

const Space: React.SFC<Props> = ({ space, ...props }) => (
  <Detail<Space> {...props} object={space}>
    <Tex>
      {space.name}
      {space.aliases ? <Aliases aliases={space.aliases} /> : ''}
    </Tex>
  </Detail>
)

export default Space