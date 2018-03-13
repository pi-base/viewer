export const SERVER_URL = process.env.NODE_ENV === 'production' ?
  'https://pi-base.firebaseapp.com' :
  'http://localhost:3000'

const EC2_GRAPH_URL = 'http://34.227.177.200'
const LOCAL_GRAPH_URL = 'http://localhost:3141'

export const GRAPHQL_SERVER_URL = process.env.REACT_APP_SERVER_URL || LOCAL_GRAPH_URL