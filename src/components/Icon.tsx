import * as React from 'react'

export interface Props {
  type: string
}

const Icon = ({ type }: Props) => {
  return (
    <span className={`glyphicon glyphicon-${type}`}/>
  )
}

export default Icon
