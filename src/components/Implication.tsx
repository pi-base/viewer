import * as React from 'react'

import * as T from '../types'

import Formula from './Formula'
import Tex     from './Tex'

export interface Props {
  theorem: T.Theorem
  link: boolean
}

function Implication({ theorem, link }: Props) {
  return (
    <Tex>
      <Formula formula={theorem.if} link={link}/>
      <span> ⇒ </span>
      <Formula formula={theorem.then} link={link}/>
    </Tex>
  )
}

export default Implication
