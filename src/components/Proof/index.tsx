import * as React from 'react'

import store from '../../store'

import * as Q from '../../queries'
import * as T from '../../types'

import Markdown from '../Markdown'
import ProofExplorer from './Explorer'
import Tex from '../Tex'

export interface Props {
  space: T.Space
  trait: T.Trait
  // properties: T.Finder<T.Property>
  proof?: T.Proof
}

function Proof({ space, trait, proof }: Props) {
  const properties = store.propertyFinder

  if (proof) {
    return <ProofExplorer space={space} proof={proof} properties={properties} />
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
