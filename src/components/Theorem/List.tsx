import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { State as StoreState } from '../../reducers'
import * as S from '../../selectors'
import { Theorem } from '../../types'
import { by } from '../../utils'

import Filter from '../Filter'
import EditLink from '../Form/EditLink'
import Implication from '../Implication'
import Preview from '../Preview'
import Tex from '../Tex'

type StateProps = {
  theorems: Theorem[]
}
type Props = StateProps

type State = {
  limit: number
  theorems: Theorem[]
}

class Theorems extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      limit: 10,
      theorems: props.theorems || []
    }
  }

  showMore() {
    this.setState(({ limit }) => ({ limit: limit + 10 }))
  }

  render() {
    const visible = this.state.theorems.slice(0, this.state.limit)
    return (
      <section className="theorems">
        <EditLink to="/theorems/new" className="btn btn-default">New</EditLink>

        <Filter
          collection={this.props.theorems}
          onChange={(theorems: Theorem[]) => this.setState({ theorems })}
          weights={[
            { name: 'if', weight: 0.7 },
            { name: 'then', weight: 0.7 },
            { name: 'description', weight: 0.5 }
          ]}
          placeholder="Filter theorems"
        />

        {visible.map(t => (
          <Tex key={t.uid}>
            <h3>
              <Link to={`/theorems/${t.uid}`}>
                <Implication theorem={t} link={false} />
              </Link>
            </h3>
            <Preview text={t.description} />
          </Tex>
        ))}

        {this.state.theorems.length > visible.length
          ? <button className="btn btn-default" onClick={this.showMore}>Show More</button>
          : ''}
      </section>
    )
  }
}

export default connect<StateProps, {}, {}>(
  (state: StoreState): StateProps => ({
    theorems: Array.from(state.theorems.values()).sort(by('uid')).reverse()
  })
)(Theorems)
