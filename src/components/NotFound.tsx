import * as F from '../models/Formula'
import * as React from 'react'
import * as query from 'query-string'

import { Formula, Property, Space, State } from '../types'
import { RollbarProps, withRollbar } from '../errors'
import { RouteComponentProps, withRouter } from 'react-router'
import { propertyFinder, spaceFinder } from '../selectors'

import Id from '../models/Id'
import { compose } from 'redux'
import { connect } from 'react-redux'

interface StateProps {
  findSpace: (id: string) => Space | undefined
  convertFormula: (q: string) => Formula<Property> | undefined
}

type Props = StateProps & RouteComponentProps<{}> & RollbarProps

class NotFound extends React.PureComponent<Props> {
  componentWillMount() {
    const path = this.props.location.pathname

    // Redirect cached URLs
    if (path.match(/search/)) {
      const q = query.parse(this.props.location.search)
      let newPath = '/spaces'
      if (q) {
        const f = this.props.convertFormula(q)
        if (f) {
          newPath += `?q=${encodeURIComponent(F.toString(f))}`
        }
      }
      return this.props.history.push(newPath)
    }

    let m = path.match(/spaces\/(\d+)/)
    if (m) {
      const space = this.props.findSpace(Id('S', m[1]))
      if (space) {
        return this.props.history.push(`/spaces/${space.uid}`)
      }
    }

    // FIXME
    // // Redirect traits by id to their canonical URL
    // m = path.match(/traits\/(\d+)/)
    // if (m) {
    //   const trait = this.props.findTrait(Id('T', m[1]))
    //   if (trait) {
    //     return this.props.router.push(`/spaces/${trait.space.uid}/properties/${trait.property.uid}`)
    //   }
    // }

    this.props.report('404', { level: 'info', extra: { path } })
  }

  render() {
    const { location } = this.props

    return (
      <div className="jumbotron">
        <h1>404: Page Not Found</h1>
        <p>You appear to be looking for <code>{location.pathname}</code>, but we don't know how to find that.</p>
        <p>
          You can press the back button to head back where you were, or
          {' '}
          <a href="https://github.com/pi-base/viewer/issues">report this</a>
          {' '}
          if you think it's a bug.
          </p>
      </div>
    )
  }
}

const mapStateToProperties = (state: State) => ({
  findSpace: spaceFinder(state).find,
  convertFormula: (q: string) => {
    if (!q) { return }

    const finder = propertyFinder(state)

    try {
      const f = F.fromJSON(JSON.parse(q))
      return F.mapProperty(id => finder.find(Id('P', id))!, f)
    } catch (e) {
      return
    }
  }
})

export default compose(
  withRouter,
  withRollbar,
  connect(mapStateToProperties)
)(NotFound)