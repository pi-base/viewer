import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { ApolloClient } from 'apollo-client'
import { createLogger } from 'redux-logger'
import persistState from 'redux-localstorage'
import thunkMiddleware from 'redux-thunk'
import { reducer as formReducer } from 'redux-form'

import { Client } from './graph/client'
import userReducer from './reducers/user'
import viewerReducer from './reducers/viewer'
import { StoreState } from './types'

import { action, computed, observable } from 'mobx'
import { Finder } from './models/PropertyFinder'

import * as I from 'immutable'
import * as T from './types'
import * as F from './models/Formula'
import * as Q from './queries'

class Collection<Id, X extends { uid: Id }> {
  @observable index: Map<Id, X>

  constructor() {
    this.index = new Map()
  }

  @action add(x: X) {
    this.index.set(x.uid, x)
  }

  @computed get all(): I.List<X> {
    return I.List(this.index.values())
  }

  find(uid: Id) {
    return this.index.get(uid)
  }
}

class Traits {
  @observable map: Map<T.Id, Map<T.Id, boolean>>

  spaces: Collection<T.Id, T.Space>
  properties: Collection<T.Id, T.Property>

  constructor(spaces: Collection<T.Id, T.Space>, properties: Collection<T.Id, T.Property>) {
    this.spaces = spaces
    this.properties = properties
    this.map = new Map()
  }

  @computed get values(): I.Map<T.Id, I.Map<T.Id, boolean>> {
    return I.fromJS(this.map)
  }

  check(space: T.Id, property: T.Id) {
    const traits = this.map.get(space)
    if (!traits) { return undefined }
    return traits.get(property)
  }

  @action add(trait: { space: T.Id, property: T.Id, value: boolean }) {
    const { space, property, value } = trait
    if (!this.map.has(space)) {
      this.map.set(space, new Map())
    }
    this.map.get(space)!.set(property, value)
  }
}

class Store {
  @observable spaces: Collection<T.Id, T.Space>
  @observable properties: Collection<T.Id, T.Property>
  @observable theorems: Collection<T.Id, T.Theorem>
  @observable traits: Traits

  constructor() {
    this.spaces = new Collection()
    this.properties = new Collection()
    this.theorems = new Collection()
    this.traits = new Traits(this.spaces, this.properties)
  }

  @computed get propertyFinder(): Finder<T.Property> {
    return new Finder(this.properties.all)
  }

  @computed get spaceFinder(): Finder<T.Space> {
    return new Finder(this.spaces.all)
  }

  search(opts: { text?: string, formula?: any }) {
    return Q.filter(
      this.spaceFinder,
      this.traits.values,
      this.spaces.all,
      opts
    )
  }

  @action loadView(viewer: any) {
    const properties = viewer.properties || []
    properties.forEach(p => this.properties.add({
      uid: p.uid,
      name: p.name,
      description: ''
    }))

    const spaces = viewer.spaces || []
    spaces.forEach(s => {
      this.spaces.add({
        uid: s.uid,
        name: s.name,
        description: s.description
      })
      s.traits.forEach(t => {
        this.traits.add({
          space: s.uid,
          property: t.property.uid,
          value: t.value
        })
      })
    })

    const theorems = viewer.theorems || []
    theorems.forEach(t => {
      this.theorems.add({
        uid: t.uid,
        if: F.fromJSON(JSON.parse(t.if)),
        then: F.fromJSON(JSON.parse(t.then)),
        converse: null,
        description: t.description
      })
    })
  }
}

export const mobxStore = (window as any).s = new Store() // FIXME

const nullMiddleware = ({ dispatch, getState }) => next => act => next(act)

function makeLogger() {
  if (process.env.NODE_ENV === 'development') {
    return createLogger({
      collapsed: (getState, act) => {
        if (!act.type) { return false }
        return act.type.startsWith('APOLLO_') || act.type.startsWith('@@redux-form/')
      },
      predicate: (getState, act) => {
        return act.type !== '@@redux-form/CHANGE'
      }
    })
  }
  return nullMiddleware
}

export function makeStore(client: Client, state?: StoreState) {
  const reducers = {
    form: formReducer,
    user: userReducer,
    viewer: viewerReducer,
    apollo: client.apollo.reducer()
  }

  const middleware = [
    thunkMiddleware,
    makeLogger(),
    client.apollo.middleware()
  ]

  const storage = persistState(['user'], {
    key: 'pi-base-state',
    merge: (initial, persisted) => {
      if (persisted.user.token) {
        client.token = persisted.user.token
      }
      return persisted ? { ...initial, ...persisted } : initial
    }
  })

  return createStore(
    combineReducers(reducers),
    state,
    compose(
      applyMiddleware(...middleware),
      storage
    )
  )
}
