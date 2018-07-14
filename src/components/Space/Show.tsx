import * as React from 'react'

import { Route, RouteComponentProps, Switch } from 'react-router'

import Detail from './Detail'
import EditLink from '../Form/EditLink'
import { Space } from '../../types'
import Trait from '../Trait/Show'
import TraitCreate from '../Trait/Create'
import TraitEdit from '../Trait/Edit'
import TraitPager from '../Trait/Pager'

interface OwnProps {
  space: Space
}
type Props = OwnProps & RouteComponentProps<{ propertyId: string }>

const Traits = (props: Props) => (
  <div className="row">
    <div className="col-md-4">
      <h3>
        Properties
        {' '}
        <EditLink
          to={`/spaces/${props.space.uid}/properties/new`}
          className="btn btn-default btn-sm"
        >
          New
        </EditLink>
      </h3>
      <TraitPager {...props} />
    </div>
    <div className="col-md-8">
      {props.match.params.propertyId && <Trait {...props} />}
    </div>
  </div>
)

const Show: React.SFC<Props> = props => (
  <div>
    <Detail {...props} />

    <hr />

    <Switch>
      <Route
        path={props.match.url + '/properties/new'}
        render={ps => <TraitCreate {...ps} space={props.space} />}
      />
      <Route
        path={props.match.url + '/properties/:propertyId/edit'}
        render={ps => <TraitEdit {...ps} space={props.space} />}
      />
      <Route
        path={props.match.url + '/properties/:propertyId'}
        render={ps => <Traits {...ps} space={props.space} />}
      />
      <Route
        render={ps => <Traits {...ps} space={props.space} />}
      />
    </Switch>
  </div>
)

export default Show