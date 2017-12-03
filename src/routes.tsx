import * as React from 'react'

import { Route, Switch } from 'react-router'

import Home from './components/Home'
import Layout from './components/Layout'
import Login from './containers/Login'
import NotFound from './components/NotFound'

import PropertyCreate from './components/Property/Create'
import Properties from './components/Property/Index'
import Property from './containers/Property'

import Space from './components/Space'
import SpaceCreate from './containers/CreateSpace'

import TheoremCreate from './containers/Theorem/Create'
import Theorem from './containers/Theorem'
import Theorems from './components/Theorem/List'

import Trait from './components/Trait'
import TraitHelp from './components/Trait/Help'

import Search from './containers/Search'
import User from './containers/User'
import UserTab from './components/Layout/UserTab'

// TODO: better loading indicator
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
