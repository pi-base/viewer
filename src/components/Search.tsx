import * as React from 'react'
import qs from 'query-string'

import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import * as A from '../actions'
import * as S from '../selectors'
import { Dispatch, Formula, Property, State, SearchModifier } from '../types'

import EditLink from './Form/EditLink'
import { Wrapped } from './Form/Labeled'
import FormulaInput from './Formula/Input'
import Results from './Search/Results'

type StateProps = {
  text: string
  formula: string
  modifier: SearchModifier
  parsedFormula: Formula<Property> | undefined
}
type DispatchProps = {
  search: (query: { text?: string, formula?: string }) => void
}
type Props = StateProps & DispatchProps & RouteComponentProps<{}>

// See https://github.com/erikras/redux-form/issues/1094
const Text = props => <Wrapped {...props} component="input" />
const Formula = props => <Wrapped {...props} component={FormulaInput} />

class Search extends React.PureComponent<Props> {
  componentWillMount() {
    const query = qs.parse(this.props.location.search)
    if (query.formula || query.text) {
      this.props.search({ text: query.text, formula: query.formula })
    }
  }

  render() {
    const { text, formula, modifier, parsedFormula, search } = this.props

    // TODO: add widget to allow displaying extra traits inline
    return (
      <div className="container">
        <form className="search row" >
          <div className="col-md-4">
            <Text
              label="Filter by Text"
              placeholder="plank"
              value={text}
              onChange={e => search({ text: e.target.value })}
            />
            <Formula
              label="Filter by Formula"
              placeholder="compact + ~metrizable"
              value={formula}
              onChange={value => search({ formula: value })}
            />

          <EditLink to="/spaces/new" className="btn btn-default">
            New Space
          </EditLink>
        </div>

        <div className="col-md-8">
          <Results text={text} formula={parsedFormula} modifier={modifier} />
        </div>
      </form >
    </div>
    )
  }
}

const updateQueryParams = (history, text, formula) => {
  const query = qs.parse(history.location.search)
  if (text) { query.text = text }
  if (formula) { query.formula = formula }
  const search = `?${qs.stringify(query)}`

  if (history.location.search === search) { return }

  const path = `${history.location.pathname}${search}`
  if (history.location.search) {
    // Don't want a history entry for each letter
    history.replace(path)
  } else {
    // Do want one for the initial search
    history.push(path)
  }
}

export default connect(
  (state: State): StateProps => ({
    text: state.search.text,
    formula: state.search.formula,
    modifier: state.search.modifier,
    parsedFormula: S.searchFormula(state)
  }),
  (dispatch: Dispatch, props: Props): DispatchProps => ({
    search: ({ text, formula }) => {
      updateQueryParams(props.history, text, formula)
      dispatch(A.search({ text, formula }))
    }
  })
)(Search)
