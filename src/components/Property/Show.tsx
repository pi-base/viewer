import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { State } from '../../reducers'
import * as T from '../../types'

import Detail from './Detail'
import NotFound from '../NotFound'
import RelatedTheorems from './RelatedTheorems'

type StateProps = {
  property: T.Property
}
type RouteProps = RouteComponentProps<{ id: string }>
type Props = StateProps & RouteProps

const Property = ({ property }: Props) => {
  if (!property) { return <NotFound /> }

  return (
    <div className="container">
      <Detail property={property} />
      <hr />

      <div className="row">
        <div className="col-md-6">
          <RelatedTheorems property={property} />
        </div>
        <div className="col-md-6" />
      </div>
    </div>
  )
}

export default connect(
  (state: State, ownProps: Props) => ({
    property: state.properties.get(ownProps.match.params.id)
  })
)(Property)
