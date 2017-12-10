import * as React from 'react'
import { connect } from 'react-redux'

import * as T from '../types'
import * as F from '../models/Formula'

import Formula from './Formula'
import Tex from './Tex'

interface OwnProps {
  theorem: T.Theorem
  link: boolean
}
interface StateProps {
  properties: Map<T.Id, T.Property>
}
type Props = OwnProps & StateProps

function Implication({ theorem, properties, link }: Props) {
  // TODO: what happens when lookup fails?
  const hydrate = (f) => F.mapProperty<string, T.Property>(
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

export default connect<OwnProps, StateProps>(
  (state) => ({
    properties: state.properties
  })
)(Implication)
