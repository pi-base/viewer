import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { State } from '../reducers'
import * as T from '../types'

import Counterexamples from '../containers/Theorem/Counterexamples'
import Detail from '../components/Theorem/Detail'
import NotFound from '../components/NotFound'
import Tex from '../components/Tex'

type StateProps = {
  theorem: T.Theorem
}
type RouteProps = RouteComponentProps<{ id: string }>
type Props = StateProps & RouteProps

const Theorem = ({ theorem }: Props) => {
  if (!theorem) { return <NotFound /> }

  return (
    <div>
      <Detail theorem={theorem} />
      <hr />

      <div className="row">
        <div className="col-md-6">
          <Counterexamples theorem={theorem} />
        </div>
        <div className="col-md-6" />
      </div>
    </div>
  )
}

export default connect(
  (state: State, ownProps: Props) => ({
    theorem: state.theorems.get(ownProps.match.params.id)
  })
)(Theorem)
