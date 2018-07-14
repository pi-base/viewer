import * as React from 'react'
import * as T from '../../types'

import Counterexamples from './Counterexamples'
import Detail from './Detail'
import References from '../References'
import { RouteComponentProps } from 'react-router'

type StateProps = {
  theorem: T.Theorem
}
type Props = StateProps & RouteComponentProps<{ id: string }>

const Theorem: React.SFC<Props> = props => (
  <div>
    <Detail {...props} />

    <hr />

    <div className="row">
      <div className="col-md-6">
        <Counterexamples theorem={props.theorem} />
      </div>
      <div className="col-md-6" />
    </div>
  </div>
)

export default Theorem
