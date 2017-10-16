import * as React from 'react'
import { connect } from 'react-redux'
import * as I from 'immutable'

import { view } from '../graph'
import * as Q from '../queries'

import Aliases from '../components/Aliases'
import Markdown from '../components/Markdown'
import NotFound from '../components/NotFound'
import RelatedTheorems from '../components/Property/RelatedTheorems'
import Tex from '../components/Tex'

const Property = props => {
    const property = props.viewer.properties.find(p =>
        p.uid === props.params.id
    )
    if (!property) { return <NotFound {...props} /> }

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
                properties={props.properties}
                theorems={props.theorems}
            />
        </div>
    )
}

// FIXME: this forces a load of the descriptions for all properties
const withData = view(`
  properties {
      uid
      name
      description
  }
`)(Property)

export default connect(
    (state) => ({
        properties: Q.allProperties(state.viewer),
        theorems: Q.allTheorems(state.viewer)
    })
)(withData)