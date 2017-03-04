import React from 'react'

import { Route, IndexRoute } from 'react-router'

import Home       from './components/Home'
import Layout     from './components/Layout'
import NotFound   from './components/NotFound'
import Property   from './components/Property'
import Properties from './components/Property/List'
import Space      from './components/Space'
import Search     from './components/Search'
import Theorem    from './components/Theorem'
import Theorems   from './components/Theorem/List'
import Trait      from './components/Trait'
import TraitHelp  from './components/Trait/Help'


// TODO: better loading indicator
const routes = (
  <Route
    path="/"
    component={Layout}
  >
    <IndexRoute component={Home}/>
    <Route path="spaces" component={Search}/>
    <Route path="spaces/:spaceId" component={Space}>
      <IndexRoute component={TraitHelp}/>
      <Route path="properties/:propertyId" component={Trait}/>
    </Route>

    <Route path="theorems" component={Theorems}/>
    <Route path="theorems/:theoremId" component={Theorem}/>

    <Route path="properties" component={Properties}/>
    <Route path="properties/:propertyId" component={Property}/>

    <Route path='*' component={NotFound}/>
  </Route>
)

export default routes
