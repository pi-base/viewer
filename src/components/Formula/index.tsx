import * as React from 'react'
import { Link } from 'react-router-dom'

import * as T from '../../types'
import * as F from '../../models/Formula'

export interface Props {
  formula: F.Formula<T.Property>
  link: boolean
  key?: number
}

export function Formula({ formula, link }: Props) {
  switch (formula.kind) {
    case 'atom':
      var label = formula.property.name
      if (formula.value === false) {
        label = '¬' + label
      }
      if (link === false) {
        return <span>{label}</span>
      } else {
        return <Link to={`/properties/${formula.property.uid}`}>{label}</Link>
      }

    default:
      let delimiter = formula.kind === 'and' ? '∧' : '∨'
      return (
        <span>({sepWith(delimiter, link, formula.subs)})</span>
      )
  }
}

function sepWith(delimiter: string, link: boolean, subs: F.Formula<T.Property>[]) {
  let result: JSX.Element[] = []

  subs.forEach((sub, i) => {
    result.push(<Formula key={i} formula={sub!} link={link} />)
    result.push(<span key={'sepWith' + i}> {delimiter} </span>)
  })
  result.pop()

  return result
}

export default Formula
