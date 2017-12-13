import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import * as Table from '../../models/Table'
import { Id, Space, Property, State } from '../../types'

import Icon from '../Icon'
import Tex from '../Tex'

type OwnProps = {
  spaces: Space[]
  properties: Property[]
}
type StateProps = {
  traits: Table.Table<Id, Id, boolean>
}
type Props = OwnProps & StateProps

function check(space: Space, property: Property, traits: Table.Table<Id, Id, boolean>) {
  const val = Table.get(traits, space.uid, property.uid)
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

function TraitTable({ spaces, properties, traits }: Props) {
  return (
    <table className="table table-condensed table-striped table-hover">
      <thead>
        <tr>
          <th>
            Space
          </th>
          {properties.map(p => (
            <th key={p.uid}>
              <Link to={`/properties/${p.uid}`}>
                <Tex>{p.name}</Tex>
              </Link>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {spaces.map(s => (
          <tr key={s.uid}>
            <td>
              <Link to={`/spaces/${s.uid}`}>
                <Tex>{s.name}</Tex>
              </Link>
            </td>
            {properties.map(p => (
              <td key={p.uid}>{check(s, p, traits)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default connect<StateProps, {}, OwnProps>(
  (state: State) => ({
    traits: state.traits
  })
)(TraitTable)
