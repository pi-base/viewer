export const SERVER_URL = process.env.NODE_ENV === 'production' ?
  'https://pi-base.firebaseapp.com' :
  'http://localhost:3000'

export const GRAPHQL_SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3141'