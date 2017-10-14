import * as React from 'react'
import { connect } from 'react-redux'

import * as Q from '../../queries'
import * as T from '../../types'

import Markdown from '../Markdown'
import ProofExplorer from './Explorer'
import Tex from '../Tex'

export interface Props {
  space: T.Space
  trait: T.Trait
  properties: T.Finder<T.Property>
  proof?: T.Proof
}

function Proof({ space, trait, properties, proof }: Props) {
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

function mapStateToProps(state: T.StoreState, props: Props) {
  return {
    proof: Q.getProof(state, props.trait)
  }
}

export default connect(mapStateToProps)(Proof)
