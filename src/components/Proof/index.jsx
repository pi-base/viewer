import React, { PropTypes } from 'react'
import * as I from 'immutable'

import Markdown      from '../Markdown'
import ProofExplorer from './Explorer'

class Proof extends React.Component {
  render() {
    const { space, trait } = this.props

    if (trait.get('deduced')) {
      return <ProofExplorer space={space} trait={trait}/>
    } else if (trait.get('description')) {
      return <Markdown text={trait.get('description')}/>
    } else {
      return <p>
        <i>No proof given</i>
      </p>
    }
  }
}

Proof.propTypes = {
  space: PropTypes.instanceOf(I.Map),
  trait: PropTypes.instanceOf(I.Map)
}

export default Proof
