import * as React from 'react'

import { Space } from '../../types'

import Aliases from '../Aliases'
import Markdown from '../Markdown'
import Tex from '../Tex'

type Props = {
  space: Space
}
const Detail = ({ space }: Props) => (
  <div>
    <h1>
      <Tex>
        {space.name}
        {space.aliases ? <Aliases aliases={space.aliases} /> : ''}
      </Tex>
    </h1>
    <Tex><Markdown text={space.description} /></Tex>
  </div>
)

export default Detail