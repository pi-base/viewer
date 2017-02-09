import React from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'

import Tex from './Tex'

 // TODO: this should probably be server-side
import { preview } from '../utils'

class Spaces extends React.Component {
  render() {
    return (
      <section className="spaces">
        <h1>Spaces</h1>
        {this.props.viewer.spaces.slice(0,10).map(space =>
          <Tex key={space.uid}>
            <h2>
              <Link to={`/spaces/${space.name}`}>
                {space.name}
              </Link>
            </h2>
            <div>{preview(space.description)}</div>
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
          description
        }
      }
    `
  }
});
