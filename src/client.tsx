import ApolloClient, { createNetworkInterface } from 'apollo-client'
import * as Q from './queries'

interface Uid { uid: string }

// TODO: encapsulate token in a client object rather than a global
let token: String
export const setToken = (t: string) => { token = t }

function buildNetworkInterface(uri: string) {
    const network = createNetworkInterface({
        uri,
        opts: {
            credentials: 'same-origin'
        }
    })

    network.use([{
        applyMiddleware: (req, next) => {
          if (token) {
            if (!req.options.headers) {
              req.options.headers = {};  // Create the header object if needed.
            }
            req.options.headers.authorization = token
          }
          next();
        }
      }]);

    return network
}

function buildClient(uri: string) {
    return new ApolloClient({
        dataIdFromObject: (o: Uid) => o.uid,
        networkInterface: buildNetworkInterface(uri)
    })
}

function buildTestClient() {
    (global as any).fetch = require('isomorphic-fetch')
    return buildClient('http://localhost:3000/graphql')
}

export function setupTest(): Promise<ApolloClient> {
    const client = buildTestClient()
    return client.query({ query: Q.version }).then(() => client)
}

export function getClient(): ApolloClient {
    if (process.env.NODE_ENV === 'test') {
        return buildTestClient()
    } else {
        throw `No client configured for ${process.env.NODE_ENV}`
    }
}

export default buildClient('http://localhost:4000/graphql')