import ApolloClient from 'apollo-client'
import * as Q from './queries'
import * as T from '../types'

interface Uid { uid: string }

export class Client {
  token: T.Token
  url: string
  apollo: any

  constructor(url?: string) {
    this.url = url || 'http://localhost:3141'
    this.apollo = this.buildApollo(`${this.url}/graphql`)
  }

  login(token: T.Token) {
    this.token = token
    return this.query({ query: Q.me }).then(response => {
      const user = (response.data as Q.MeResponse).me
      return user
    })
  }

  loginUrl({ redirectTo }: { redirectTo: Location }) {
    return `${this.url}/auth/page/github/forward?location=${redirectTo}`
  }

  ping(): Promise<Client> {
    return this.query({ query: Q.version }).then(() => this)
  }

  query(args: any) {
    return this.apollo.query(args)
  }

  buildApollo(uri: string) {
    return {} as any
    // const network = createNetworkInterface({
    //   uri,
    //   opts: {
    //     credentials: 'same-origin'
    //   }
    // })

    // network.use([{
    //   applyMiddleware: (req, next) => {
    //     if (this.token) {
    //       (req.options.headers as any).authorization = this.token
    //     }
    //     next();
    //   }
    // }]);

    // return new ApolloClient({
    //   dataIdFromObject: (o: Uid) => o.uid,
    //   networkInterface: network
    // })
  }
}