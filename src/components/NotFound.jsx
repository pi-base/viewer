import React from 'react'
import { connect } from 'react-redux'

import * as A from '../actions'

class NotFound extends React.Component {
  render() {
    const path = this.props.router.location.pathname

    this.props.report(path)

    return <div className="jumbotron">
      <h1>404: Page Not Found</h1>
      <p>You appear to be looking for <code>{path}</code>, but we don't know how to find that.</p>
      <p>
        You can press the back button to head back where you were, or
        {' '}
        <a href="https://github.com/jamesdabbs/pi-base-viewer/issues">report this</a>
        {' '}
        if you think it's a bug.
        </p>
    </div>
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    report: (path) => dispatch(A.pageNotFound(path))
  })
)(NotFound)
