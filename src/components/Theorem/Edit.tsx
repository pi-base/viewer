import * as React from 'react'

import { Field, FieldArray } from 'redux-form'
import { State, Theorem } from '../../types'
import { checkProofs, updateTheorem } from '../../actions'

import Citations from '../Form/Citations'
import { Textarea } from '../Form/Labeled'
import TheoremForm from './Form'
import { connect } from 'react-redux'

interface DispatchProps {

}
interface OwnProps {
  theorem: Theorem
}

export const Fields = _ => (
  <>
    <Field
      name="description"
      label="Description"
      component={Textarea}
    />
    <FieldArray name="references" component={Citations} />
  </>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  save: result => {
    dispatch(updateTheorem(result)).then(theorem => {
      ownProps.history.push(`/theorems/${theorem.uid}`)
      dispatch(checkProofs()) // TODO: only for this theorem
    })
  }
})

export default connect<{}, DispatchProps, OwnProps, State>(
  null,
  mapDispatchToProps
)(props => <TheoremForm {...props} Fields={Fields} />)
