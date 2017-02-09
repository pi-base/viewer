import React from 'react'
import Relay from 'react-relay'

import { Route, IndexRoute } from 'react-router'

import App       from './components/App'
import Space     from './components/Space'
import Spaces    from './components/Spaces'
import Search    from './components/Search'
import Theorem   from './components/Theorem'
import Theorems  from './components/Theorems'
import Trait     from './components/Trait'
import TraitHelp from './components/Trait/Help'

const ViewerQueries = {
  viewer: () => Relay.QL`query { viewer }`
}

const Spinner = () => <p>Loading ...</p>

const Loading = () => (
  <App viewer={null}>
    <Spinner/>
  </App>
)

const routes = (
  <Route
    path="/"
    component={App}
    queries={ViewerQueries}
    render={({props}) => props ? <App {...props}/> : <Loading/>}
  >
    <Route path="spaces" component={Spaces} queries={ViewerQueries}/>
    <Route path="spaces/:spaceName" component={Space} queries={ViewerQueries}>
      <IndexRoute component={TraitHelp}/>
      <Route path="properties/:propertyName" component={Trait} queries={ViewerQueries}/>
    </Route>
    <Route path="theorems" component={Theorems} queries={ViewerQueries}/>
    <Route path="theorems/:theoremId" component={Theorem} queries={ViewerQueries}/>
    <Route path="search" component={Search} queries={ViewerQueries}/>
  </Route>
)

export default routes
