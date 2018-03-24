import * as React from 'react'

import { Citation } from '../types'

type Props = {
  references: Citation[]
}

const Reference = ({ reference }: { reference: Citation }) => {
  let url
  switch (reference.type) {
    case 'doi':
      return <span>DOI <code>{reference.ref}</code></span>
    case 'mr':
      const code = reference.ref.replace('MR', '')
      url = `https://mathscinet.ams.org/mathscinet-getitem?mr=${code}`
      return <a href={url} target="_blank">{reference.name}</a>
    default:
      url = `https://en.wikipedia.org/wiki/${reference.ref}`
      return <a href={url} target="_blank">{reference.name}</a>
  }
}

const References = ({ references }: Props) => {
  if (references.length === 0) { return null }

  return (
    <div>
      <h3>References</h3>
      <ul>
        {references.map(c =>
          <li key={c.ref}><Reference reference={c} /></li>
        )}
      </ul>
    </div>
  )
}

export default References