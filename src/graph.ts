import { graphql } from 'react-apollo'

import * as Q from './graph/queries'

export * from './graph/client'
export * from './graph/queries'

export const withViewer = graphql(Q.viewer)