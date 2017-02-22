import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as I from 'immutable'

import * as Q from '../../queries'

import Icon from '../Icon'
import Tex  from '../Tex'

class TraitTable extends React.Component {
  check(traits, space, property) {
    const val = traits.getIn([space.get('uid'), property.get('uid'), 'value'])
    let type
    if (val === true) {
      type = "ok"
    } else if (val === false) {
      type = "remove"
    } else {
      type = "question-sign"
    }

    return (
      <Link to={`/spaces/${space.get('name')}/properties/${property.get('name')}`}>
        <Icon type={type}/>
      </Link>
    )
  }
  render() {
    const { spaces, properties, traits } = this.props

    return (
      <table className="table table-condensed table-striped table-hover">
        <thead>
          <tr>
            <th>Space</th>
            {properties.map(p =>
              <th key={p.get('uid')}>
                <Link to={`/properties/${p.get('name')}`}>
                  <Tex>{p.get('name')}</Tex>
                </Link>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {spaces.map(s =>
            <tr key={s.get('uid')}>
              <td>
                <Link to={`/spaces/${s.get('name')}`}>
                  <Tex>{s.get('name')}</Tex>
                </Link>
              </td>
              {properties.map(p =>
                <td key={p.get('uid')}>{this.check(traits, s, p)}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}

TraitTable.propTypes = {
  spaces: PropTypes.instanceOf(I.List),
  properties: PropTypes.instanceOf(I.List)
}

export default connect(
  (state, ownProps) => ({
    traits: Q.traitTable(state, ownProps.spaces, ownProps.properties)
  })
)(TraitTable)
