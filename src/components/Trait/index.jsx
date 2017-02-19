import React from 'react'
import { connect } from 'react-redux'

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

    const space = trait.space
    const property = trait.property

    return (
      <Tex>
        <h3>
          <span>{property.name}</span>
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
            <Markdown text={property.description}/>
          </div>
        : ''}

        <Proof space={space} trait={trait}/>
      </Tex>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    trait: Q.findTrait(state, ownProps.params.spaceName, ownProps.params.propertyName).toJS()
  })
)(Trait)
