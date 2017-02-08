import React from 'react'
import { Link } from 'react-router'

import Icon from '../Icon'

const TraitItem = ({ space, property, trait }) => {
  // FIXME
  if (!space || !property || !trait) { return null }

  return (
    <tr>
      <td>
        <Icon type={trait.value ? 'ok' : 'remove'}></Icon>
      </td>
      <td>
        <Link to={`/spaces/${space.name}/properties/${property.name}`}>
          {property.name}
        </Link>
      </td>
    </tr>
  )
}

export default TraitItem
