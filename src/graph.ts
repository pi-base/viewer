import { graphql, gql, withApollo, compose } from 'react-apollo'

import { Client } from './graph/client'

export * from './graph/client'
export * from './graph/queries'

import store from './store'

if (process.env.NODE_ENV === 'test') {
  // tslint:disable-next-line no-any
  (global as any).fetch = require('isomorphic-fetch')
}
export const client = new Client()

// Wraps a component that needs read-only access to some
// subgraph of the `viewer`
export const view = (fragment) => {
  const query = gql`
    query View($version: string) {
      viewer(version: $version) {
        ${fragment}
        version
      }
    }
  `

  return graphql(query, {
    options: (props: any) => ({
      variables: {
        version: store.version
      }
    }),
    props: (props: any) => {
      if (props.data && props.data.viewer) {
        setTimeout(
          () => store.addView(props.data.viewer),
          0
        )
      }
      return props
    }
  })
}

// Wraps a component that executes a mutation which returns
// a viewer to
// * parse out the data from the result
// * always dispatch a version update event
export const updateView = (mutation) => {
  const name = mutation.definitions[0].name.value

  const withUpdate = component => props => {
    const update = (opts) => {
      return props.client.mutate({ ...opts, mutation }).then(response => {
        const viewer = response.data && response.data[name]
        props.loadedView(viewer)
        return viewer
      })
    }
    return new component({ ...props, update })
  }

  return compose(
    withApollo,
    withUpdate
  )
}