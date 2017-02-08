import React from 'react'
import { connect } from 'react-redux'

import * as Q from '../../queries'

import Tex from '../Tex'
import TraitItem from './Item'

const ASSERTED = 'ASSERTED'
const DEDUCED = 'DEDUCED'
const ALL = 'ALL'

class TraitPager extends React.Component {
  constructor() {
    super()
    this.state = {
      traits: [],
      q: '',
      type: ASSERTED,
      limit: 10
    }
  }

  componentDidMount() {
    this.setState({ traits: this.props.filterTraits(this.state.q) })
  }

  toggleShowAll() {
    const limit = this.state.limit ? false : 10
    this.setState({ limit: limit })
  }

  queueFilter(str) {
    this.setState({ q: str })

    if (this.wait) {
      clearTimeout(this.wait)
      this.wait = null
    }
    this.wait = setTimeout(() => {
      this.setState({ traits: this.props.filterTraits(this.state.q) })
      this.wait = null
    }, 500)
  }

  traits() {
    return this.limit(this.state.traits.filter((t) => this.showTrait(t)))
  }

  showTrait(t) {
    if (this.state.type === ALL) { return true }

    if (this.state.type === DEDUCED) { return t.deduced }
    if (this.state.type === ASSERTED) { return !t.deduced }
  }

  limit(array) {
    if (this.state.limit) {
      return array.slice(0, this.state.limit)
    } else {
      return array
    }
  }

  set(name, value) {
    const updates = {}
    updates[name] = value
    this.setState(updates)
  }

  render() {
    const { space } = this.props

    const btn = (label, name, value) => {
      const klass = this.state[name] === value ? 'active' : ''
      return (<button
        className={`btn btn-default ${klass}`}
        onClick={() => this.set(name, value)}>
        {label}
      </button>)
    }

    return (
      <Tex>
        <div className="btn-group">
          {btn('Asserted', 'type', ASSERTED)}
          {btn('Deduced', 'type', DEDUCED)}
          {btn('All', 'type', ALL)}
        </div>
        <button
          className={`btn btn-default ${this.state.limit ? '' : 'active'}`}
          onClick={() => this.toggleShowAll()}>Show All</button>
        <input
          type="text"
          autoComplete="off"
          className="form-control"
          name="traitFilter"
          placeholder="Property Search"
          value={this.state.q}
          onChange={(e) => this.queueFilter(e.target.value)}/>
        <table className="table table-condensed">
          <thead></thead>
          <tbody>
              {this.traits().map(trait =>
                <TraitItem key={trait.property.name} space={space} property={trait.property} trait={trait}/>
              )}
          </tbody>
        </table>
      </Tex>
    )
  }
}

export default connect(
  (state, ownProps) => {
    return {
      filterTraits: (f) => Q.filteredTraitsForSpace(state, ownProps.space, f)
    }
  }
)(TraitPager)
