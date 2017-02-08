import React from 'react'
import Relay from 'react-relay'

import Tex from './Tex'

class Trait extends React.Component {
  render() {
    const { space } = this.props

    if (!space.trait) { return null }

    return (
      <Tex>
        <h3>{space.trait.property.name}</h3>
        <div>{space.trait.property.description}</div>

        <h4>Proof</h4>
        { space.trait.description
        ? <div>{space.trait.description}</div>
        : <p><i>No proof supplied</i></p>}
      </Tex>
    )
  }
}

export default Relay.createContainer(Trait, {
  initialVariables: {
    propertyId: null
  },
  fragments: {
    space: (variables) => {
      return Relay.QL`
        fragment on Space {
          name
          description
          trait(propertyId: $propertyId) {
            description
            property {
              name
              description
            }
          }
        }
      `
    }
  }
})
