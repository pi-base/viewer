import * as React from 'react'

import { Dispatch, State } from '../types'
import { FormErrors, InjectedFormProps, reduxForm } from 'redux-form'

import { compose } from 'redux'
import { connect } from 'react-redux'

const none = (errors) => !errors || Object.keys(errors).length === 0

interface PreviewComponentProps<R> {
  preview: R
  showEditLink: boolean
}

type PreviewResult<R, V> = Partial<{
  result: R
  errors: FormErrors<V, R>
}>

interface PreviewFormArgs<R, V, P> {
  name: string
  Preview: React.ComponentType<PreviewComponentProps<R>>
  run: (values: V, props: P) => PreviewResult<R, V>
}

export const previewForm = <R, V, P = {}>({ name, Preview, run }: PreviewFormArgs<R, V, P>) => {
  type PreviewFormComponentProps = {
    preview: R | undefined
    Fields: React.ComponentType<{}>
    save: (result: R) => void
  } & InjectedFormProps

  class Wrapped extends React.Component<PreviewFormComponentProps> {
    render() {
      const { preview, Fields, save, ...props } = this.props

      return (
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={this.props.handleSubmit}>
              <Fields {...props} />
              <button className="btn btn-default" type="submit" disabled={!this.props.valid || this.props.submitting}>
                Save
              </button>
            </form>
          </div>
          <div className="col-md-6">
            {preview && <Preview {...props} preview={preview} showEditLink={false} />}
          </div>
        </div>
      )
    }
  }

  let _preview: R | undefined

  const _run = (values: V | undefined, props: P) => {
    if (!values) { return { result: undefined, errors: undefined } }
    return run(values, props)
  }

  const validate = (values: V, props: P) => {
    if (!values) { return {} }
    const { errors } = _run(values, props)
    // We're not enforcing that each error corresponds to a key in formdata 
    // (e.g. `counterexamples` in theorem#create)
    return (errors ? errors : {}) as FormErrors<V>
  }

  const onSubmit = (values: V, _: Dispatch, props) => {
    const { result, errors } = _run(values, props)
    if (result && none(errors)) {
      props.save(result)
    }
  }

  const mapStateToProps = (state: State, ownProps: P) => {
    const form = state.form[name]
    const values = form ? form.values as V : undefined
    const { result, errors } = _run(values, ownProps)
    if (result) { _preview = result }
    return {
      preview: _preview,
      errors,
      initialValues: ownProps[name]
    }
  }

  interface StateProps {
    preview: R | undefined
  }

  return compose(
    connect<StateProps, {}, P, State>(mapStateToProps),
    reduxForm<V, P>({ form: name, validate, onSubmit, enableReinitialize: true })
  )(Wrapped)
}