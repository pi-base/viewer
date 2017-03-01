import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import * as I from 'immutable'

import Icon from '../Icon'

const TraitItem = ({ space, property, trait }) => {
  return (
    <tr>
      <td>
        <Icon type={trait.get('value') ? 'ok' : 'remove'}></Icon>
      </td>
      <td>
        <Link to={`/spaces/${space.get('uid')}/properties/${property.get('uid')}`}>
          {property.get('name')}
        </Link>
      </td>
    </tr>
  )
}

TraitItem.propTypes = {
  space: PropTypes.instanceOf(I.Map),
  property: PropTypes.instanceOf(I.Map),
  trait: PropTypes.instanceOf(I.Map)
}

export default TraitItem
