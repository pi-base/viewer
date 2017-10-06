import * as React from 'react'
import { Link } from 'react-router'

import * as T from '../../types'

import Icon from '../Icon'

interface Props {
  trait: T.Trait
}

function TraitItem({ trait }: Props) {
  return (
    <tr>
      <td>
        <Icon type={trait.value ? 'ok' : 'remove'}/>
      </td>
      <td>
        <Link to={`/spaces/${trait.space.uid}/properties/${trait.property.uid}`}>
          {trait.property.name}
        </Link>
      </td>
    </tr>
  )
}

export default TraitItem
