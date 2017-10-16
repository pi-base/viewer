import * as React from 'react'
import { graphql, gql } from 'react-apollo'

import * as T from '../../types'
import * as Q from '../../queries'

import Aliases from '../Aliases'
import NotFound from '../NotFound'
import Markdown from '../Markdown'
import TraitPager from '../Trait/Pager'
import Tex from '../Tex'

export interface Props {
  space: T.Space
  children: {}
  params: { spaceId: string }
  router: T.RouterProps
  data: any
}

function Space(props: Props) {
  const { router, children, params, data } = props
  let space
  if (data.viewer) {
    space = data.viewer.spaces.find(s => s.uid === params.spaceId)
    if (!space) { return <NotFound router={router} /> }
  } else {
    return <p>Loading ...</p>
  }

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
          {children}
        </div>
      </div>
    </div>
  )
}

const query = gql`
  query Space($uid: string) {
    viewer {
      spaces(uid: $uid) {
        uid
        name
        # aliases
        description
      }
    }
  }
`

export default graphql(query)(Space)
