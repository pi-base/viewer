import React from 'react'

import { Property, Store, Theorem } from '../../models'
import Inline from '../Shared/Inline'
import Link from '../Shared/Link'
import Space from '../Spaces/Link'
import Name from '../Theorems/Name'
import { TaggedRef } from '@pi-base/core/lib/Ref'
import * as Id from './Id'

interface Props {
  id: string
  name?: string
}

function DOI({ id, name }: Props) {
  return <a href={`https://doi.org/${id}`}>{name || `DOI ${id}`}</a>
}

function MR({ id, name }: Props) {
  return (
    <a href={`https://mathscinet.ams.org/mathscinet-getitem?mr=${id}`}>
      {name || `MR ${id}`}
    </a>
  )
}

function Wiki({ id, name }: Props) {
  return (
    <a href={`https://en.wikipedia.org/wiki/${id}`}>
      {name || `Wikipedia ${id}`}
    </a>
  )
}

function MathSE({ id, name }: Props) {
  return (
    <a href={`https://math.stackexchange.com/questions/${id}`}>
      {name || `Math StackExchange ${id}`}
    </a>
  )
}

function MO({ id, name }: Props) {
  return (
    <a href={`https://mathoverflow.net/questions/${id}`}>
      {name || `MathOverflow ${id}`}
    </a>
  )
}

export function Reference({ reference }: { reference: TaggedRef }) {
  // TODO: why aren't typechecks catching this?
  if (!reference) {
    return null
  }

  const { kind, id, name } = reference
  switch (kind) {
    case 'doi':
      return <DOI id={id} name={name} />
    case 'mr':
      return <MR id={id} name={name} />
    case 'wikipedia':
      return <Wiki id={id} name={name} />
    case 'mathse':
      return <MathSE id={id} name={name} />
    case 'mo':
      return <MO id={id} name={name} />
    default:
      return (
        <span>
          `${kind} ${id} ${name}
        </span>
      )
  }
}

export default function Citation({ citation }: { citation: string }) {
  const [kind, id] = citation.split(':', 2)
  if (!kind || !id) {
    return null
  }

  const ref = { kind, id } as TaggedRef
  return <Reference reference={ref} />
}

function InternalLinkError({ to }: { to: string }) {
  return (
    <>
      Parse error:
      <code>{` {${to}}`}</code>
    </>
  )
}

export function InternalLink({ to }: { to: string }) {
  const tagged = Id.tag(to)
  if (!tagged) {
    return <InternalLinkError to={to} />
  }

  switch (tagged.kind) {
    case 'space':
      return <Space id={tagged.id} />
    case 'property':
      return (
        <Link<Property>
          id={tagged.id}
          find={Store.property}
          path={(uid: string) => `/properties/${uid}`}
          contents={(property: Property) => <Inline body={property.name} />}
          kind="Property"
        />
      )
    case 'theorem':
      return (
        <Link<Theorem>
          id={tagged.id}
          find={Store.theorem}
          path={(uid: string) => `/theorems/${uid}`}
          contents={(theorem: Theorem) => (
            <Name theorem={theorem} link="none" />
          )}
          kind="Theorem"
        />
      )
    default:
      return null
  }
}
