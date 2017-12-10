import * as React from 'react'

export default function Debug(props: any) {
  const pibase = {
    error() {
      return ('' as any).floop('')
    },
    store: props.store
  }

  if (process.env.NODE_ENV === 'development') {
    Object.assign(window, pibase)
  } else {
    (window as any)._pi_base = pibase
  }

  return (<div />)
}
