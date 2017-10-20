import * as React from 'react'
import * as I from 'immutable'
import { observer } from 'mobx-react'

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

export interface State {
  limit: number | undefined
  tabs: I.Map<string, boolean>
  filtered: I.List<T.Trait>
}

@observer
class TraitPager extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      limit: 10,
      tabs: I.Map({
        Asserted: false,
        Deduced: false
      }),
      filtered: I.List<T.Trait>()
    }
  }

  componentWillMount() {
    this.display(this.all())
  }

  all() {
    return store.traitsBySpace(this.props.space.uid)
  }

  display(traits: I.List<T.Trait>) {
    this.setState({ filtered: traits })
  }

  toggleTab(name: string) {
    this.setState((state: State) => ({
      ...state,
      tabs: state.tabs.set(name, !state.tabs.get(name))
    }))
  }

  toggleShowAll() {
    const limit = this.state.limit ? undefined : 10
    this.setState({ limit: limit })
  }

  limited(seq: I.Iterable<number, T.Trait>) {
    if (this.state.limit) {
      return seq.take(this.state.limit)
    } else {
      return seq
    }
  }

  tabbed(seq: I.Iterable<number, T.Trait>) {
    const asserted = this.state.tabs.get('Asserted')
    const deduced = this.state.tabs.get('Deduced')

    if (asserted && deduced) {
      return seq
    } else if (asserted) {
      return seq.filter((t: T.Trait) => !store.hasProof(t))
    } else if (deduced) {
      return seq.filter((t: T.Trait) => store.hasProof(t))
    } else {
      return seq
    }
  }

  render() {
    const tabbed = this.tabbed(this.state.filtered)
    const limited = this.limited(tabbed)

    const tab = ({ icon, name }: Tab) => {
      const active = this.state.tabs.get(name) ? 'active' : ''

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
          collection={this.all()}
          weights={['property.name']}
          onChange={(ts) => this.display(I.List<T.Trait>(ts))}
        />

        <table className="table table-condensed">
          <thead />
          <tbody>
            {limited.map((trait: T.Trait) =>
              <TraitItem key={trait.property.uid} trait={trait} />
            )}
          </tbody>
        </table>

        <Limiter
          limit={this.state.limit || 10}
          found={limited.size}
          total={tabbed.size}
          onClick={() => this.toggleShowAll()}
        />
      </Tex>
    )
  }
}

export default TraitPager
