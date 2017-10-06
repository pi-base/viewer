import * as React from 'react'
import * as I from 'immutable'

export interface Props {
  aliases: I.List<string>
}

function Aliases({ aliases }: Props) {
  if (!aliases) { return null }

  return <small> or {aliases.join(', ')}</small>
}

export default Aliases
