import * as React from 'react'
import { Link } from 'react-router'
import * as I from 'immutable'

import { mobxStore } from '../../store'
import * as T from '../../types'

import Icon from '../Icon'
import Tex from '../Tex'

export interface Props {
  spaces: I.List<T.Space>
  properties: I.List<T.Property>
  // traits: T.TraitTable
}

function check(space: T.Space, property: T.Property) {
  const val = mobxStore.traits.check(space.uid, property.uid)
  let type
  if (val === true) {
    type = 'ok'
  } else if (val === false) {
    type = 'remove'
  } else {
    type = 'question-sign'
  }

  return (
    <Link to={`/spaces/${space.uid}/properties/${property.uid}`}>
      <Icon type={type} />
    </Link>
  )
}

function TraitTable({ spaces, properties }: Props) {
  return (
    <table className="table table-condensed table-striped table-hover">
      <thead>
        <tr>
          <th>Space</th>
          {properties.map((p: T.Property) => (
            <th key={p.uid}>
              <Link to={`/properties/${p.uid}`}>
                <Tex>{p.name}</Tex>
              </Link>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {spaces.map((s: T.Space) => (
          <tr key={s.uid}>
            <td>
              <Link to={`/spaces/${s.uid}`}>
                <Tex>{s.name}</Tex>
              </Link>
            </td>
            {properties.map((p: T.Property) => (
              <td key={p.uid}>{check(s, p)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TraitTable
