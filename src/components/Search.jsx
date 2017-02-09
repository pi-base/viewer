import React from 'react'
import Relay from 'react-relay'

import U from './U'
import Formula from './Formula'
import FormulaInput from './Formula/Input'
import SearchResults from './Search/Results'

class Search extends React.Component {
  constructor() {
    super()

    this.state = {
      formula: null
    }
  }

  searchFor(formula) {
    this.setState({ formula })
  }

  results() {
    return this.props.universe.searchByFormula(
      this.props.viewer.spaces,
      this.state.formula
    ).sortBy(s => s.name).slice(0, 10)
  }

  render() {
    return (
      <div className="search row">
        <div className="col-md-4">
          <FormulaInput doChange={(f) => this.searchFor(f)}/>
        </div>

        <div className="col-md-8">
          <Formula formula={this.state.formula}/>
          <SearchResults formula={this.state.formula} results={this.results()}/>
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(U(Search), {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        spaces {
          uid
          name
          description
        }
      }
    `
  }
})
