import * as React from 'react'

import { Dispatch, State, Theorem } from '../../types'
import { assertTheorem, checkProofs } from '../../actions'

import { Fields as EditFields } from './Edit'
import { Field } from 'redux-form'
import { Formula } from '../Form/Labeled'
import { RouteComponentProps } from 'react-router'
import TheoremForm from './Form'
import { connect } from 'react-redux'

export const Fields = _ => (
  <>
    <Field
      name="if"
      label="If"
      placeholder="compact + t_2"
      component={Formula}
    />
    <Field
      name="then"
      label="Then"
      placeholder="t_4"
      component={Formula}
    />
    <EditFields />
  </>
)

interface DispatchProps {
  save: (result: Theorem) => void
}
type OwnProps = RouteComponentProps<{}>

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps): DispatchProps => ({
  save: result => {
    dispatch(assertTheorem(result)).then(theorem => {
      ownProps.history.push(`/theorems/${theorem.uid}`)
      dispatch(checkProofs())
    })
  }
})

export default connect<{}, DispatchProps, {}, State>(
  null,
  mapDispatchToProps
)(props => <TheoremForm {...props} Fields={Fields} />)