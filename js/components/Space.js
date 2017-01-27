import React from 'react';
import Relay from 'react-relay';

import { Link } from 'react-router';

class Space extends React.Component {
  handleClick() {
    let traits = this.props.space.traits.edges
    console.log('cursor', traits)

    this.props.relay.setVariables({after: traits[traits.length - 1].cursor})
  }

  render() {
    if (!this.props.space) {
      console.log('no spaceId')
      return null;
    }

    console.log('props', this.props);

    return (
      <div>
        <Link to='/spaces'>All Spaces</Link>
        <h1>{this.props.space.name}</h1>
        <button onClick={this.handleClick.bind(this)}>Next</button>
        <ul>
          {this.props.space.traits.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.property.name} ({edge.node.value})</li>
          )}
        </ul>
        {this.props.children}
      </div>
    );
  }
}

export default Relay.createContainer(Space, {
  initialVariables: { after: null },
  fragments: {
    space: () => Relay.QL`
      fragment on Space {
        name
        traits(first: 25, after: $after) {
          edges {
            cursor
            node {
              id
              value
              property {
                name
              }
            },
          },
        },
      }
    `,
  },
});
