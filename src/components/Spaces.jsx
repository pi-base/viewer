import React from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'

import Tex from './Tex'

class Spaces extends React.Component {
  render() {
    const spaces = this.props.viewer.spaces.slice(0, 10)

    return (
      <section className="spaces">
        <h1>Spaces</h1>
        {spaces.map(space =>
          <Tex key={space.uid}>
            <h3>
              <Link to={`/spaces/${space.name}`}>
                {space.name}
              </Link>
            </h3>
            <div>{space.preview}</div>
          </Tex>
        )}
      </section>
    )
  }
}

export default Relay.createContainer(Spaces, {
  // FIXME: if we start at e.g. /theorems and then navigate here, the Relay
  // container fetches each space node-wise, making _way_ too many queries
  // May need a custom network layer here. See https://github.com/facebook/relay/issues/520
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        spaces {
          uid
          name
          preview
        }
      }
    `
  }
});
