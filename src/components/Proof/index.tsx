import * as React from 'react'

import * as Q from '../../queries'
import * as T from '../../types'

import Markdown from '../Markdown'
import ProofExplorer from './Explorer'
import Tex from '../Tex'

export interface Props {
  space: T.Space
  trait: T.Trait
  proof?: T.Proof
}

function Proof({ space, trait, proof }: Props) {
  if (proof) {
    return <ProofExplorer space={space} proof={proof} />
  } else if (trait.description) {
    return <Tex><Markdown text={trait.description} /></Tex>
  } else {
    return (
      <p>
        <i>No proof given</i>
      </p>
    )
  }
}

export default Proof
