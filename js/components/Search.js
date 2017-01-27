import React from 'react';
import Relay from 'react-relay';

class Search extends React.Component {
  render() {
    return (
      <div>
        <h1>Search</h1>
        <p>{this.props.viewer.spaces.edges.length} traits</p>
        <pre>{JSON.stringify(this.props.viewer.spaces, null, 2)}</pre>
      </div>
    )
  }
}

export default Relay.createContainer(Search, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        spaces(first: 10) {
          edges {
            node {
              id
              name
              slug
              traits(first: 1000) {
                edges {
                  node {
                    id
                    value
                    property {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  }
});
