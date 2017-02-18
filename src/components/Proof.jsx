import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Q from '../queries'

import Markdown    from './Markdown'
import Implication from './Implication'

class Explorer extends React.Component {
  render() {
    const { space, proof } = this.props

    if (!proof) { return null }

    return <div className="proofExplorer">
      <p>Automatically deduced from the following properties</p>
      <ul>
        {proof.traits.map(t =>
          <li key={'prop' + t.property.uid}>
            <Link to={`/spaces/${space.name}/properties/${t.property.name}`}>
              {t.value ? '' : '¬'}
              {t.property.name}
            </Link>
          </li>
        )}
      </ul>

      <p>and theorems</p>
      <ul>
        {proof.theorems.map(t =>
          <li key={'implication' + t.uid}>
            <Link to={`/theorems/${t.uid}`}>
              <Implication theorem={t} link={false}/>
            </Link>
          </li>
        )}
      </ul>
    </div>
  }
}

Explorer.propTypes = {
  space: PropTypes.object.isRequired,
  trait: PropTypes.object.isRequired
}

const ProofExplorer = connect(
  (state, ownProps) => ({
    proof: Q.getProof(state, ownProps.trait)
  })
)(Explorer)

class Proof extends React.Component {
  render() {
    const { space, trait } = this.props

    if (trait.deduced) {
      return <ProofExplorer space={space} trait={trait}/>
    } else if (trait.description) {
      return <Markdown text={trait.description}/>
    } else {
      return <p>
        <i>No proof given</i>
      </p>
    }
  }
}

export default Proof
