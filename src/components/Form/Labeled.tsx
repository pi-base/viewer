import * as React from 'react'

interface Props {
  input: { name: string }
  Component: React.ComponentClass<{ placeholder: string, className: string }>
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