import * as React from 'react'

import { Route, IndexRoute } from 'react-router'

import Home           from './components/Home'
import Layout         from './components/Layout'
import NotFound       from './components/NotFound'
import PropertyCreate from './containers/CreateProperty'
import PropertySearch from './components/Property/Search'
import PropertyShow   from './components/Property/Show'
import Properties     from './containers/Properties'
import Space          from './components/Space'
import Search         from './components/Search'
import Theorem        from './components/Theorem'
import Theorems       from './components/Theorem/List'
import Trait          from './components/Trait'
import TraitHelp      from './components/Trait/Help'
import User           from './components/User'
import UserTab        from './components/Layout/UserTab'

// TODO: better loading indicator
const routes = (
  <Route
    path="/"
    component={Layout}
  >
    <IndexRoute component={Home}/>

    <Route path="login/:token" component={UserTab}/>
    <Route path="user" component={User}/>

    <Route path="spaces" component={Search}/>
    <Route path="spaces/:spaceId" component={Space}>
      <IndexRoute component={TraitHelp}/>
      <Route path="properties/:propertyId" component={Trait}/>
    </Route>

    <Route path="theorems" component={Theorems}/>
    <Route path="theorems/:theoremId" component={Theorem}/>

    <Route path="properties" component={Properties}>
      <IndexRoute component={PropertySearch}/>
      <Route path="new" component={PropertyCreate}/>
      <Route path=":propertyId" component={PropertyShow}/>
    </Route>

    <Route path="*" component={NotFound}/>
  </Route>
)

export default routes
