import React from 'react'
import Relay from 'react-relay'

import Icon     from './Icon'
import Markdown from './Markdown'
import Proof    from './Proof'
import Tex      from './Tex'


class Trait extends React.Component {
  constructor() {
    super()
    this.state = { showProperty: false }
  }

  toggleShowProperty() {
    this.setState({ showProperty: !this.state.showProperty })
  }

  render() {
    const space = this.props.viewer.spaces[0]
    if (!space) { return null }

    const trait = space.traits[0]
    const property = trait.property

    return (
      <Tex>
        <h3>
          {property.name}
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

export default Relay.createContainer(Trait, {
  initialVariables: {
    spaceName: null,
    propertyName: null
  },
  fragments: {
    viewer: (vars) => {
      if (!vars.spaceName || !vars.propertyName) { return '' }

      return Relay.QL`
        fragment on Viewer {
          spaces(name: $spaceName) {
            name
            traits(propertyName: $propertyName) {
              deduced
              description
              proof
              property {
                name
                description
              }
            }
          }
        }
      `
    }
  }
})
