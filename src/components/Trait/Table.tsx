import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as I from 'immutable'

import * as T from '../../types'

import Icon from '../Icon'
import Tex  from '../Tex'

export interface StoreProps {
  traits: T.TraitTable
}

export interface Props {
  spaces: I.List<T.Space>
  properties: I.List<T.Property>
}

function check(traits: T.TraitTable, space: T.Space, property: T.Property) {
  const val = traits.getIn([space.uid, property.uid]).value
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
      <Icon type={type}/>
    </Link>
  )
}

function TraitTable({ spaces, properties, traits }: Props & StoreProps) {
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
              <td key={p.uid}>{check(traits!, s, p)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function mapStateToProps(state: T.StoreState): StoreProps {
  return {
    traits: state.traits
  }
}

export default connect<StoreProps, {}, Props>(mapStateToProps)(TraitTable)
