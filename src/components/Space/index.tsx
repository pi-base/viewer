import * as React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps } from 'react-router'

import * as T from '../../types'
import * as Q from '../../queries'

import { State } from '../../reducers'
import Aliases from '../Aliases'
import NotFound from '../NotFound'
import Markdown from '../Markdown'
import TraitPager from '../Trait/Pager'
import Trait from '../Trait'
import Tex from '../Tex'

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
      <h1>
        <Tex>
          {space.name}
          {space.aliases ? <Aliases aliases={space.aliases} /> : ''}
        </Tex>
      </h1>
      <Tex><Markdown text={space.description} /></Tex>

      <hr />

      <div className="row">
        <div className="col-md-4">
          <h3>Properties</h3>
          <TraitPager space={space} />
        </div>
        <div className="col-md-8">
          <Route
            path={props.match.url + '/properties/:propertyId'}
            render={ps => <Trait {...ps} space={space} />}
          />
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