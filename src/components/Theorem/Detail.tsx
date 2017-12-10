import * as React from 'react'

import { Theorem } from '../../types'

import Implication from '../Implication'
import Markdown from '../Markdown'
import Tex from '../Tex'

type Props = {
  theorem: Theorem
}

const Detail = ({ theorem }: Props) => (
  <div>
    <h1>
      {theorem.if && theorem.then
        ? <Implication theorem={theorem} link={true} />
        : ' '
      }
    </h1>
    <Tex><Markdown text={theorem.description} /></Tex>
  </div>
)

export default Detail