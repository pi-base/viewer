import { graphql } from 'react-apollo'

import { Client } from './graph/client'
import * as Q from './graph/queries'

export * from './graph/client'
export * from './graph/queries'

export const withViewer = graphql(Q.viewer)

if (process.env.NODE_ENV === 'test') {
  // tslint:disable-next-line no-any
  (global as any).fetch = require('isomorphic-fetch')
}
export const client = new Client()