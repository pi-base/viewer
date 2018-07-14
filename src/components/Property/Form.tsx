import * as React from 'react'

import { Citation, Property } from '../../types'
import { Field, FieldArray } from 'redux-form'
import { Text, Textarea } from '../Form/Labeled'

import Citations from '../Form/Citations'
import Detail from './Detail'
import { previewForm } from '../PreviewForm'
import uuid from 'uuid/v4'

type Values = {
  name: string
  description: string
  references: Citation[]
}
type Errors = {
  name?: string
}
interface Props {
  property: Property
}

const Fields = _ => (
  <>
    <Field
      name="name"
      label="Name"
      component={Text}
    />
    <Field
      name="description"
      label="Description"
      component={Textarea}
    />
    <FieldArray name="references" component={Citations} />
  </>
)

const run = (values: Values, { property }: Props) => {
  const errors: Errors = {}
  if (!values.name) { errors.name = 'Required' }

  let result: Property | undefined
  if (property) {
    result = { ...property, ...values }
  } else {
    result = {
      uid: uuid(),
      ...values,
      references: values.references || []
    }
  }

  return { result, errors }
}

const Preview = props => <Detail {...props} property={props.preview} />

const Form = previewForm<Property, Values>({ name: 'property', Preview, run })

export default props => <Form {...props} Fields={Fields} />