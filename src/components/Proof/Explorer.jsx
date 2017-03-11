import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import Implication from '../Implication'
import Tex from '../Tex'

class Explorer extends React.Component {
  render() {
    const { space, proof } = this.props

    // TODO: log error if this happens
    if (!proof) { return null }

    return (
      <div className="proofExplorer">
        <p>Automatically deduced from the following properties</p>
        <ul>
          {proof.get('traits').map(t =>
            <li key={'prop' + t.getIn(['property', 'uid'])}>
              <Link to={`/spaces/${space.get('uid')}/properties/${t.getIn(['property', 'uid'])}`}>
                {t.get('value') ? '' : '¬'}
                <Tex>{t.getIn(['property', 'name'])}</Tex>
              </Link>
            </li>
          )}
        </ul>

        <p>and theorems</p>
        <ul>
          {proof.get('theorems').map(t =>
            <li key={'implication' + t.get('uid')}>
              <Link to={`/theorems/${t.get('uid')}`}>
                <Implication theorem={t} link={false}/>
              </Link>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

Explorer.propTypes = {
  space: PropTypes.object.isRequired,
  trait: PropTypes.object.isRequired,
  proof: PropTypes.object.isRequired
}

export default Explorer
