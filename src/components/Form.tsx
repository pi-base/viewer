import * as React from 'react'
import { connect } from 'react-redux'
import { formValueSelector, reduxForm } from 'redux-form'

import { Dispatch, State } from '../types'

const none = (errors) => !errors || Object.keys(errors).length === 0

// tslint:disable no-any
type Options<Result, Values> = {
  build: (state: State, values: Values) => { result?: Result, errors?: any }
  initial?: (state: State) => Values
  name: string
  fields: string[]
  save: (dispatch: Dispatch, ownProps: any, result: Result) => void
}
// tslint:enable no-any

function form<Result, Values>(options: Options<Result, Values>) {
  const selector = formValueSelector(options.name)

  const validate = (values, props) => {
    const { result, errors } = props.build(values)
    if (!none(errors)) { return errors }
  }

  return component => connect(
    (state: State) => ({
      initialValues: options.initial ? options.initial(state) : {},
      build: (values) => options.build(state, values),
      getResult: () => options.build(
        state,
        selector(state, ...options.fields)
      ).result
    })
  )(
    reduxForm({
      form: options.name,
      validate,
      // tslint:disable-next-line no-any
      onSubmit: (values: Values, dispatch: Dispatch, props: any) => {
        const { result, errors } = props.build(values)
        if (result && none(errors)) {
          options.save(dispatch, props, result)
        }
      }
    })
      (component))
}

export default form