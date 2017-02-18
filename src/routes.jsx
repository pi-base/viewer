import React from 'react'

import { Route, IndexRoute } from 'react-router'

import App       from './components/App'
import Debug     from './components/Debug'
import Space     from './components/Space'
import Spaces    from './components/Spaces'
import Search    from './components/Search'
import Theorem   from './components/Theorem'
import Theorems  from './components/Theorems'
import Trait     from './components/Trait'
import TraitHelp from './components/Trait/Help'

const routes = (
  <Route
    path="/"
    component={App}
  >
    <Route path="spaces" component={Spaces}/>
    <Route path="spaces/:spaceName" component={Space}>
      <IndexRoute component={TraitHelp}/>
      <Route path="properties/:propertyName" component={Trait}/>
    </Route>
    <Route path="theorems" component={Theorems}/>
    <Route path="theorems/:theoremId" component={Theorem}/>
    <Route path="search" component={Search}/>
    <Route path="debug" component={Debug}/>
  </Route>
)

export default routes
