import * as React from 'react'
import { connect } from 'react-redux'

import * as T from '../../types'
import * as Q from '../../queries'

import Aliases    from '../Aliases'
import NotFound   from '../NotFound'
import Markdown   from '../Markdown'
import TraitPager from '../Trait/Pager'
import Tex        from '../Tex'

export interface Props {
  space: T.Space
  children: {}
  params: { spaceId: string }
}

function Space({ space, params, children }: Props) {
  if (!space) { return <NotFound/> }

  return (
    <div>
      <h1>
        <Tex>
          {space.name}
          {space.aliases ? <Aliases aliases={space.aliases}/> : ''}
        </Tex>
      </h1>
      <Tex><Markdown text={space.description}/></Tex>

      <hr/>

      <div className="row">
        <div className="col-md-4">
          <h3>Properties</h3>
          <TraitPager space={space}/>
        </div>
        <div className="col-md-8">
          {children}
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state: T.StoreState, { params }: Props) {
  return {
    space: Q.findSpace(state, params.spaceId)
  }
}

export default connect(mapStateToProps)(Space)
