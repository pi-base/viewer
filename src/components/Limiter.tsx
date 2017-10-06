import * as React from 'react'

import Icon from './Icon'

export interface Props {
  limit: number
  found: number
  total: number
  onClick: () => void
}

function Limiter({ limit, found, total, onClick }: Props) {
  let icon, text

  if (limit && total > limit) {
    icon = 'chevron-down'
    text = `Show All ${total}`
  } else if (found > limit) {
    icon = 'chevron-up'
    text = 'Collapse'
  } else {
    return <span/>
  }

  return (
    <div className="limiter">
      <button
        className="btn btn-default btn-sm pull-right"
        onClick={onClick}
      >
        <Icon type={icon}/>
        {' ' + text}
      </button>
    </div>
  )
}

export default Limiter
