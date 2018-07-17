import { ApolloLink, concat } from 'apollo-link'

import { ApolloClient } from 'apollo-client'
import { GRAPHQL_SERVER_URL } from '../constants'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { TokenStorage } from '../types'
import { onError } from 'apollo-link-error'

export * from './types'

export const me = require('./queries/Me.gql')
export const viewer = require('./queries/Viewer.gql')

export const assertTrait = require('./queries/AssertTrait.gql')
export const assertTheorem = require('./queries/AssertTheorem.gql')
export const createProperty = require('./queries/CreateProperty.gql')
export const createSpace = require('./queries/CreateSpace.gql')
export const resetBranch = require('./queries/ResetBranch.gql')
export const submitBranch = require('./queries/SubmitBranch.gql')
export const updateProperty = require('./queries/UpdateProperty.gql')
export const updateSpace = require('./queries/UpdateSpace.gql')
export const updateTheorem = require('./queries/UpdateTheorem.gql')
export const updateTrait = require('./queries/UpdateTrait.gql')

export const schema = require('./schema.gql')

export type Client = ApolloClient<{}>

export const loginUrl = ({ redirectTo }) =>
  `${GRAPHQL_SERVER_URL}/auth/page/github/forward?location=${redirectTo}`

type ClientOptions = {
  root?: string
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  token: TokenStorage
}

export function makeClient(opts: ClientOptions): Client {
  const base = opts.root || GRAPHQL_SERVER_URL

  const authMiddleware = new ApolloLink((operation, forward) => {
    const token = opts.token.get()
    if (token) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    return forward!(operation)
  })

  const httpLink = new HttpLink({
    uri: `${base}/graphql`,
    credentials: 'same-origin',
    fetch: opts.fetch || window.fetch,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  const errorLink = onError(({ networkError }) => {
    if (networkError) {
      window.piBase.showError(networkError)
    }
  })

  const link = ApolloLink.from([
    errorLink,
    authMiddleware,
    httpLink
  ])

  return new ApolloClient({
    cache: new InMemoryCache(),
    link
  })
}
