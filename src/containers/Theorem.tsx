import * as React from 'react'

import * as I from 'immutable'
import * as F from '../models/Formula'
import * as Q from '../queries'
import * as T from '../types'

import { view } from '../graph'

import Counterexamples from '../containers/Theorem/Counterexamples'
import Implication from '../containers/Implication'
import Markdown from '../components/Markdown'
import NotFound from '../components/NotFound'
import Tex from '../components/Tex'

const Theorem = props => {
  const theorem = props.viewer.theorems.find(t =>
    t.uid === props.params.id
  )
  if (!theorem) { return <NotFound {...props} /> }

  const parsed = {
    uid: theorem.uid,
    if: F.fromJSON(JSON.parse(theorem.if)),
    then: F.fromJSON(JSON.parse(theorem.then)),
    // FIXME:
    converse: undefined,
    description: ''
  }

  return (
    <div>
      <h1>
        <Implication theorem={parsed} link={true} />
      </h1>
      <Tex><Markdown text={theorem.description} /></Tex>
      <hr />

      <div className="row">
        <div className="col-md-6">
          <Counterexamples theorem={parsed} />
        </div>
        <div className="col-md-6" />
      </div>
    </div>
  )
}

// FIXME: this forces a full load of all theorems
export default view(`
  theorems {
    uid
    if
    then
    description
  }
`)(Theorem)
