import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    space: () => Relay.QL`
      query {
        space(id: $spaceSlug)
      }
    `
  };
  static routeName = 'SpaceRoute';
}
