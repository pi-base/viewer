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

const middleware = [thunk]

const store = createStore<State>(
  rootReducer,
  applyMiddleware(...middleware)
)
const dispatch = store.dispatch

let token = 'test'
const getToken = () => { return token }

const client = G.makeClient({ getToken, fetch })

const resetMutation = require('./graph/mutations/testReset.gql')

const reset = async (ref = 'development') => {
  return client.mutate({
    mutation: resetMutation,
    variables: {
      input: { token, ref }
    }
  }).then(response => {
    return (response.data as any).testReset
  })
}

it('can create a space', async () => {
  await reset()
  await A.createSpace(client, dispatch, {
    uid: '123', name: 'S', description: 'New Space'
  })
  const state: State = store.getState()
  expect(state.spaces.get('123')!.name).toEqual('S')

  const version = state.version.sha!
  expect(version.length).toEqual(40)
})