import * as React from 'react'

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

const Labeled = ({
  input,
  Component,
  label,
  placeholder,
  children,
  meta: { touched, error }
}: Props) => (
    <div className="form-group">
      <label htmlFor={input.name}>{label}</label>
      <div>
        <Component
          {...input}
          placeholder={placeholder || label}
          className="form-control"
          children={children}
        />
        {touched && error
          ? <span>{error}</span>
          : ''}
      </div>
    </div>
  )

export default Labeled