import * as React from 'react'
import * as I from 'immutable'

import store from '../store'
import { view } from '../graph'
import * as Q from '../queries'

import { observer } from 'mobx-react'

import Aliases from '../components/Aliases'
import Markdown from '../components/Markdown'
import NotFound from '../components/NotFound'
import RelatedTheorems from '../components/Property/RelatedTheorems'
import Tex from '../components/Tex'

export interface Props {
  children: React.ReactElement<{}>
  params: { id: string }
}

@observer
class Property extends React.Component<Props, {}> {
  render() {
    const property = store.properties.find(this.props.params.id)
    if (!property) { return <NotFound {...this.props as any} /> }

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
          properties={store.propertyFinder}
          theorems={store.theorems.all}
        />
      </div>
    )
  }
}

// FIXME: this forces a load of the descriptions for all properties
export default view(`
  properties {
      uid
      name
      # FIXME: aliases
      description
  }
`)(Property)