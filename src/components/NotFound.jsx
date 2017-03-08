import React from 'react'
import { connect } from 'react-redux'

import * as A from '../actions'
import * as F from '../models/Formula'
import * as Q from '../queries'

const lpad = (str, pad, len) => {
  const padLen = len - str.length
  while (pad.length < padLen) {
    pad += pad
  }
  return pad + str
}

const padId = (pre, num) => (pre + lpad(num, '0', 6))

const tryConvertFormula = (state, q) => {
  if (!q) { return }

  try {
    const f = F.fromJSON(JSON.parse(q))
    return f.mapProperty(id => state.getIn(['properties', padId('P', id)]))
  } catch (e) {
    return
  }
}

class NotFound extends React.Component {
  componentWillMount() {
    const path = this.props.router.location.pathname

    // Redirect cached URLs
    if (path.match(/search/)) {
      const q = this.props.router.location.query.q
      let path = '/spaces'
      if (q) {
        const f = this.props.tryConvertFormula(q)
        if (f) {
          path += `?q=${encodeURIComponent(F.toString(f))}`
        }
      }
      return this.props.router.push(path)
    }

    // Redirect traits by id to their canonical URL
    const m = path.match(/traits\/(\d+)/)
    if (m) {
      const trait = this.props.findTrait(padId('T', m[1]))
      if (trait) {
        return this.props.router.push(`/spaces/${trait.get('space').get('uid')}/properties/${trait.get('property').get('uid')}`)
      }
    }

    this.props.report(path)
  }

  render() {
    const path = this.props.router.location.pathname

    return (
      <div className="jumbotron">
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
    )
  }
}

export default connect(
  (state) => ({
    findTrait: (id) => Q.fetchTrait(state)(id),
    tryConvertFormula: (f) => tryConvertFormula(state, f)
  }),
  (dispatch) => ({
    report: (path) => dispatch(A.pageNotFound(path))
  })
)(NotFound)
