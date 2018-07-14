import * as React from 'react'
import * as S from '../../selectors'

import { Citation, Formula, Id, Property, Space, State, Theorem } from '../../types'

import Detail from './Detail'
import { RouteComponentProps } from 'react-router';
import TraitTable from '../Trait/Table'
import { connect } from 'react-redux'
import { previewForm } from '../PreviewForm'
import uuid from 'uuid/v4'

type Values = {
  if?: string
  then?: string
  description: string
  references: Citation[]
}
type Errors = Partial<{
  if: string
  then: string
  description: string
}>

interface StateProps {
  parseFormula: (formula: string) => Formula<Id> | undefined
  counterexamples: (theorem: Theorem) => Space[]
  theoremProperties: (theorem: Theorem) => Property[]
}
interface OwnProps {
  theorem?: Theorem
  Fields: React.ComponentType<{}>
}
type Props = StateProps & OwnProps & RouteComponentProps<{}>

const run = (values: Values, { theorem, counterexamples, parseFormula }: Props) => {
  let result: Theorem | undefined
  const patch = {
    description: values.description || '',
    references: values.references || []
  }
  const errors: Errors = {}
  if (theorem) {
    result = { ...theorem, ...patch }
  } else {
    if (!values.if) { errors.if = 'Required' }
    if (!values.then) { errors.then = 'Required' }
    if (!values.if || !values.then) { return { errors } }

    const antecedent = parseFormula(values.if)
    if (!antecedent) {
      errors.if = 'Could not be parsed'
      return { result, errors }
    }
    const consequent = parseFormula(values.then)
    if (!consequent) {
      errors.then = 'Could not be parsed'
      return { result, errors }
    }

    if (Object.keys(errors).length > 0) { return { result, errors } }

    result = {
      uid: uuid(),
      if: antecedent!,
      then: consequent!,
      ...patch
    }
  }

  const cxs = counterexamples(result)
  if (cxs.length > 0) {
    errors.then = 'Has counterexamples'
  }

  return { result, errors }
}

const Preview = props => {
  const { preview: theorem } = props
  const properties = props.theoremProperties(theorem)
  const cxs = props.counterexamples(theorem) || []
  return (
    <article>
      <Detail {...props} theorem={theorem} />
      <hr />
      {cxs.length > 0
        ?
        <div>
          <p>Found counterexamples:</p>
          <TraitTable spaces={cxs} properties={properties} />
        </div>
        : <p>No couterexamples found</p>
      }
    </article>
  )
}

const TheoremForm = previewForm<Theorem, Values>({ name: 'theorem', Preview, run })

const mapStateToProps = (state: State) => ({
  parseFormula: f => S.parseFormula(state, f),
  counterexamples: t => S.counterexamples(state, t),
  theoremProperties: t => S.theoremProperties(state, t)
})

export default connect<StateProps, {}, OwnProps, State>(
  mapStateToProps
)(TheoremForm)