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
