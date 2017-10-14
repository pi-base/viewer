import * as React from 'react'
import * as I from 'immutable'

import Navbar from './Navbar'
import Debug from './Debug'

import * as A from '../actions'
import * as F from '../models/Formula'
import * as T from '../types'

import { Finder } from '../models/PropertyFinder'
import { withViewer } from '../graph'

export interface Props {
  // tslint:disable-next-line no-any
  data: any
  location: {
    pathname: string
  }
}

export interface State {
  debug: boolean
}

class Layout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      debug: process.env.NODE_ENV === 'development'
    }
  }

  componentWillMount() {
    // Call _pi_base_debug in the console to show the debug toolbar in prod
    // tslint:disable-next-line no-any
    (window as any)._pi_base_debug = () => this.setState({ debug: !this.state.debug })
  }

  render() {
    const loaded = this.props.location.pathname === '/' ||
      (this.props.data && this.props.data.viewer)

    let spaces, traits, properties, theorems
    if (loaded) {
      const viewer = this.props.data.viewer

      traits = I.Map().withMutations(ts => {
        spaces = viewer.spaces.map(s => {
          s.traits.forEach(t => {
            ts.setIn([s.uid, t.property.uid], {
              value: t.value,
              deduced: false // FIXME
            })
          })
          return { uid: s.uid, name: s.name }
        })
      })

      properties = viewer.properties.map(p => {
        return { uid: p.uid, name: p.name }
      })

      theorems = viewer.theorems.map(t => {
        const r: any = { uid: t.uid }
        r.if = F.fromJSON(JSON.parse(t.if))
        r.then = F.fromJSON(JSON.parse(t.then))
        return r
      })

      spaces = I.List(spaces)
      properties = I.List(properties)
      theorems = I.List(theorems)
      traits = I.fromJS(traits)

      spaces.finder = new Finder(spaces)
      properties.finder = new Finder(properties)
    }

    return (
      <div>
        <Navbar />

        <div className="container">
          {loaded
            // tslint:disable-next-line no-any
            ? React.cloneElement(this.props.children as any, {
              spaces: spaces,
              properties: properties,
              traits: traits,
              theorems: theorems
            })
            : 'Loading...'}
        </div>

        {this.state.debug
          ? <Debug />
          : ''}
      </div>
    );
  }
}

export default withViewer(Layout)
