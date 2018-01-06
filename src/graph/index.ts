import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, concat } from 'apollo-link'

export * from './types'

export const me = require('./queries/me.gql')
export const viewer = require('./queries/viewer.gql')

export const createSpace = require('./mutations/createSpace.gql')

export type Client = ApolloClient<{}>

const root = 'http://localhost:3141'

export const loginUrl = ({ redirectTo }) =>
  `${root}/auth/page/github/forward?location=${redirectTo}`

type ClientOptions = {
  root?: string
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  getToken: () => string | null
}

export function makeClient(opts: ClientOptions): Client {
  const base = opts.root || 'http://localhost:3141'

  const authMiddleware = new ApolloLink((operation, forward) => {
    const token = opts.getToken()
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
