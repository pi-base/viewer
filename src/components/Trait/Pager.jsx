import React from 'react'
import { connect } from 'react-redux'

import * as A from '../../actions'
import * as Q from '../../queries'

import TraitItem from './Item'

class TraitPager extends React.Component {
  constructor() {
    super()
    this.state = { filter: '' }
  }

  queueFilter(str) {
    this.setState({ filter: str })

    if (this.wait) {
      clearTimeout(this.wait)
      this.wait = null
    }
    this.wait = setTimeout(() => {
      this.props.doFilter(str)
      this.wait = null
    }, 500)
  }

  nextPage() {
    console.log('next')
  }

  render() {
    const { space, traits } = this.props


    return (
      <div>
        <input
          type="text"
          autoComplete="off"
          className="form-control"
          name="traitFilter"
          value={this.state.filter}
          onChange={(e) => this.queueFilter(e.target.value)}
        />
        <ul>
          {traits.map(trait =>
            <TraitItem key={trait.property.name} space={space} property={trait.property} value={trait.value}/>
          )}
        </ul>
        <button onClick={() => this.nextPage()} className="btn btn-default">Next</button>
      </div>
    )
  }
}

export default connect(
  (state, ownProps) => {
    return {
      traits: Q.filteredTraitsForSpace(state, ownProps.space, state.getIn(['spaces', 'traitFilter']))
    }
  },
  (dispatch) => ({
    doFilter: (f) => { dispatch(A.filterSpaceTraits(f)) }
  })
)(TraitPager)
