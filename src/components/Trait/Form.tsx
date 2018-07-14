import * as React from 'react'

import { Citation, Property, Space, State, Trait } from '../../types'

import Detail from './Detail'
import { connect } from 'react-redux'
import { previewForm } from '../PreviewForm'
import uuid from 'uuid/v4'

type Values = Partial<{
  propertyId: string
  value: string
  description: string
  references: Citation[]
}>
type Errors = Partial<{
  propertyId: string
  description: string
}>

interface StateProps {
  findProperty: (propertyId: string) => Property | undefined
}
interface OwnProps {
  trait?: Trait
  space: Space
}
type Props = StateProps & OwnProps

const Preview = props => {
  return (<Detail {...props} trait={props.preview} />)
}

const run = (values: Values, { trait, space, findProperty }: Props) => {
  const errors: Errors = {}

  if (!values.description) {
    errors.description = 'Required'
  }

  const property = trait ? trait.property : findProperty(values.propertyId || '')
  if (!property) {
    errors.propertyId = 'Required'
    return { result: undefined, errors }
  }

  let result: Trait
  if (trait) {
    result = {
      ...trait,
      description: values.description || '',
      references: values.references || []
    }
  } else {
    result = {
      uid: uuid(),
      space,
      property,
      description: values.description || '',
      references: values.references || [],
      value: values.value! === 'true',
      deduced: false
    }
  }
  return { result, errors }
}

const Form = previewForm<Trait, Values>({
  name: 'trait',
  Preview,
  run
})

const mapStateToProps = (state: State): StateProps => ({
  findProperty: propertyId => state.properties.get(propertyId)
})

export default connect<StateProps, {}, OwnProps, State>(
  mapStateToProps
)(Form)