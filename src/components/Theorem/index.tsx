import * as React from 'react'

import * as I from 'immutable'
import * as Q from '../../queries'
import * as T from '../../types'

import Counterexamples from './Counterexamples'
import Implication from '../Implication'
import Markdown from '../Markdown'
import NotFound from '../NotFound'
import Tex from '../Tex'

interface Props {
  theorems: I.List<T.Theorem>
  spaces: I.List<T.Space>
  properties: T.Finder<T.Property>
  traits: T.TraitTable
  params: { theoremId: string }
}

function Theorem({ theorems, spaces, traits, properties, params: { theoremId } }: Props) {
  const theorem = theorems.find(t => t && t.uid === theoremId || false)
  if (!theorem) { return <NotFound /> }

  return (
    <div>
      <h1>
        <Implication theorem={theorem} properties={properties} link={true} />
      </h1>
      <Tex><Markdown text={theorem.description} /></Tex>
      <hr />

      <div className="row">
        <div className="col-md-6">
          <Counterexamples
            spaces={spaces}
            properties={properties}
            traits={traits}
            theorems={theorems}
            theorem={theorem}
          />
        </div>
        <div className="col-md-6" />
      </div>
    </div>
  )
}

export default Theorem
