import * as React from 'react'

import FormulaInput from '../Formula/Input'

export interface Props {
  input: { name: string }
  Component: React.ComponentClass<{ placeholder: string, className: string }> | string
  label: string
  placeholder?: string
  // tslint:disable-next-line no-any
  children: any
  meta: {
    touched: boolean
    error: boolean
  }
}

export const Wrapped = props => {
  const Component = props.component
  return (
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}</label>
      <div>
        <Component
          {...props}
          className="form-control"
        />
      </div>
    </div>
  )
}

const Labeled = ({
  input,
  Component,
  label,
  placeholder,
  children,
  meta: { touched, error }
}: Props) => (
    <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
      <label htmlFor={input.name}>{label}</label>
      <div>
        <Component
          {...input}
          placeholder={placeholder || label}
          className="form-control"
          children={children}
        />
        {touched && error
          ? <span className="help-block">{error}</span>
          : ''}
      </div>
    </div>
  )

export default Labeled

export const Formula = props => <Labeled {...props} Component={FormulaInput} />
export const Text = props => <Labeled {...props} Component="input" type="text" />
export const Textarea = props => <Labeled {...props} Component="textarea" />