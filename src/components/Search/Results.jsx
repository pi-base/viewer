import React    from 'react'
import { Link } from 'react-router'

import Formula from '../Formula'
import Preview from '../Preview'
import Tex     from '../Tex'

class Results extends React.Component {
  render() {
    const { formula, results } = this.props

    if (results.length === 0) { return null }

    return (
      <div>
        <h2>
          {results.length} Spaces ∋
          <Formula formula={formula}></Formula>
        </h2>

        {results.slice(0, 10).map(s =>
          <Tex key={s.uid} component="article">
            <Link to={`/spaces/${s.name}`}>{s.name}</Link>
            <Preview text={s.description}/>
          </Tex>
        )}
      </div>
    )
  }
}

export default Results
