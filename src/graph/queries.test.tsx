import ApolloClient from 'apollo-client'
import { client } from '../graph'
import * as Q from './queries'

beforeAll(() => {
    return client.ping()
})

const q = (query) => {
    return client.apollo.query({ query: query }).then(result => result.data)
}

const m = (query, input) => {
    return client.apollo.
      mutate({ mutation: query, variables: { input: input }}).
      then(result => result.data)
}

const reset = (token) => {
    return m(Q.testReset, { token: token, ref: 'development' })
}

describe('queries', () => {
  it('can fetch spaces', () => {
      return q(Q.spaces).then((data: Q.SpacesResponse) => {
          expect(data.viewer.spaces.length).toBeGreaterThanOrEqual(143)
  
          const space = data.viewer.spaces[0]
          expect(space.name).toBeTruthy()
          expect(space.uid).toBeTruthy()
      })
  })
  
  it('can fetch properties', () => {
      return q(Q.properties).then((data: Q.PropertiesResponse) => {
          expect(data.viewer.properties.length).toBeGreaterThanOrEqual(60)
  
          const property = data.viewer.properties[0]
          expect(property.name).toBeTruthy()
          expect(property.uid).toBeTruthy()
      })
  })
  
  it('can fetch theorems', () => {
      return q(Q.theorems).then((data: Q.TheoremsResponse) => {
          expect(data.viewer.theorems.length).toBeGreaterThan(100)
  
          const theorem = data.viewer.theorems[0]
          expect(theorem.uid).toBeTruthy()
      })
  })
  
  it('can fetch traits', () => {
      return q(Q.traits).then((data: Q.TraitsResponse) => {
          const trait = data.viewer.spaces[0].traits[0]
          expect(trait.property.uid).toBeTruthy()
          expect(trait.value).not.toBeNull()
  
          expect(data.viewer.spaces.length).toBeGreaterThanOrEqual(143)
      })
  })

  it('can lookup user info', () => {
      let token = '1234'
      return reset(token).then(() => {
          return client.login(token)
      }).then(() => {
          return q(Q.me)
      }).then((data: Q.MeResponse) => {
          expect(data.me.name).toEqual('tester')
      })
  })
})

describe('mutations', () => {
    const token = '1234'
    let version

    beforeEach(() => { 
        return reset(token).then((data: Q.TestResetResponse) => {
            version = data.testReset.version
            expect(version).toEqual('b91cbfb12122fc4fc5379f7a9f68cc42c487aa81')
            return client.login(token)
        }) 
    })

    it('can create a space', () => {
        return m(Q.createSpace, { 
            name: 'New Space', 
            description: 'Description of new space' 
        }).then((data: Q.CreateSpaceResponse) => {
            expect(data.createSpace.version).not.toEqual(version)
            expect(data.createSpace.spaces[0].name).toEqual('New Space')
        })
    })
})