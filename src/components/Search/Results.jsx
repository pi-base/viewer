import React from 'react'
import {Link} from 'react-router'

import Formula from '../Formula'
import Tex     from '../Tex'

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
          <Tex key={s.uid} component="article">
            <Link to={`/spaces/${s.uid}`}>{s.name}</Link>
            <div>{s.preview}</div>
          </Tex>
        )}
      </div>
    )
  }
}

export default Results
