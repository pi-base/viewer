import * as React from 'react'

import { Dispatch, Space } from '../../types'

import Form from './Form'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { createSpace } from '../../actions'

type Props = RouteComponentProps<{}>

export default connect(
  null,
  (dispatch: Dispatch, ownProps: Props) => ({
    save: (values: Space) => dispatch(createSpace(values)).
      then(space => ownProps.history.push(`/spaces/${space.uid}`))
  })
)(Form)