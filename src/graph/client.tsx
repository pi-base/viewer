import ApolloClient, { createNetworkInterface } from 'apollo-client'
import * as Q from './queries'
import * as T from '../types'

interface Uid { uid: string }

export class Client {
    token: T.Token
    url: string
    apollo: ApolloClient

    constructor(url?: string) {
        this.url = url || 'http://localhost:3141'
        this.apollo = this.buildApollo(`${this.url}/graphql`)
    }

    login(token: T.Token) {
        this.token = token
        return this.apollo.query({query: Q.me}).then(response =>  {
            const user = (response.data as Q.MeResponse).me
            return user
        })
    }

    loginUrl({ redirectTo }: { redirectTo: Location }) {
        return `${this.url}/auth/page/github/forward?location=${redirectTo}`
    }

    ping(): Promise<Client> {
        return this.apollo.query({query: Q.version}).then(() => this)
    }

    buildApollo(uri: string): ApolloClient {
        const network = createNetworkInterface({
            uri,
            opts: {
                credentials: 'same-origin'
            }
        })

        network.use([{
            applyMiddleware: (req, next) => {
              if (this.token) {
                if (!req.options.headers) {
                  req.options.headers = {};  // Create the header object if needed.
                }
                req.options.headers.authorization = this.token
              }
              next();
            }
          }]);

        return new ApolloClient({
            dataIdFromObject: (o: Uid) => o.uid,
            networkInterface: network
        })
    }
}