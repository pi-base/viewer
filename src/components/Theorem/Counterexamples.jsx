import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Q from '../../queries'

import Implication from '../Implication'
import TraitTable  from '../Trait/Table'


class Counterexamples extends React.Component {
  render () {
    const { counterexamples, theorem } = this.props

    if (theorem.converse) {
      return <aside>
        <p>The converse of this theorem also holds</p>
        <table className="table table-condensed">
          <tbody>
            {theorem.converse.map(id =>
              <tr key={id}>
                <td>
                  <Link to={`/theorems/${id}`}>{id}</Link>
                </td>
                <td>
                  <Implication theorem={this.props.findTheorem(id)} link={false}/>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </aside>
    }
    if (counterexamples.size === 0) {
      return <aside>No examples found disproving the converse.{theorem.converse}</aside>
    }

    return (
      <aside>
        <p>This implication does not reverse, as shown by</p>
        <TraitTable spaces={counterexamples} properties={Q.theoremProperties(theorem)}/>
      </aside>
    )
  }
}

Counterexamples.propTypes = {
  theorem: PropTypes.object.isRequired
}

export default connect(
  (state, ownProps) => ({
    counterexamples: Q.counterexamples(state, ownProps.theorem).toList(),
    findTheorem:     (id) => Q.findTheorem(state,id)
  })
)(Counterexamples)
