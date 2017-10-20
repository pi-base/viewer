import * as React from 'react'
import { compose, withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import * as I from 'immutable'

import { mobxStore } from '../store'

import Navbar from './Navbar'

import * as A from '../actions'
import * as F from '../models/Formula'
import * as Q from '../graph/queries'
import * as T from '../types'

import { Finder } from '../models/PropertyFinder'

class Layout extends React.Component<any> {
  componentWillMount() {
    if (!this.props.version) {
      this.fetchViewer()
    }
  }

  componentWillReceiveProps(newProps: any) {
    if (!newProps.version) {
      this.fetchViewer()
    }
  }

  fetchViewer() {
    const { client, loadedView } = this.props
    client.query({ query: Q.viewer }).then(response => {
      loadedView(response.data.viewer)
      mobxStore.loadView(response.data.viewer)
    })
  }

  render() {
    const loaded = this.props.location.pathname === '/' || this.props.version

    return (
      <div>
        <Navbar />

        <div className="container">
          {loaded
            ? this.props.children
            : 'Loading...'}
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    version: state.viewer.version
  }),
  (dispatch) => ({
    loadedView: (v) => dispatch(A.loadedView(v))
  })
)(withApollo(Layout))