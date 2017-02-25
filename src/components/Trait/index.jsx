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

    return (
      <Tex>
        <h3>
          <span>{label}{property.get('name')}</span>
          {' '}
          <button
            className="btn btn-default btn-xs"
            onClick={() => this.toggleShowProperty()}
          >
            <Icon type="question-sign"/>
          </button>
        </h3>

        { this.state.showProperty
        ? <div className="well">
            <Markdown text={property.get('description')}/>
          </div>
        : ''}

        <Proof space={space} trait={trait}/>
      </Tex>
    )
  }
}

Trait.propTypes = {
  trait: PropTypes.instanceOf(I.Map)
}

export default connect(
  (state, ownProps) => ({
    trait: Q.findTrait(state, ownProps.params.spaceName, ownProps.params.propertyName)
  })
)(Trait)
