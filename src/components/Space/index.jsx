import React from 'react'
import { connect } from 'react-redux'

import * as Q from '../../queries'

import Markdown   from '../Markdown'
import TraitPager from '../Trait/Pager'
import Tex        from '../Tex'

class Space extends React.Component {
  render() {
    const space = this.props.space
    if (!space) { return null }

    return (
      <div>
        <h1>{space.name}</h1>
        <Tex><Markdown text={space.description}/></Tex>

        <hr/>

        <div className="row">
          <div className="col-md-4">
            <h3>Properties</h3>
            <TraitPager space={space}/>
          </div>
          <div className="col-md-8">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    space: Q.findSpace(state, ownProps.params.spaceName)
  })
)(Space)
