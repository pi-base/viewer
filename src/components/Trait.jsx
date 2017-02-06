import React from 'react'
import Relay from 'react-relay'

import Tex from './Tex'

class Trait extends React.Component {
  render() {
    const { space } = this.props

    if (!space.trait) { return null }

    return (
      <div>
        <h3>{space.trait.property.name}</h3>
        <Tex>{space.trait.property.description}</Tex>

        <h4>Proof</h4>
        { space.trait.description
        ? <Tex>{space.trait.description}</Tex>
        : <p><i>No proof supplied</i></p>}
      </div>
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
