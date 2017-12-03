import * as React from 'react'

interface Props {
  input: any
  Component: any
  label: string
  placeholder?: string
  meta: {
    touched: boolean
    error: boolean
  }
}

const Labeled = ({
  input,
  Component,
  label,
  placeholder,
  meta: { touched, error }
}: Props) => (
    <div className="form-group">
      <label htmlFor={input.name}>{label}</label>
      <div>
        <Component
          {...input}
          placeholder={placeholder || label}
          className="form-control"
        />
        {touched && error
          ? <span>{error}</span>
          : ''}
      </div>
    </div>
  )

export default Labeled