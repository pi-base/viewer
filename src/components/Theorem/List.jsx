import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as I from 'immutable'

import * as Q from '../../queries'

import Filter      from '../Filter'
import Implication from '../Implication'
import Preview     from '../Preview'
import Tex         from '../Tex'

class Theorems extends React.Component {
  constructor() {
    super()
    this.state = {
      limit: 10,
      theorems: []
    }
  }

  componentWillMount() {
    this.doFilter(this.props.theorems)
  }

  more() {
    this.setState({ limit: this.state.limit + 10 })
  }

  doFilter(theorems) {
    this.setState({
      limit: 10,
      theorems: theorems.size ? theorems : this.props.theorems
    })
  }

  render() {
    const theorems = this.state.theorems.slice(0, this.state.limit)

    return (
      <section className="theorems">
        <Filter
          collection={this.props.theorems}
          onChange={this.doFilter.bind(this)}
          weights={[
            { name: 'antecedent',  weight: 0.7 },
            { name: 'consequent',  weight: 0.7 },
            { name: 'description', weight: 0.5 }
          ]}
          placeholder="Filter theorems"
        />

        {theorems.map(t =>
          <Tex key={t.get('uid')}>
            <h3>
              <Link to={`/theorems/${t.get('uid')}`}>
                <Implication theorem={t} link={false}/>
              </Link>
            </h3>
            <Preview text={t.get('description')}/>
          </Tex>
        )}

        { this.props.theorems.size > this.state.limit
        ? <button className="btn btn-default" onClick={() => this.more()}>Show More</button>
        : ''}
      </section>
    )
  }
}

Theorems.propTypes = {
  theorems: PropTypes.instanceOf(I.List)
}

export default connect(
  (state) => ({
    theorems: Q.allTheorems(state).toList()
  })
)(Theorems)
