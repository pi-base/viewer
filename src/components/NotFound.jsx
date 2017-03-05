import React from 'react'
import { connect } from 'react-redux'

import * as A from '../actions'
import * as Q from '../queries'

const lpad = (str, pad, len) => {
  const padLen = len - str.length
  while (pad.length < padLen) {
    pad += pad
  }
  return pad + str
}

class NotFound extends React.Component {
  render() {
    const path = this.props.router.location.pathname

    // Redirect cached URLs
    // Searches - TODO: preserve old q= parameter
    if (path.match(/search/)) {
      this.props.router.push(`/spaces`)
      return null
    }

    // Redirect traits by id to their canonical URL
    const m = path.match(/traits\/(\d+)/)
    if (m) {
      const trait = this.props.findTrait('T' + lpad(m[1], '0', 6))
      if (trait) {
        this.props.router.push(`/spaces/${trait.get('space').get('uid')}/properties/${trait.get('property').get('uid')}`)
        return null
      }
    }

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
  (state) => ({
    findTrait: (id) => Q.fetchTrait(state)(id)
  }),
  (dispatch) => ({
    report: (path) => dispatch(A.pageNotFound(path))
  })
)(NotFound)
