import * as React from 'react'
import * as I from 'immutable'

import * as T from '../../types'

export interface Props {
  suggestions: I.List<T.Property>
  limit: number
  selected: number
  visible: boolean
  onSelect: (selected: number) => void
}

function Suggestions({ suggestions, selected, visible, limit, onSelect }: Props) {
  const divStyle = {
    display: (visible ? 'block' : 'none'),
    marginTop: '5px'
  }

  return (
    <div className="list-group" style={divStyle}>
      {suggestions.take(limit).map((p, i) => (
        <a
          className={'list-group-item ' + (selected === i ? 'active' : '')}
          key={p!.uid}
          onMouseDown={() => onSelect(i!)}
          href="#"
        >
          {p!.name}
        </a>
      ))}
    </div>
  )
}

export default Suggestions
