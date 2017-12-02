import * as React from 'react'

import * as I from 'immutable'
import * as T from '../../types'

import Aliases from '../Aliases'
import Markdown from '../Markdown'
import NotFound from '../NotFound'
import RelatedTheorems from './RelatedTheorems'
import Tex from '../Tex'

export interface Props {
  properties: T.Finder<T.Property>
  theorems: I.List<T.Theorem>
  params: {
    propertyId: string
  }
}

class Show extends React.Component<Props & T.RouterProps, {}> {
  render() {
    const property = this.props.properties.records.get(this.props.params.propertyId)
    // if (!property) { return <NotFound {...this.props} /> }

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

        <RelatedTheorems
          property={property}
          theorems={this.props.theorems}
          properties={this.props.properties}
        />
      </div>
    )
  }
}

export default Show