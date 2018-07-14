import * as React from 'react'

import { Dispatch, Property } from '../../types'

import Form from './Form'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { updateProperty } from '../../actions'

type OwnProps = {
  property: Property
}
type Props = OwnProps & RouteComponentProps<{}>

export default connect(
  null,
  (dispatch: Dispatch, ownProps: Props) => ({
    // FIXME: typecheck against e.g. `updateSpace(values)`
    save: values => dispatch(updateProperty(values)).
      then(_ => ownProps.history.push(`/properties/${ownProps.property.uid}`))
  })
)(Form)