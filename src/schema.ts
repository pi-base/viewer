export const typeDefs = `
type Space {
  uid: ID!
  name: String!
  slug: String
  description: String
}

type Property {
  uid: ID!
  name: String!
  slug: String
  description: String
}

type User {
  name: String!
}

type Query {
  me:         User
  spaces:     [Space]
  properties: [Property]
}
`
