import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as I from 'immutable'

import * as Q from '../../queries'

import Aliases    from '../Aliases'
import NotFound   from '../NotFound'
import Markdown   from '../Markdown'
import TraitPager from '../Trait/Pager'
import Tex        from '../Tex'

class Space extends React.Component {
  render() {
    const space = this.props.space

    if (!space) {
      return <NotFound {...this.props}/>
    }

    return (
      <div>
        <h1>
          <Tex>
            {space.get('name')}
            <Aliases aliases={space.get('aliases')}/>
          </Tex>
        </h1>
        <Tex><Markdown text={space.get('description')}/></Tex>

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

Space.propTypes = {
  space: PropTypes.instanceOf(I.Map)
}

export default connect(
  (state, ownProps) => ({
    space: Q.findSpace(state, ownProps.params.spaceId)
  })
)(Space)
