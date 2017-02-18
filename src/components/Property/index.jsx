import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import * as Q from '../../queries'

import Markdown        from '../Markdown'
import RelatedTheorems from './RelatedTheorems'
import Tex             from '../Tex'


class Property extends React.Component {
  render () {
    const { property } = this.props
    if (!property) { return null }

    return (
      <div>
        <h1>{property.name}</h1>
        <Tex><Markdown text={property.description}/></Tex>
        <hr/>

        <RelatedTheorems property={property}/>
      </div>
    )
  }
}

Property.propTypes = {
  property: PropTypes.object.isRequired
}

export default connect(
  (state, ownProps) => ({
    property: Q.findProperty(state, ownProps.params.propertyName)
  })
)(Property)
