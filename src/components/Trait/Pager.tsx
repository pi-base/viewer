import * as React from 'react'
import { connect } from 'react-redux'

import { asserted, spaceTraits } from '../../selectors'
import { Space, Trait, State as RootState } from '../../types'

import Icon from '../Icon'
import Filter from '../Filter'
import Limiter from '../Limiter'
import Tex from '../Tex'
import TraitItem from './Item'

type OwnProps = {
  space: Space
}
type StateProps = {
  traits: Trait[]
  isDeduced: (trait: Trait) => boolean
}
type Props = OwnProps & StateProps

type State = {
  filtered: Trait[]
  limit: number | undefined
  tabs: {
    asserted: boolean
    deduced: boolean
  }
}

const TabButton = ({ icon, name, active, onClick }) => (
  <button
    className={`btn btn-default ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    <Icon type={icon} />
    {' '}
    {name}
  </button >
)

class TraitPager extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      filtered: this.props.traits,
      tabs: {
        asserted: true,
        deduced: false
      },
      limit: 10
    }
  }

  componentWillReceiveProps(props: Props) {
    this.setState({ filtered: props.traits })
  }

  results(): Trait[] {
    const t = this.state.tabs

    if (t.asserted && t.deduced) {
      return this.state.filtered
    } else if (t.asserted) {
      return this.state.filtered.filter(p => !this.props.isDeduced(p))
    } else if (t.deduced) {
      return this.state.filtered.filter(p => this.props.isDeduced(p))
    } else {
      return this.state.filtered
    }
  }

  visible(results: Trait[]): Trait[] {
    if (this.state.limit) {
      return results.slice(0, this.state.limit)
    } else {
      return results
    }
  }

  toggleTab(name: string) {
    this.setState(({ tabs }) => {
      const next = { ...tabs }
      next[name] = !next[name]
      return { tabs: next }
    })
  }

  toggleShowAll() {
    this.setState(({ limit }) => ({ limit: limit ? undefined : 10 }))
  }

  render() {
    const results = this.results()
    const visible = this.visible(results)

    return (
      <Tex className="traitFilter">
        <div className="btn-group">
          <TabButton
            icon="pencil"
            name="Asserted"
            active={this.state.tabs.asserted}
            onClick={() => this.toggleTab('asserted')}
          />
          <TabButton
            icon="search"
            name="Deduced"
            active={this.state.tabs.deduced}
            onClick={() => this.toggleTab('deduced')}
          />
        </div>

        <Filter
          collection={this.props.traits}
          weights={['property.name']}
          onChange={(filtered: Trait[]) => this.setState({ filtered })}
        />

        <table className="table table-condensed">
          <thead />
          <tbody>
            {visible.map(trait =>
              <TraitItem key={trait.property.uid} trait={trait} />
            )}
          </tbody>
        </table>

        <Limiter
          limit={this.state.limit || 10}
          found={visible.length}
          total={results.length}
          onClick={() => this.toggleShowAll()}
        />
      </Tex>
    )
  }
}

export default connect(
  (state: RootState, ownProps: OwnProps): StateProps => ({
    traits: spaceTraits(state, ownProps.space).sort(
      (a, b) => a.property.name >= b.property.name ? 1 : -1
    ),
    isDeduced: t => !asserted(state, t.space.uid, t.property.uid) // .proofs.has(t.space.uid)
  })
)(TraitPager)
