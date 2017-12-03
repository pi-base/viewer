import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { State } from '../reducers'
import * as T from '../types'

import Aliases from '../components/Aliases'
import Markdown from '../components/Markdown'
import NotFound from '../components/NotFound'
import RelatedTheorems from '../components/Property/RelatedTheorems'
import Tex from '../components/Tex'

type StateProps = {
  property: T.Property
}
type RouteProps = RouteComponentProps<{ id: string }>
type Props = StateProps & RouteProps

const Property = ({ property }: Props) => {
  if (!property) { return <NotFound /> }

  return (
    <div>
      <h1>
        <Tex>
          {property.name}
          {property.aliases ? <Aliases aliases={property.aliases} /> : ''}
        </Tex>
      </h1>
      <Tex><Markdown text={property.description} /></Tex>
      <hr />

      <RelatedTheorems property={property} />
    </div>
  )
}

export default connect(
  (state: State, ownProps: Props) => ({
    property: state.properties.get(ownProps.match.params.id)
  })
)(Property)