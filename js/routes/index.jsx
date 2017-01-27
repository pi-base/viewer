import React from 'react'
import Relay from 'react-relay'
import {Route} from 'react-router'

import App    from '../components/App'
import Space  from '../components/Space'
import Spaces from '../components/Spaces'
import Search from '../components/Search'

const SpaceQueries = {
  space: () => Relay.QL`query { space(slug: $spaceSlug) }`
}
const ViewerQueries = {
  viewer: () => Relay.QL`query { viewer }`
}

const routes = <Route path="/" component={App}>
  <Route path="spaces" component={Spaces} queries={ViewerQueries}/>
  <Route path="spaces/:spaceSlug" component={Space} queries={SpaceQueries}/>
  <Route path="search" component={Search}/>
</Route>

export default routes
