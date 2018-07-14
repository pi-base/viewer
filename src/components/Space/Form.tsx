import * as React from 'react'

import { Citation, Space } from '../../types'
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
  space?: Space
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

const run = (values: Values, { space }: Props) => {
  const errors: Errors = {}
  if (!values.name) { errors.name = 'Required' }

  let result: Space | undefined
  if (space) {
    result = {
      ...space,
      ...values,
      references: values.references || []
    }
  } else {
    result = {
      uid: uuid(),
      ...values,
      references: values.references || []
    }
  }

  return { result, errors }
}

const Preview = props => <Detail {...props} space={props.preview} />

const Form = previewForm<Space, Values>({ name: 'space', Preview, run })

export default props => <Form {...props} Fields={Fields} />