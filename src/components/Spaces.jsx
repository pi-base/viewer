import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

class Spaces extends React.Component {
  render() {
    return (
      <div>
        <h1>Spaces</h1>
        <ul>
          {this.props.viewer.spaces.edges.map(({node}) =>
            <li key={node.slug}>
              <Link to={`/spaces/${node.slug}`}>
                {node.name}
              </Link>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default Relay.createContainer(Spaces, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        spaces(first: 10) {
          edges {
            node {
              name
              slug
            }
          }
        }
      }
    `
  }
});
