import * as React from 'react'
import * as I from 'immutable'

import * as T from '../types'

import Formula from './Formula'
import Tex from './Tex'

import * as F from '../models/Formula'
import { Finder } from '../models/PropertyFinder'

export interface Props {
  theorem: T.Theorem
  properties: Finder<T.Property>
  link: boolean
}

function Implication({ theorem, properties, link }: Props) {
  const hydrate = (f) => F.mapProperty<string, T.Property>(
    uid => properties.records.get(uid), f
  )

  return (
    <Tex>
      <Formula formula={hydrate(theorem.if)} link={link} />
      <span> ⇒ </span>
      <Formula formula={hydrate(theorem.then)} link={link} />
    </Tex>
  )
}

export default Implication
