import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Q from '../../queries'

import Filter  from '../Filter'
import Preview from '../Preview'
import Tex     from '../Tex'

class Properties extends React.Component {
  constructor() {
    super()
    this.state = {
      limit: 10,
      properties: []
    }
  }

  componentWillMount() {
    this.doFilter(this.props.properties)
  }

  more() {
    this.setState({ limit: this.state.limit + 10 })
  }

  doFilter(properties) {
    this.setState({
      limit: 10,
      properties: properties.length ? properties : this.props.properties
    })
  }

  render() {
    const properties = this.state.properties.slice(0, this.state.limit)

    // TODO: the filter here may be confusing, should
    //   probably support searching by formula as well
    // TODO: add "infinite" scroll for paging
    return (
      <section className="properties">
        <Filter
          collection={this.props.properties}
          onChange={this.doFilter.bind(this)}
          placeholder="Filter properties"
        />

      {properties.map(property =>
          <Tex key={property.uid}>
            <h3>
              <Link to={`/properties/${property.name}`}>
                {property.name}
              </Link>
            </h3>
            <Preview text={property.description}/>
          </Tex>
        )}

        { this.props.properties.length > this.state.limit
        ? <button className="btn btn-default" onClick={() => this.more()}>Show More</button>
        : ''}
      </section>
    )
  }
}

Properties.propTypes = {
  properties: PropTypes.array.isRequired
}

export default connect(
  (state) => ({
    properties: Q.allProperties(state).toJS()
  })
)(Properties)
