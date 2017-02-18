import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Q from '../queries'

import Preview from './Preview'
import Tex     from './Tex'

class Counterexamples extends React.Component {
  render () {
    const { counterexamples } = this.props

    return (
      <aside>
        { counterexamples.length === 0
        ? <p>No examples found disproving the converse</p>
        : <p>This implication does not reverse, as shown by</p>
        }
        {counterexamples.map(space =>
          <Tex key={space.uid}>
            <h4>
              <Link to={`/spaces/${space.name}`}>
                {space.name}
              </Link>
            </h4>
            <Preview text={space.description}/>
          </Tex>
        )}
      </aside>
    )
  }
}

Counterexamples.propTypes = {
  theorem: PropTypes.object.isRequired
}

export default connect(
  (state, ownProps) => ({
    counterexamples: Q.counterexamples(state, ownProps.theorem).toJS()
  })
)(Counterexamples)
