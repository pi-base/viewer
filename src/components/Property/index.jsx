import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as I from 'immutable'

import * as Q from '../../queries'

import Aliases         from '../Aliases'
import Markdown        from '../Markdown'
import RelatedTheorems from './RelatedTheorems'
import Tex             from '../Tex'

class Property extends React.Component {
  render () {
    const { property } = this.props
    if (!property) { return null }

    return (
      <div>
        <h1>
          <Tex>
            {property.get('name')}
            <Aliases aliases={property.get('aliases')}/>
          </Tex>
        </h1>
        <Tex><Markdown text={property.get('description')}/></Tex>
        <hr/>

        <RelatedTheorems property={property}/>
      </div>
    )
  }
}

Property.propTypes = {
  property: PropTypes.instanceOf(I.Map)
}

export default connect(
  (state, ownProps) => ({
    property: Q.findProperty(state, ownProps.params.propertyId)
  })
)(Property)
