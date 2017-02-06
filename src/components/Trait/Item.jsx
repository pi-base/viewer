import React from 'react'
import { Link } from 'react-router'

import Icon from '../Icon'

const TraitItem = ({ space, property, value }) => {
  // FIXME
  if (!space || !property || !value) { return null }

  return (
    <li>
      <Icon type={value === 'True' ? 'ok' : 'remove'}></Icon>
      <Link to={`/spaces/${space.name}/properties/${property.name}`}>
        {property.name}
      </Link>
    </li>
  )
}

export default TraitItem
