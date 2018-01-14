import { applyMiddleware, compose, createStore, Store } from 'redux'
import persistState from 'redux-localstorage'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import { ApolloClient, WatchQueryOptions } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'

import * as A from './actions'
import { atom } from './models/Formula'
import * as G from './graph'
import rootReducer, { State } from './reducers'
import { makeStore } from './store'

import { activeBranch } from './selectors'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

const initial = 'b91cbfb12122fc4fc5379f7a9f68cc42c487aa81'
let userBranch = ''

const token = (() => {
  let t = '' // FIXME: need a better strategy for getting a working token in test

  return {
    get: () => t,
    set: value => t = value
  }
})()

const graph = G.makeClient({ token, fetch })

const createUser = (name: string): Promise<string> => {
  return fetch('http://localhost:3141/users', {
    method: 'POST',
    body: JSON.stringify({ ident: name })
  }).
    then(res => res.json()).
    then(json => json.token.uuid)
}

const store = createStore<State>(
  rootReducer,
  applyMiddleware(
    thunk.withExtraArgument({ graph, token })
  )
)
const dispatch = store.dispatch;

beforeAll(async () => {
  const t = await createUser('test')
  userBranch = 'users/test'
  token.set(t)
  const user = await dispatch(A.login(t))
  return dispatch(A.changeBranch(userBranch))
})

const reset = () => dispatch(A.resetBranch(userBranch, initial))

xit('can create a space', async () => {
  await reset()

  await dispatch(A.createSpace({
    uid: '123', name: 'S', description: 'New Space'
  }))

  const state: State = store.getState()
  expect(state.spaces.get('123')!.name).toEqual('S')

  const sha = activeBranch(state)!.sha
  expect(sha.length).toEqual(40)
  expect(sha).not.toEqual(initial)
})

it('runs api calls without error', async () => {
  await reset()

  const s1 = { uid: 's1', name: 'S', description: 'S' }
  const s2 = { uid: 's2', name: 'T', description: 'T' }
  const p1 = { uid: 'p1', name: 'P', description: 'P' }
  const p2 = { uid: 'p2', name: 'Q', description: 'Q' }

  const t1 = {
    uid: '',
    space: s1,
    property: p1,
    value: true,
    deduced: false,
    description: ''
  }

  const t2 = {
    uid: '',
    space: s2,
    property: p2,
    value: false,
    deduced: false,
    description: ''
  }

  const i1 = {
    uid: 't1',
    if: atom(p1.uid, true),
    then: atom(p2.uid, true),
    description: ''
  }

  await dispatch(A.createSpace(s1))
  await dispatch(A.createSpace(s2))

  await dispatch(A.createProperty(p1))
  await dispatch(A.createProperty(p2))

  await dispatch(A.assertTrait(t1))
  await dispatch(A.assertTrait(t2))

  await dispatch(A.assertTheorem(i1))

  await dispatch(A.updateSpace({ ...s1, description: 'Updated' }))
  await dispatch(A.updateProperty({ ...p1, description: 'Updated' }))
  await dispatch(A.updateTrait({ ...t1, description: 'Updated' }))
  await dispatch(A.updateTheorem({ ...i1, description: 'Updated' }))
})