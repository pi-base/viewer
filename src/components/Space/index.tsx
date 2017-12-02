import * as React from 'react'
import { graphql, gql } from 'react-apollo'

import { observer } from 'mobx-react'
import store from '../../store'

import { view } from '../../graph'
import * as T from '../../types'
import * as Q from '../../queries'

import Aliases from '../Aliases'
import NotFound from '../NotFound'
import Markdown from '../Markdown'
import TraitPager from '../Trait/Pager'
import Tex from '../Tex'

export interface Props {
  children: React.ReactElement<any>,
  params: { spaceId: string }
}

@observer
class Space extends React.Component<Props & T.RouterProps, {}> {
  render() {
    const space = store.spaces.find(this.props.params.spaceId)
    if (!space) { return <NotFound {...this.props} /> }

    const traits = store.traits.forSpace(space.uid)

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
            {React.cloneElement(this.props.children, { space, traits })}
          </div>
        </div>
      </div>
    )
  }
}

export default view(`
  spaces {
    uid
    name
    # FIXME: aliases
    description
  }
`)(Space)
