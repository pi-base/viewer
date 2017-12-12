import * as React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { Link } from 'react-router-dom'

import * as T from '../../types'
import * as Q from '../../queries'

import { State } from '../../reducers'

import Detail from './Detail'
import NotFound from '../NotFound'
import TraitCreate from '../Trait/Create'
import TraitPager from '../Trait/Pager'
import Trait from '../Trait'

interface OwnProps {
  children: JSX.Element
}
type StateProps = {
  space: T.Space | undefined
}
type Props = OwnProps & StateProps & RouteComponentProps<{ spaceId: string }>

const Space = (props: Props) => {
  const { space } = props

  if (!space) { return <NotFound /> }

  return (
    <div>
      <Detail space={space} />

      <hr />

      <div className="row">
        <div className="col-md-4">
          <h3>
            Properties
            {' '}
            <Link
              to={props.match.url + '/properties/new'}
              className="btn btn-default btn-sm"
            >
              New
            </Link>
          </h3>
          <TraitPager space={space} />
        </div>
        <div className="col-md-8">
          <Switch>
            <Route
              path={props.match.url + '/properties/new'}
              render={ps => <TraitCreate {...ps} space={space} />}
            />
            <Route
              path={props.match.url + '/properties/:propertyId'}
              render={ps => <Trait {...ps} space={space} />}
            />
            <Route
              render={ps =>
                <Link
                  to={props.match.url + '/properties/new'}
                  className="btn btn-default"
                >
                  New
                </Link>
              }
            />
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default connect<StateProps, {}, Props>(
  (state: State, props: Props) => ({
    space: state.spaces.get(props.match.params.spaceId)
  })
)(Space)