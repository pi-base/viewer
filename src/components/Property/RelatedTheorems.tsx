import * as Q from '../../queries'
import * as React from 'react'

import { Property, State, Theorem } from '../../types'

import Implication from '../Implication'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

interface OwnProps {
  property: Property
}
interface StateProps {
  theorems: Theorem[]
  properties: Property[]
}
type Props = OwnProps & StateProps

function RelatedTheorems({ property, theorems, properties }: Props) {
  const related = Q.relatedTheorems(theorems, property)

  return (
    <div>
      <h4>Related Theorems</h4>
      {related.map((t: Theorem) => (
        <div key={t.uid}>
          <Link to={`/theorems/${t.uid}`}>
            <Implication theorem={t} link={false} />
          </Link>
        </div>
      ))}
      <Link to="/theorems/new" className="btn btn-default btn-xs">Add</Link>
    </div>
  )
}

export default connect<StateProps, {}, OwnProps, State>(
  state => ({
    properties: Array.from(state.properties.values()),
    theorems: Array.from(state.theorems.values())
  })
)(RelatedTheorems)
