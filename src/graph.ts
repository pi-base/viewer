import { connect } from 'react-redux'
import { graphql, gql, withApollo, compose } from 'react-apollo'

import { Client } from './graph/client'
import * as A from './actions'
import * as Q from './graph/queries'

export * from './graph/client'
export * from './graph/queries'

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
      }
    }
  `

  const withViewer = component => props => {
    const data = props.data as any
    if (data && data.viewer) {
      return component({ ...props, viewer: data.viewer })
    } else {
      return null
    }
  }

  return compose(
    connect(
      (state) => ({
        version: state.viewer.version
      })
    ),
    graphql(query, {
      options: (props: any) => ({
        variables: {
          version: props.version
        }
      })
    }),
    withViewer
  )
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
    return component({ ...props, update })
  }

  return compose(
    withApollo,
    connect(
      () => ({}),
      (dispatch) => ({
        loadedView: (v) => dispatch(A.loadedView(v))
      })
    ),
    withUpdate
  )
}