import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import * as Q from '../../queries'
import Formula from '../Formula'

class Results extends React.Component {
  render() {
    const { formula, results } = this.props

    return (
      <div>
        <h2>
          {results.size} Spaces ∋
          <Formula formula={formula}></Formula>
        </h2>

        {results.map(s =>
          <article key={s.id}>
            <Link to={`/spaces/${s.id}`}>{s.name}</Link>
            <div>{s.description}</div>
          </article>
        )}
      </div>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    results: Q.runSearch(state, ownProps.formula)
  })
)(Results)
