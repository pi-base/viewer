import * as React from 'react'
import * as I from 'immutable'
import { observer } from 'mobx-react'
import { computed, observable } from 'mobx'

import * as Q from '../../queries'
import * as T from '../../types'
import store from '../../store'

import Icon from '../Icon'
import Filter from '../Filter'
import Limiter from '../Limiter'
import Tex from '../Tex'
import TraitItem from './Item'

export interface Props {
  space: T.Space
}

interface Tab {
  name: string
  icon: string
}

const Tabs: Tab[] = [
  { name: 'Asserted', icon: 'pencil' },
  { name: 'Deduced', icon: 'search' }
]

@observer
class TraitPager extends React.Component<Props, {}> {
  @observable all: I.List<T.Trait>
  @observable filtered: I.List<T.Trait>

  @observable limit: number | undefined
  @observable tabs: Map<string, boolean>

  constructor(props: Props) {
    super(props)
    this.limit = 10
    this.tabs = new Map([
      ['Asserted', false],
      ['Deduced', false]
    ])
    this.filtered = this.all = store.traits.forSpace(this.props.space.uid)
  }

  componentWillReceiveProps(newProps: Props) {
    if (this.props.space.uid !== newProps.space.uid) {
      this.filtered = this.all = store.traits.forSpace(this.props.space.uid)
    }
  }

  @computed get tabbed() {
    const asserted = this.tabs.get('Asserted')
    const deduced = this.tabs.get('Deduced')

    if (asserted && deduced) {
      return this.filtered
    } else if (asserted) {
      return this.filtered.filter(t => !store.proofs.for(t!))
    } else if (deduced) {
      return this.filtered.filter(t => !!store.proofs.for(t!))
    } else {
      return this.filtered
    }
  }

  @computed get limited() {
    if (this.limit) {
      return this.tabbed.take(this.limit)
    } else {
      return this.tabbed
    }
  }

  toggleTab(name: string) {
    this.tabs.set(
      name, !this.tabs.get(name)
    )
  }

  toggleShowAll() {
    this.limit = this.limit ? undefined : 10
  }

  render() {
    const tab = ({ icon, name }: Tab) => {
      const active = this.tabs.get(name) ? 'active' : ''

      return (
        <button
          key={name}
          className={`btn btn-default ${active}`}
          onClick={() => this.toggleTab(name)}
        >
          <Icon type={icon} />
          {' '}
          {name}
        </button>
      )
    }

    return (
      <Tex className="traitFilter">
        <div className="btn-group">
          {Tabs.map(tab)}
        </div>

        <Filter
          collection={this.all}
          weights={['property.name']}
          onChange={(ts) => this.filtered = I.List<T.Trait>(ts)}
        />

        <table className="table table-condensed">
          <thead />
          <tbody>
            {this.limited.map((trait: T.Trait) =>
              <TraitItem key={trait.property.uid} trait={trait} />
            )}
          </tbody>
        </table>

        <Limiter
          limit={this.limit || 10}
          found={this.limited.size}
          total={this.tabbed.size}
          onClick={() => this.toggleShowAll()}
        />
      </Tex>
    )
  }
}

export default TraitPager
