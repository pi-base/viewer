import * as React from 'react'
import { Link } from 'react-router'
import * as I from 'immutable'

import * as Q from '../../queries'
import * as T from '../../types'

import Implication from '../../containers/Implication'

export interface Props {
  property: T.Property
  theorems: I.List<T.Theorem>
  properties: T.Finder<T.Property>
}

function RelatedTheorems({ property, theorems, properties }: Props) {
  const related = Q.relatedTheorems(theorems, property)

  return (
    <div>
      <h4>Related Theorems</h4>
      {related.map((t: T.Theorem) => (
        <div key={t.uid}>
          <Link to={`/theorems/${t.uid}`}>
            <Implication theorem={t} link={false} />
          </Link>
        </div>
      ))}
    </div>
  )
}

export default RelatedTheorems
