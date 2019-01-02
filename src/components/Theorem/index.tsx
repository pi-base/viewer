import * as React from 'react'

import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'

import Edit from './Edit'
import NotFound from '../NotFound'
import Show from './Show'
import { State } from '../../reducers'
import { Theorem } from '../../types'
import { connect } from 'react-redux'

type StateProps = {
  theorem: Theorem | undefined
}
type Props = StateProps & RouteComponentProps<{ id: string }>

const Theorem: React.SFC<Props> = props => {
  const { theorem } = props

  if (!theorem) { return <NotFound {...props} /> }

  return (
    <div>
      <Switch>
        <Route path={props.match.url + '/edit'} render={ps => <Edit {...ps} theorem={theorem} />} />
        <Route path={props.match.url} render={ps => <Show {...ps} theorem={theorem} />} />
      </Switch>
    </div>
  )
}

const mapStateToProps = (state: State, props: Props) => ({
  theorem: state.theorems.get(props.match.params.id)
})

export default connect<StateProps, {}, Props>(mapStateToProps)(Theorem)