import React from 'react'

import U from '../U'

import Tex from '../Tex'
import TraitItem from './Item'


const TraitTab = ({ name, filter, traits, active, onSelect }) => {
  const scope = traits.filter(filter).toArray()

  return <button
    className={`btn btn-default ${active ? 'active' : ''}`}
    onClick={() => onSelect()}>
    {scope.length} {name}
  </button>
}

const Tabs = [
  { name: 'Asserted', filter: (t) => !t.deduced },
  { name: 'Deduced',  filter: (t) =>  t.deduced },
  { name: 'All',      filter: (t) => true }
]

class TraitPager extends React.Component {
  constructor() {
    super()

    this.state = {
      q: '',
      limit: 10,
      tab: Tabs[0]
    }
  }

  all() {
    return this.props.universe.spaceTraits(this.props.space)
  }

  traits() {
    const filter = this.state.tab.filter
    return this.limit(this.all().filter(filter)).toArray()
  }

  toggleShowAll() {
    const limit = this.state.limit ? false : 10
    this.setState({ limit: limit })
  }

  queueFilter(q) {
    this.setState({ q })
    console.log('TODO: apply property finder to filter results')
  }

  limit(seq) {
    if (this.state.limit) {
      return seq.take(this.state.limit)
    } else {
      return seq
    }
  }

  render() {
    const { space } = this.props

    const tab = (t) => {
      return <TraitTab
        key={t.name}
        name={t.name}
        filter={t.filter}
        traits={this.all()}
        active={this.state.tab === t}
        onSelect={() => this.setState({ tab: t })}
      />
    }

    return (
      <Tex>
        <div className="btn-group">
          {Tabs.map(t => tab(t))}
        </div>

        <button
          className={`btn btn-default ${this.state.limit ? '' : 'active'}`}
          onClick={() => this.toggleShowAll()}
        >
          Show All
        </button>

        <input
          type="text"
          autoComplete="off"
          className="form-control"
          name="traitFilter"
          placeholder="Property Search"
          value={this.state.q}
          onChange={(e) => this.queueFilter(e.target.value)}
        />

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

export default U(TraitPager)
