import * as React from 'react'
import { Link } from 'react-router-dom'
import * as I from 'immutable'

import store from '../../store'
import * as T from '../../types'

import Implication from '../../containers/Implication'
import Tex from '../Tex'

export interface Props {
  space: T.Space
  proof: T.Proof
}

function Explorer({ space, proof }: Props) {
  return (
    <div className="proofExplorer">
      <p>Automatically deduced from the following properties</p>
      <ul>
        {proof.traits.map((t: T.Trait) => (
          <li key={`prop${t.property.uid}`}>
            <Link to={`/spaces/${space.uid}/properties/${t.property.uid}`}>
              {t.value ? '' : '¬'}
              <Tex component="span">{t.property.name}</Tex>
            </Link>
          </li>
        ))}
      </ul>

      <p>and theorems</p>
      <ul>
        {proof.theorems.map((t: T.Theorem) => (
          <li key={`implication${t.uid}`}>
            <Link to={`/theorems/${t.uid}`}>
              <Implication theorem={t} link={false} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Explorer
