import * as React from 'react'
import { observer } from 'mobx-react'

import * as Q from '../graph/queries'
import store from '../store'
import * as T from '../types'

import Navbar from './Navbar'

type Props = T.RouterProps

@observer
class Layout extends React.Component<Props, {}> {
  componentWillMount() {
    if (!store.version) { this.loadViewer() }
  }

  loadViewer() {
    store.loadView(Q.viewer).then(() => {
      setTimeout(() => store.checkAll(), 0)
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