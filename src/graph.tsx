import { ApolloClient, createNetworkInterface } from 'react-apollo'

import { GRAPHQL_SERVER_URL } from './constants'
import { cache } from './cache'

const networkInterface = createNetworkInterface({
  uri: `${GRAPHQL_SERVER_URL}/graphql`
})

networkInterface.use([{
  // tslint:disable-next-line no-any
  applyMiddleware(req: any, next: any) {
    if (!req.options.headers) { req.options.headers = {} }

    const token = cache.get('token')
    req.options.headers.authorization = token ? `Bearer ${token}` : null;
    next();
  }
}])

export const client = new ApolloClient({
  networkInterface: networkInterface
})
