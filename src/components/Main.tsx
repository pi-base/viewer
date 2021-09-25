import React from 'react'
import { Container } from 'react-bootstrap'
import { Switch, Route } from 'react-router-dom'

import Dev from './Dev'
import Home from './Home'
import NotFound from './Shared/NotFound'
import Preview from './Preview'
import { Property, Properties } from './Properties'
import Spaces from './Spaces'
import { Theorem, Theorems } from './Theorems'
import Traits from './Traits'

import { Dispatch } from '../actions'
import { Handler } from '../errors'

function tabs({
  render,
  root,
  tabs,
  initial,
}: {
  render(props: any): JSX.Element // FIXME
  root: string
  tabs: string[]
  initial: string
}) {
  return tabs
    .map((tab) => (
      <Route
        key={tab}
        path={`${root}/${tab}`}
        render={(props) => render({ ...props, tab })}
      />
    ))
    .concat(
      <Route
        key="default"
        path={root}
        render={(props) => render({ ...props, tab: initial })}
      />
    )
}

export default React.memo(function Main({
  dispatch,
  handler,
}: {
  dispatch: Dispatch
  handler: Handler
}) {
  return (
    <Container>
      <Switch>
        <Route
          path="/spaces/:spaceId/properties/:propertyId"
          component={Traits}
        />
        <Route path="/spaces" component={Spaces} />

        {tabs({
          root: '/properties/:id',
          tabs: ['theorems', 'spaces', 'references'],
          initial: 'theorems',
          render: ({ match, tab }) => (
            <Property id={match.params.id} tab={tab} />
          ),
        })}
        <Route path="/properties" component={Properties} />

        {tabs({
          root: '/theorems/:id',
          tabs: ['converse', 'references'],
          initial: 'converse',
          render: ({ match, tab }) => (
            <Theorem id={match.params.id} tab={tab} />
          ),
        })}
        <Route path="/theorems" component={Theorems} />

        <Route path="/dev/preview" component={Preview} />
        <Route path="/dev">
          <Dev dispatch={dispatch} handler={handler} />
        </Route>
        <Route path="/" exact component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Container>
  )
})
