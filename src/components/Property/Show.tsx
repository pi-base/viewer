import * as React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch } from 'react-router'

import { State } from '../../reducers'
import * as S from '../../selectors'
import * as T from '../../types'

import Detail from './Detail'
import Edit from './Edit'
import EditLink from '../Form/EditLink'
import NotFound from '../NotFound'
import References from '../References'
import RelatedTheorems from './RelatedTheorems'

type StateProps = {
  property: T.Property
}
type RouteProps = RouteComponentProps<{ id: string }>
type Props = StateProps & RouteProps

const Preview = ({ property, match }) => (
  <div>
    <EditLink to={match.url + '/edit'} />
    <Detail property={property} />
    <References references={property.references} />
  </div>
)

const Property = ({ property, match }: Props) => {
  if (!property) { return <NotFound /> }

  return (
    <div>
      <Switch>
        <Route
          path={match.url + '/edit'}
          render={ps => <Edit {...ps} property={property} />}
        />
        <Route
          render={ps => <Preview {...ps} property={property} />}
        />
      </Switch>

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