import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, concat } from 'apollo-link'

import { TokenStorage } from '../types'

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

export type Client = ApolloClient<{}>

const root = 'http://localhost:3141'

export const loginUrl = ({ redirectTo }) =>
  `${root}/auth/page/github/forward?location=${redirectTo}`

type ClientOptions = {
  root?: string
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  token: TokenStorage
}

export function makeClient(opts: ClientOptions): Client {
  const base = opts.root || 'http://localhost:3141'

  const authMiddleware = new ApolloLink((operation, forward) => {
    const token = opts.token.get()
    if (token) {
      operation.setContext({
        headers: {
          authorization: token
        }
      })
    }

    return forward!(operation)
  })

  const httpLink = new HttpLink({
    uri: `${base}/graphql`,
    credentials: 'same-origin',
    fetch: opts.fetch || window.fetch
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: concat(authMiddleware, httpLink)
  })
}
