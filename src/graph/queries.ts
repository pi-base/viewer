import gql from 'graphql-tag'

export const version = gql`
  query Version {
    viewer { version }
  }
`

export const spaces = gql`
  query Spaces {
    viewer {
      spaces {
        uid
        name
      }
    }
  }
`

export const properties = gql`
  query Properties {
    viewer {
      properties {
        uid
        name
      }
    }
  }
`

export const theorems = gql`
  query Theorems {
    viewer {
      theorems {
        uid
        if
        then
        description
      }
    }
  }
`

export const traits = gql`
  query Traits {
    viewer {
      spaces {
        uid
        traits {
          property {
            uid
          }
          value
        }
      }
    }
  }
`

export const viewer = gql`
  query Viewer {
    viewer {
      version
      spaces {
        uid
        name
        description
        traits {
          property {
            uid
          }
          value
        }
      }
      properties {
        uid
        name
        description
      }
      theorems {
        uid
        if
        then
        description
      }
    }
  }
`

export const me = gql`
  query Me {
    me {
      name
    }
  }
`

export const createSpace = gql`
  mutation createSpace($input: CreateSpaceInput!) {
    createSpace(input: $input) {
      version
      spaces {
        uid
        name
        description
      }
    }
  }
`

export const createProperty = gql`
  mutation createProperty($input: CreatePropertyInput!) {
    createProperty(input: $input) {
      version
      properties {
        uid
        name
        description
      }
    }
  }
`