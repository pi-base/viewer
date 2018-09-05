import * as React from 'react'

export interface Props {
  aliases: string[]
}

function Aliases({ aliases }: Props) {
  if (!aliases || aliases.length === 0) { return null }

  return <small> or {aliases.join(', ')}</small>
}

export default Aliases
