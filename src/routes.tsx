import * as React from 'react'

import { Route, IndexRoute } from 'react-router'

import Home from './components/Home'
import Layout from './components/Layout'
import Login from './containers/Login'
import NotFound from './components/NotFound'
import PropertyCreate from './containers/CreateProperty'
import PropertySearch from './components/Property/Search'
import Property from './containers/Property'
import Properties from './containers/Properties'
import Space from './components/Space'
import SpaceCreate from './containers/CreateSpace'
import Search from './containers/Search'
import Theorem from './containers/Theorem'
import Theorems from './components/Theorem/List'
import Trait from './components/Trait'
import TraitHelp from './components/Trait/Help'
import User from './containers/User'
import UserTab from './components/Layout/UserTab'

// TODO: better loading indicator
const routes = (
  <Route
    path="/"
    component={Layout}
  >
    <IndexRoute component={Home} />

    <Route path="login/:token" component={Login} />
    <Route path="user" component={User} />

    <Route path="spaces" component={Search} />
    <Route path="spaces/new" component={SpaceCreate} />
    <Route path="spaces/:spaceId" component={Space}>
      <IndexRoute component={TraitHelp} />
      <Route path="properties/:propertyId" component={Trait} />
    </Route>

    <Route path="theorems" component={Theorems} />
    <Route path="theorems/:id" component={Theorem} />

    <Route path="properties/new" component={PropertyCreate} />
    <Route path="properties" component={Properties}>
      <IndexRoute component={PropertySearch} />
      <Route path=":id" component={Property} />
    </Route>

    <Route path="*" component={NotFound} />
  </Route>
)

export default routes
