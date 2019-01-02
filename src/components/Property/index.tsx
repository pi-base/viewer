import * as React from 'react'

import { Route, RouteComponentProps, Switch } from 'react-router'

import Edit from './Edit'
import NotFound from '../NotFound'
import { Property } from '../../types'
import Show from './Show'
import { State } from '../../reducers'
import Title from '../Title'
import { connect } from 'react-redux'

type StateProps = {
  property: Property | undefined
}
type Props = StateProps & RouteComponentProps<{ id: string }>

const Property: React.SFC<Props> = props => {
  const { property } = props

  if (!property) { return <NotFound {...props} /> }

  return (
    <div>
      <Title title={property.name} />
      <Switch>
        <Route path={props.match.url + '/edit'} render={ps => <Edit {...ps} property={property} />} />
        <Route path={props.match.url} render={ps => <Show {...ps} property={property} />} />
      </Switch>
    </div>
  )
}

export default connect<StateProps, {}, Props>(
  (state: State, props: Props) => ({
    property: state.properties.get(props.match.params.id)
  })
)(Property)