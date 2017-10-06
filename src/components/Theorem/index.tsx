import * as React from 'react'
import { connect } from 'react-redux'

import * as Q from '../../queries'
import * as T from '../../types'

import Counterexamples from './Counterexamples'
import Implication     from '../Implication'
import Markdown        from '../Markdown'
import Tex             from '../Tex'

interface Props {
  theorem: T.Theorem
  params: { theoremId: string }
}

function Theorem({ theorem }: Props) {
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
        <div className="col-md-6"/>
      </div>
    </div>
  )
}

function mapStateToProps(state: T.StoreState, { params }: Props) {
  return {
    theorem: Q.findTheorem(state, params.theoremId)
  }
}

export default connect(mapStateToProps)(Theorem)
