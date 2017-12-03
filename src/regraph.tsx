import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

export function makeClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'http://localhost:3141/graphql'
    }),
    cache: new InMemoryCache()
  })
}
