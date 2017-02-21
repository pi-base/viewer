import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Q from '../../queries'

import Icon from '../Icon'
import Tex  from '../Tex'

class TraitTable extends React.Component {
  check(traits, space, property) {
    const val = traits.getIn([space.uid, property.uid, 'value'])
    let type
    if (val === true) {
      type = "ok"
    } else if (val === false) {
      type = "remove"
    } else {
      type = "question-sign"
    }

    return (
      <Link to={`/spaces/${space.name}/properties/${property.name}`}>
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
            <td></td>
            {properties.map(p =>
              <td key={p.uid}>
                <Link to={`/properties/${p.name}`}>
                  <Tex>{p.name}</Tex>
                </Link>
              </td>
            )}
          </tr>
        </thead>
        <tbody>
          {spaces.map(s =>
            <tr key={s.uid}>
              <td>
                <Link to={`/spaces/${s.name}`}>
                  <Tex>{s.name}</Tex>
                </Link>
              </td>
              {properties.map(p =>
                <td key={p.uid}>{this.check(traits, s, p)}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    traits: Q.traitTable(state, ownProps.spaces, ownProps.properties)
  })
)(TraitTable)
