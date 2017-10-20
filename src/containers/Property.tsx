import * as React from 'react'
import * as I from 'immutable'

import { mobxStore } from '../store'
import { view } from '../graph'
import * as Q from '../queries'

import Aliases from '../components/Aliases'
import Markdown from '../components/Markdown'
import NotFound from '../components/NotFound'
import RelatedTheorems from '../components/Property/RelatedTheorems'
import Tex from '../components/Tex'

const Property = props => {
    const property = mobxStore.properties.find(props.params.id)
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
                properties={mobxStore.propertyFinder}
                theorems={mobxStore.theorems.all}
            />
        </div>
    )
}

// FIXME: this forces a load of the descriptions for all properties
export default view(`
  properties {
      uid
      name
      description
  }
`)(Property)