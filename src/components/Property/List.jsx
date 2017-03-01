import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as I from 'immutable'

import * as Q from '../../queries'

import List    from '../List'
import Preview from '../Preview'
import Tex     from '../Tex'

class Property extends React.Component {
  constructor() {
    super()
    this.state = { expanded: false }
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const property = this.props.object

    return (
      <Tex className="row">
        <div className="col-md-2">
          <h4>
            <Link to={`/properties/${property.get('uid')}`}>
              {property.get('name')}
            </Link>
          </h4>
        </div>
        <div className="col-md-10">
          <Preview text={property.get('description')}/>
        </div>
      </Tex>
    )
  }
}

Preview.propTypes = {
  object: PropTypes.instanceOf(I.Map)
}

class Properties extends React.Component {
  render() {
    return <List
      name="properties"
      objects={this.props.properties.toList()}
      component={Property}
    />
  }
}

export default connect(
  (state) => ({
    properties: Q.allProperties(state)
  })
)(Properties)
