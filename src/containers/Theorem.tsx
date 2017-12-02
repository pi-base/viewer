import * as React from 'react'

import * as I from 'immutable'
import * as F from '../models/Formula'
import * as Q from '../queries'
import store from '../store'
import * as T from '../types'

import { view } from '../graph'

import Counterexamples from '../containers/Theorem/Counterexamples'
import Detail from '../components/Theorem/Detail'
import NotFound from '../components/NotFound'
import Tex from '../components/Tex'

interface Props {
  params: {
    id: string
  }
}

const Theorem = (props: Props & T.RouterProps) => {
  const theorem = store.theorems.find(props.params.id)
  if (!theorem) { return <NotFound {...props} /> }

  return (
    <div>
      <Detail theorem={theorem} />
      <hr />

      <div className="row">
        <div className="col-md-6">
          <Counterexamples theorem={theorem} />
        </div>
        <div className="col-md-6" />
      </div>
    </div>
  )
}

export default Theorem
