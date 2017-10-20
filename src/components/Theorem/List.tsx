import * as React from 'react'
import { Link } from 'react-router'
import * as I from 'immutable'

import { observer } from 'mobx-react'
import store from '../../store'

import * as Q from '../../queries'
import * as T from '../../types'

import Filter from '../Filter'
import Implication from '../../containers/Implication'
import Preview from '../Preview'
import Tex from '../Tex'

interface Props {
  theorems: I.List<T.Theorem>
  properties: T.Finder<T.Property>
}

interface State {
  limit: number
  theorems: I.List<T.Theorem>
}

@observer
class Theorems extends React.Component<Props, State> {
  // TODO: can clean up filtering with computed props
  constructor(props: Props) {
    super(props)
    this.state = {
      limit: 10,
      theorems: I.List<T.Theorem>()
    }
  }

  componentWillMount() {
    this.doFilter(store.theorems.all)
  }

  more() {
    this.setState({ limit: this.state.limit + 10 })
  }

  doFilter(theorems: I.List<T.Theorem>) {
    this.setState({
      limit: 300,
      theorems: theorems.size ? theorems : this.props.theorems
    })
  }

  render() {
    const theorems = this.state.theorems.slice(0, this.state.limit)

    return (
      <section className="theorems">
        <Filter
          collection={this.props.theorems}
          onChange={(ts) => this.doFilter(I.List<T.Theorem>(ts))}
          weights={[
            { name: 'if', weight: 0.7 },
            { name: 'then', weight: 0.7 },
            { name: 'description', weight: 0.5 }
          ]}
          placeholder="Filter theorems"
        />

        {theorems.map((t: T.Theorem) => (
          <Tex key={t.uid}>
            <h3>
              <Link to={`/theorems/${t.uid}`}>
                <Implication theorem={t} link={false} properties={this.props.properties} />
              </Link>
            </h3>
            <Preview text={t.description} />
          </Tex>
        ))}

        {this.props.theorems.size > this.state.limit
          ? <button className="btn btn-default" onClick={() => this.more()}>Show More</button>
          : ''}
      </section>
    )
  }
}

export default Theorems
