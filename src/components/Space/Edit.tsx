import * as React from 'react'

import { Dispatch, Space } from '../../types'

import Form from './Form'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { updateSpace } from '../../actions'

type OwnProps = {
  space: Space
}
type Props = OwnProps & RouteComponentProps<{}>

export default connect(
  null,
  (dispatch: Dispatch, ownProps: Props) => ({
    save: values => dispatch(updateSpace(values)).
      then(_ => ownProps.history.push(`/spaces/${ownProps.space.uid}`))
  })
)(Form)