import React, { PropTypes }    from 'react'
import { Link } from 'react-router'

import * as Q from '../../queries'

import Formula from '../Formula'
import Preview from '../Preview'
import Tex     from '../Tex'

class Results extends React.Component {
  render() {
    const { formula, results } = this.props

    const { type, query } = results
    const spaces = results.spaces.toJS()

    if (spaces.length === 0) { return null }

    let title
    if (type === Q.BY_TEXT) {
      title = (<span>matching '{query}'</span>)
    } else {
      title = (<span>∋ <Formula formula={formula}></Formula></span>)
    }

    return (
      <div>
        <h2>
          {spaces.length} Spaces {title}
        </h2>

        {spaces.slice(0, 10).map(s =>
          <Tex key={s.uid} component="article">
            <Link to={`/spaces/${s.name}`}>{s.name}</Link>
            <Preview text={s.description}/>
          </Tex>
        )}
      </div>
    )
  }
}

Results.propTypes = {
  results: PropTypes.object.isRequired
}

export default Results
