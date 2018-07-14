import * as React from 'react'

import Detail from '../Shared/Detail'
import Implication from '../Implication'
import { Theorem } from '../../types'

type Props = { theorem: Theorem }

const TheoremDetail: React.SFC<Props> = ({ theorem, ...props }) => (
  <Detail<Theorem> {...props} object={theorem}>
    {theorem.if && theorem.then && <Implication theorem={theorem} link={true} />}
  </Detail>
)

export default TheoremDetail