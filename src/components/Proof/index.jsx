import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as I from 'immutable'

import * as Q from '../../queries'

import Markdown      from '../Markdown'
import ProofExplorer from './Explorer'
import Tex           from '../Tex'

class Proof extends React.Component {
  render() {
    const { space, trait, proof } = this.props

    if (proof) {
      return <ProofExplorer space={space} trait={trait} proof={proof}/>
    } else if (trait.get('description')) {
      return <Tex><Markdown text={trait.get('description')}/></Tex>
    } else {
      return (
        <p>
          <i>No proof given</i>
        </p>
      )
    }
  }
}

Proof.propTypes = {
  space: PropTypes.instanceOf(I.Map),
  trait: PropTypes.instanceOf(I.Map)
}

export default connect(
  (state, ownProps) => ({
    proof: Q.getProof(state, ownProps.trait)
  })
)(Proof)
