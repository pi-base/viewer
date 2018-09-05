const EC2_GRAPH_URL = 'https://server.counterexamples.info'
const LOCAL_GRAPH_URL = 'http://localhost:3141'

export const GRAPHQL_SERVER_URL = process.env.NODE_ENV === 'production'
  ? EC2_GRAPH_URL
  : LOCAL_GRAPH_URL