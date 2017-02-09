import React from 'react'
import Relay from 'react-relay'

import Markdown from './Markdown'
import Tex from './Tex'

class Proof extends React.Component {
  render() {
    if (this.props.deduced) {
      return <p><i>Automatically deduced</i></p>
    } else if (this.props.description) {
      return <Markdown text={this.props.description}/>
    } else {
      return <p><i>No proof given</i></p>
    }
  }
}

class Trait extends React.Component {
  render() {
    const space = this.props.viewer.spaces[0]
    if (!space) { return null }

    const trait = space.traits[0]
    const property = trait.property

    return (
      <Tex>
        <h3>{property.name}</h3>
        <Markdown text={property.description}/>

        <h4>Proof</h4>
        <Proof trait={trait}/>
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
            traits(propertyName: $propertyName) {
              description
              deduced
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
