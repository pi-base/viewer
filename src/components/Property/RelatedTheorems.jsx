import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Q from '../../queries'

import Implication from '../Implication'


class RelatedTheorems extends React.Component {
  render () {
    const { theorems } = this.props

    return (
      <div>
        <h4>Related Theorems</h4>
        {theorems.map(t =>
          <div key={t.uid}>
            <Link to={`/theorems/${t.uid}`}>
              <Implication theorem={t} link={false}/>
            </Link>
          </div>
        )}
      </div>
    )
  }
}

RelatedTheorems.propTypes = {
  property: PropTypes.object.isRequired
}

export default connect(
  (state, ownProps) => ({
    theorems: Q.relatedTheorems(state, ownProps.property).toJS()
  })
)(RelatedTheorems)
