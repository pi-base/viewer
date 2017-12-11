import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

export * from './queries'
export * from './types'

export type Client = ApolloClient<{}>

const root = 'http://localhost:3141'

export const loginUrl = ({ redirectTo }) =>
  `${root}/auth/page/github/forward?location=${redirectTo}`

export function makeClient(): Client {
  return new ApolloClient({
    link: new HttpLink({
      uri: `${root}/graphql`,
      credentials: 'same-origin'
    }),
    cache: new InMemoryCache()
  })
}
