import * as React from 'react'

import Detail from './Detail'
import { Property } from '../../types'
import RelatedTheorems from './RelatedTheorems'

interface Props {
  property: Property
}

const Show: React.SFC<Props> = ({ property }) => (
  <article>
    <Detail property={property} />

    <div className="row">
      <div className="col-md-6">
        <RelatedTheorems property={property} />
      </div>
      <div className="col-md-6" />
    </div>
  </article>
)

export default Show