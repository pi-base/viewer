import React from 'react'
import {Link} from 'react-router'

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

export default Results
