import React from 'react'

import { Route, IndexRoute } from 'react-router'

import Home       from './components/Home'
import Layout     from './components/Layout'
import Property   from './components/Property'
import Properties from './components/Property/List'
import Space      from './components/Space'
import Search     from './components/Search'
import Theorem    from './components/Theorem'
import Theorems   from './components/Theorem/List'
import Trait      from './components/Trait'
import TraitHelp  from './components/Trait/Help'

class PageNotFound extends React.Component {
  render() {
    const path = this.props.router.location.pathname

    if (window.Rollbar) {
      window.Rollbar.info('404', {
        path: path
      })
    }

    return <div className="jumbotron">
      <h1>404: Page Not Found</h1>
      <p>You appear to be looking for <code>{path}</code>, but we don't know how to find that.</p>
      <p>
        You can press the back button to head back where you were, or
        {' '}
        <a href="https://github.com/jamesdabbs/pi-base-viewer/issues">report this</a>
        {' '}
        if you think it's a bug.
        </p>
    </div>
  }
}

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

    <Route path='*' component={PageNotFound}/>
  </Route>
)

export default routes
