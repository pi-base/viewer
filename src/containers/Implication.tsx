import * as React from 'react'
import { connect } from 'react-redux'
import * as I from 'immutable'

import * as T from '../types'

import Formula from '../components/Formula'
import Tex from '../components/Tex'

import * as F from '../models/Formula'
import { Finder } from '../models/PropertyFinder'

export interface Props {
  theorem: T.Theorem
  properties: T.Index<T.Property>
  link: boolean
}

function Implication({ theorem, properties, link }: Props) {
  // TODO: what happens when lookup fails?
  const hydrate = (f) => F.mapProperty<string, T.Property>(
    uid => properties.get(uid),
    f
  )

  return (
    <Tex>
      <Formula formula={hydrate(theorem.if)} link={link} />
      <span> ⇒ </span>
      <Formula formula={hydrate(theorem.then)} link={link} />
    </Tex>
  )
}

export default connect(
  (state) => ({
    properties: state.viewer.properties
  })
)(Implication)
