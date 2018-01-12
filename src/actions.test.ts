import { applyMiddleware, compose, createStore, Store } from 'redux'
import persistState from 'redux-localstorage'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import { ApolloClient, WatchQueryOptions } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'

import * as A from './actions'
import * as G from './graph'
import rootReducer, { State } from './reducers'
import { makeStore } from './store'

import { activeBranch } from './selectors'

const initial = 'b91cbfb12122fc4fc5379f7a9f68cc42c487aa81'
let userBranch = ''

const token = (() => {
  let t = '' // FIXME: need a better strategy for getting a working token in test

  return {
    get: () => t,
    set: value => t = value
  }
})()

const client = G.makeClient({ token, fetch })

const middleware = [thunk.withExtraArgument({ client })]

const store = createStore<State>(
  rootReducer,
  applyMiddleware(...middleware)
)
const dispatch = store.dispatch

beforeAll(() => {
  return dispatch(A.login(token.get())).then(user => {
    userBranch = `users/${user.name}`
    dispatch(A.changeBranch(userBranch))
  })
})

it('can create a space', async () => {
  await dispatch(A.resetBranch(userBranch, initial))

  await dispatch(A.createSpace({
    uid: '123', name: 'S', description: 'New Space'
  }))

  const state: State = store.getState()
  expect(state.spaces.get('123')!.name).toEqual('S')

  const sha = activeBranch(state)!.sha
  expect(sha.length).toEqual(40)
  expect(sha).not.toEqual(initial)
})