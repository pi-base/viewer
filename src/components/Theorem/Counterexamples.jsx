import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as L from '../../logic'
import * as Q from '../../queries'

import Implication from '../Implication'
import TraitTable  from '../Trait/Table'


class Counterexamples extends React.Component {
  theoremConverse() {
    const { theorem } = this.props
    return theorem.merge({ if: theorem.get('then'), then: theorem.get('if') })
  }

  render () {
    const { counterexamples, theorem, proveConverse } = this.props

    if (counterexamples.size > 0) {
      return (
        <aside>
          <p>This implication does not reverse, as shown by</p>
          <TraitTable spaces={counterexamples} properties={Q.theoremProperties(theorem).toList()}/>
        </aside>
      )
    }

    const converse = proveConverse()

    if (converse) {
      return (
        <aside>
          <p>The converse also holds</p>
          <table className="table table-condensed">
            <thead>
              <tr>
                <th><Implication theorem={this.theoremConverse()} link={false}/></th>
                <th>By</th>
              </tr>
            </thead>
            <tbody>
              {converse.map(thrm =>
                <tr key={thrm.get('uid')}>
                  <td>
                    <Implication theorem={thrm} link={false}/>
                  </td>
                  <td>
                    <Link to={`/theorems/${thrm.get('uid')}`}>{thrm.get('uid')}</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </aside>
      )
    }

    return <aside>No examples found disproving the converse.{theorem.converse}</aside>
  }
}

Counterexamples.propTypes = {
  theorem: PropTypes.object.isRequired
}

export default connect(
  (state, ownProps) => ({
    counterexamples: Q.counterexamples(state, ownProps.theorem).toList(),
    proveConverse:   () => L.proveConverse(state, ownProps.theorem)
  })
)(Counterexamples)
