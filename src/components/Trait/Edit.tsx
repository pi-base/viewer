import * as React from 'react'

import { Dispatch, Property, Space, State, Trait } from '../../types'
import { Field, FieldArray } from 'redux-form'
import { checkProofs, updateTrait } from '../../actions'

import Citations from '../Form/Citations'
import { RouteComponentProps } from 'react-router'
import { Textarea } from '../Form/Labeled'
import TraitForm from './Form'
import { connect } from 'react-redux'
import { getTrait } from '../../selectors'

interface StateProps {
  trait: Trait
}
interface DispatchProps {
  save: (trait: Trait) => void
}
type OwnProps = {
  space: Space
} & RouteComponentProps<{ propertyId: string }>

export const Fields = _ => (
  <>
    <Field name="description" label="Description" component={Textarea} />
    <FieldArray name="references" component={Citations} />
  </>
)

const mapStateToProps = (state: State, props: OwnProps): StateProps => ({
  trait: getTrait(state, props.space, props.match.params.propertyId)! // FIXME: handle NotFound
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps): DispatchProps => ({
  save: result => {
    dispatch(updateTrait(result)).then(trait => {
      ownProps.history.push(`/spaces/${trait.space.uid}/properties/${trait.property.uid}`)
      dispatch(checkProofs()) // TODO: only for this trait
    })
  }
})

const Edit = props => <TraitForm {...props} Fields={Fields} />

export default connect<StateProps, DispatchProps, OwnProps, State>(
  mapStateToProps,
  mapDispatchToProps
)(Edit)