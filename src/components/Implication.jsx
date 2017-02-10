import React from 'react'

import Formula from './Formula'
import Tex     from './Tex'

class Implication extends React.Component {
  render() {
    const { theorem, link } = this.props

    return <Tex component="span">
      <Formula formula={theorem.antecedent} link={link}/>
      {' ⇒ '}
      <Formula formula={theorem.consequent} link={link}/>
    </Tex>
  }
}

export default Implication
