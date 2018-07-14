import * as React from 'react'

import { Route, Switch } from 'react-router'

import Home from './components/Home'
import Login from './components/Login'
import NotFound from './components/NotFound'
import Properties from './components/Property/List'
import Property from './components/Property'
import PropertyCreate from './components/Property/Create'
import Search from './components/Search'
import Space from './components/Space'
import SpaceCreate from './components/Space/Create'
import Theorem from './components/Theorem'
import TheoremCreate from './components/Theorem/Create'
import Theorems from './components/Theorem/List'
import User from './components/User'

const routes = (
  <Switch>
    <Route path="/" exact={true} component={Home} />

    <Route path="/login/:token" component={Login} />
    <Route path="/user" component={User} />

    <Route path="/spaces/new" component={SpaceCreate} />
    <Route path="/spaces/:spaceId" component={Space} />
    <Route path="/spaces" component={Search} />

    <Route path="/theorems/new" component={TheoremCreate} />
    <Route path="/theorems/:id" component={Theorem} />
    <Route path="/theorems" component={Theorems} />

    <Route path="/properties/new" component={PropertyCreate} />
    <Route path="/properties/:id" component={Property} />
    <Route path="/properties" component={Properties} />

    <Route component={NotFound} />
  </Switch>
)

export default routes
