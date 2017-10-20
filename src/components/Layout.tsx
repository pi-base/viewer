import * as React from 'react'
import { observer } from 'mobx-react'

import * as Q from '../graph/queries'
import store from '../store'

import Navbar from './Navbar'

@observer
class Layout extends React.Component<any> {
  componentWillMount() {
    if (!this.props.version) { this.loadViewer() }
  }

  componentWillReceiveProps(newProps: any) {
    if (!newProps.version) { this.loadViewer() }
  }

  loadViewer() {
    store.loadView(Q.viewer).then(() => {
      store.runProver()
    })
  }

  loaded() {
    return this.props.location.pathname === '/' || store.version
  }

  render() {
    return (
      <div>
        <Navbar />

        <div className="container">
          {this.loaded()
            ? this.props.children
            : 'Loading...'}
        </div>
      </div>
    );
  }
}

export default Layout