import gql from 'graphql-tag'

export type VersionResponse = {
  viewer: {
    version: string
  }
}
export const version = gql`
  query Version {
    viewer { version }
  }
`

export type SpacesResponse = {
  viewer: {
    spaces: {
      uid: string
      name: string
    }[]
  }
}
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

export type PropertiesResponse = {
  viewer: {
    properties: {
      uid: string
      name: string
    }[]
  }
}
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

export type TheoremsResponse = {
  viewer: {
    theorems: {
      uid: string
      if: string
      then: string
      description: string
    }[]
  }
}
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

export type TraitsResponse = {
  viewer: {
    spaces: {
      uid: string
      traits: {
        property: {
          uid: string
        }
        value: boolean
      }[]
    }[]
  }
}
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

export type ViewerResponse = {
  viewer: {
    spaces: {
      uid: string
      name: string
      traits: {
        property: {
          uid: string
        }
        value: boolean
      }
    }[]
    properties: {
      uid: string
      name: string
    }[]
    theorems: {
      uid: string
      if: string
      then: string
    }[]
  }
}
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

export type MeResponse = {
  me: {
    name: string
  }
}
export const me = gql`
  query Me {
    me {
      name
    }
  }
`

export type TestResetResponse = {
  testReset: {
    version: string
    token?: string
  }
}
export const testReset = gql`
  mutation testReset($input: TestResetInput!) {
    testReset(input: $input) {
      version
      token
    }
  }
`

export type CreateSpaceResponse = {
  createSpace: {
    version: string
    spaces: {
      uid: string
      name: string
      description: string
    }[]
  }
}
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