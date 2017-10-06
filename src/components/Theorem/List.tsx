import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as I from 'immutable'

import * as Q from '../../queries'
import * as T from '../../types'

import Filter      from '../Filter'
import Implication from '../Implication'
import Preview     from '../Preview'
import Tex         from '../Tex'

interface Props {
  theorems: I.List<T.Theorem>
}

interface State {
  limit: number
  theorems: I.List<T.Theorem>
}

class Theorems extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      limit: 10,
      theorems: I.List<T.Theorem>()
    }
  }

  componentWillMount() {
    this.doFilter(this.props.theorems)
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
            { name: 'if',          weight: 0.7 },
            { name: 'then',        weight: 0.7 },
            { name: 'description', weight: 0.5 }
          ]}
          placeholder="Filter theorems"
        />

        {theorems.map((t: T.Theorem) => (
          <Tex key={t.uid}>
            <h3>
              <Link to={`/theorems/${t.uid}`}>
                <Implication theorem={t} link={false}/>
              </Link>
            </h3>
            <Preview text={t.description}/>
          </Tex>
        ))}

        { this.props.theorems.size > this.state.limit
        ? <button className="btn btn-default" onClick={() => this.more()}>Show More</button>
        : ''}
      </section>
    )
  }
}

export default connect(
  (state) => ({
    theorems: Q.allTheorems(state).toList()
  })
)(Theorems)
