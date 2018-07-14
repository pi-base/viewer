import * as F from '../models/Formula'
import * as React from 'react'

import { Id, Property, State, Theorem } from '../types'

import Formula from './Formula'
import Tex from './Tex'
import { connect } from 'react-redux'

interface OwnProps {
  theorem: Theorem
  link: boolean
}
interface StateProps {
  properties: Map<Id, Property>
}
type Props = OwnProps & StateProps

function Implication({ theorem, properties, link }: Props) {
  // TODO: what happens when lookup fails?
  const hydrate = (f) => F.mapProperty<string, Property>(
    uid => properties.get(uid)!,
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

export default connect<StateProps, {}, OwnProps, State>(
  (state) => ({
    properties: state.properties
  })
)(Implication)
