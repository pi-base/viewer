import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router'

import { useStore } from '../../models'
import { Store, default as S } from '../../models/Store'
import Detail from './Detail'
import Name from './Name'
import RouteLookup from '../Shared/RouteLookup'
import { Svelte } from '../Svelte'
import List from './List.svelte'

export { Name }

function find(store: Store, { id }: { id: string }) {
  const theorem = S.theorem(store, id)
  return theorem && { theorem }
}

function Index() {
  const theorems = S.theorems(useStore())
  return <Svelte component={List} props={{ theorems }} />
}

export default function () {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <RouteLookup path={`${path}/:id`} lookup={find} component={Detail} />
      <Route path={path} exact component={Index} />
    </Switch>
  )
}
