import * as React from 'react'
import qs from 'query-string'

import { Dispatch, connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import { search } from '../actions'
import * as Q from '../queries'
import * as S from '../selectors'
import { Action } from '../types'

import Labeled from './Form/Labeled'
import FormulaInput from './Formula/Input'
import Results from './Search/Results'

type Props = RouteComponentProps<{}> & { dispatch: Dispatch<Action> }

// See https://github.com/erikras/redux-form/issues/1094
const Text = props => <Labeled {...props} Component="input" />
const Formula = props => <Labeled {...props} Component={FormulaInput} />

class Search extends React.PureComponent<Props> {
  componentWillMount() {
    const query = qs.parse(this.props.location.search)
    if (query.formula || query.text) {
      this.props.dispatch(search({ formula: query.formula, text: query.text }))
    }
  }

  render() {
    // TODO: add widget to allow displaying extra traits inline
    return (
      <div className="container">
        <h3>Topological spaces</h3>
        <form className="search row" >
          <div className="col-md-4">
            <Field
              name="text"
              type="text"
              label="Filter by Text"
              placeholder="e.g. plank"
              component={Text}
            />

            <Field
              name="formula"
              type="text"
              label="Filter by Formula"
              placeholder="e.g. compact + ~metrizable"
              component={Formula}
            />

            <Link to="/spaces/new" className="btn btn-default">
              New Space
            </Link>
          </div>

          <div className="col-md-8">
            <Results />
          </div>
        </form >
      </div>
    )
  }
}

export default connect(
  (state, { location }) => {
    const query = qs.parse(location.search)
    return {
      initialValues: {
        text: query.text,
        formula: query.formula
      }
    }
  }
)(
  reduxForm({
    form: 'search',
    onChange: ({ text, formula }, dispatch, { history }) => {

      const query: { text?: string, formula?: string } = {}
      if (text) { query.text = text }
      if (formula) { query.formula = formula }
      const path = `${history.location.pathname}?${qs.stringify(query)}`

      if (history.location.search) {
        // Don't want a history entry for each letter
        history.replace(path)
      } else {
        // Do want one for the initial search
        history.push(path)
      }

      dispatch(search({ text, formula }))
    }
  })(
    Search))
