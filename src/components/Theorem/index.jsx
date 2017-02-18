import React from 'react'
import { connect } from 'react-redux'

import * as Q from '../../queries'

import Counterexamples from './Counterexamples'
import Implication     from '../Implication'
import Markdown        from '../Markdown'
import Tex             from '../Tex'

class Theorem extends React.Component {
  render() {
    const { theorem } = this.props

    return (
      <div>
        <h1>
          <Implication theorem={theorem} link={true}/>
        </h1>
        <Tex><Markdown text={theorem.description}/></Tex>
        <hr/>

        <div className="row">
          <div className="col-md-6">
            <Counterexamples theorem={theorem}/>
          </div>
          <div className="col-md-6">

          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    theorem: Q.findTheorem(state, ownProps.params.theoremId).toJS()
  })
)(Theorem)
