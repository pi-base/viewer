import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import * as Q from '../../queries'
import * as T from '../../types'

import Implication from '../Implication'

interface OwnProps {
  property: T.Property
}
interface StateProps {
  theorems: T.Theorem[]
  properties: T.Finder<T.Property>
}
type Props = OwnProps & StateProps

function RelatedTheorems({ property, theorems, properties }: Props) {
  const related = Q.relatedTheorems(theorems, property)

  return (
    <div>
      <h4>Related Theorems</h4>
      {related.map((t: T.Theorem) => (
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

export default connect<OwnProps, StateProps, {}>(
  (state: T.State) => ({
    properties: Array.from(state.properties.values()),
    theorems: Array.from(state.theorems.values())
  })
)(RelatedTheorems)
