import React    from 'react'
import Relay    from 'react-relay'
import { Link } from 'react-router'

import Markdown    from './Markdown'
import Implication from './Implication'
import U           from './U'

class Explorer extends React.Component {
  render() {
    const { space, trait } = this.props

    const proof    = JSON.parse(trait.proof)
    const theorems = proof.theorems.map(t => {
      const h = this.props.universe.hydrateTheorem(t.name)
      h.uid = t.uid
      return h
    })

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
        {theorems.map(t =>
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

const ProofExplorer = U(Explorer)

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

// TODO: this should be a Relay container w/ fragment for
//   description, proof, &c.
export default Proof
