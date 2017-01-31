import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import * as Q from '../../queries'
import Formula from '../Formula'

const Results = ({ formula, results }) => (
  <div>
    <Formula formula={formula}></Formula>
    <h2>{results.length} Results</h2>
    <ul>
      {results.map(s =>
        <li key={s.id}>
          <Link to={`/spaces/${s.id}`}>{s.name}</Link>
        </li>
      )}
    </ul>
  </div>
)

export default connect(
  (state) => ({
    results: Q.runSearch(state)
  })
)(Results)
