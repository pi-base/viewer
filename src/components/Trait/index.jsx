import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as I from 'immutable'

import * as Q from '../../queries'

import Icon     from '../Icon'
import Markdown from '../Markdown'
import Proof    from '../Proof'
import Tex      from '../Tex'


class Trait extends React.Component {
  constructor() {
    super()
    this.state = { showProperty: false }
  }

  toggleShowProperty() {
    this.setState({ showProperty: !this.state.showProperty })
  }

  render() {
    const { trait } = this.props
    if (!trait) { return null }

    const space = trait.get('space')
    const property = trait.get('property')
    const label = trait.get('value') === false ? '¬' : ''

    console.log("property", property.get('name'), property)

    return (
      <div>
        <h3>
          {label}{property.get('name')}
          {' '}
          <button
            className="btn btn-default btn-xs"
            onClick={() => this.toggleShowProperty()}
          >
            <Icon type="question-sign"/>
          </button>
        </h3>

        { this.state.showProperty
        ? <Tex className="well">
          <Markdown text={property.get('description')}/>
        </Tex>
        : ''}

        <Proof space={space} trait={trait}/>
      </div>
    )
  }
}

Trait.propTypes = {
  trait: PropTypes.instanceOf(I.Map)
}

export default connect(
  (state, ownProps) => ({
    trait: Q.findTrait(state, ownProps.params.spaceId, ownProps.params.propertyId)
  })
)(Trait)
