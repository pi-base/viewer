import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Q from '../../queries'

import Icon    from '../Icon'
import List    from '../List'
import Preview from '../Preview'
import Tex     from '../Tex'

class PropertyPreview extends React.Component {
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
      <Tex>
        <h3>
          <button
            className="btn btn-default btn-xs"
            onClick={this.toggle.bind(this)}
          >
            <Icon type="question-sign"/>
          </button>
          {' '}
          <Link to={`/properties/${property.name}`}>
            {property.name}
          </Link>
        </h3>
        { this.state.expanded
        ? <Preview text={property.description}/>
        : ''}
      </Tex>
    )
  }
}

class Properties extends React.Component {
  render() {
    return <List
      name="properties"
      objects={this.props.properties}
      component={PropertyPreview}
    />
  }
}

export default connect(
  (state) => ({
    properties: Q.allProperties(state).toJS()
  })
)(Properties)
