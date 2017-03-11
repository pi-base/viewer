import React, { PropTypes } from 'react'
import * as I from 'immutable'

import Formula from './Formula'
import Tex     from './Tex'

class Implication extends React.Component {
  render() {
    const { theorem, link } = this.props

    return (
      <Tex component="span">
        <Formula formula={theorem.get('if')} link={link}/>
        {' ⇒ '}
        <Formula formula={theorem.get('then')} link={link}/>
      </Tex>
    )
  }
}

Implication.propTypes = {
  theorem: PropTypes.instanceOf(I.Map),
  link:    PropTypes.bool
}

export default Implication
