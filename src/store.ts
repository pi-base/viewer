import { ApolloClient } from 'apollo-client'

import { Client } from './graph/client'

import { action, computed, observable } from 'mobx'
import { Finder } from './models/PropertyFinder'

import Collection from './store/Collection'
import Proofs from './store/Proofs'
import Traits from './store/Traits'
import User from './store/User'

import * as I from 'immutable'
import * as T from './types'
import * as F from './models/Formula'
import * as Q from './queries'

export class Store {
  @observable version: string

  spaces: Collection<T.Id, T.Space>
  properties: Collection<T.Id, T.Property>
  theorems: Collection<T.Id, T.Theorem>
  traits: Traits

  apollo: ApolloClient
  user: User

  proofs: Proofs

  constructor(client?: ApolloClient) {
    this.spaces = new Collection()
    this.properties = new Collection()
    this.theorems = new Collection()
    this.traits = new Traits(this.spaces, this.properties)

    this.apollo = client || (new Client()).apollo
    this.user = new User(this.apollo)

    this.proofs = new Proofs()
  }

  @computed get propertyFinder(): Finder<T.Property> {
    return new Finder(this.properties.all)
  }

  @computed get spaceFinder(): Finder<T.Space> {
    return new Finder(this.spaces.all)
  }

  search(opts: { text?: string, formula?: any }) {
    return Q.filter(
      this.spaceFinder,
      this.traits.values,
      this.spaces.all,
      opts
    )
  }

  loadView(query: any) {
    return this.apollo.query({ query }).then(response => {
      this.addView((response.data as any).viewer)
    })
  }

  @action addView(viewer: any) {
    const properties = viewer.properties || []
    properties.forEach(p => this.properties.add({
      uid: p.uid,
      name: p.name,
      description: ''
    }))

    const spaces = viewer.spaces || []
    spaces.forEach(s => {
      this.spaces.add({
        uid: s.uid,
        name: s.name,
        description: s.description
      })
      s.traits.forEach(t => {
        this.traits.add({
          space: s.uid,
          property: t.property.uid,
          value: t.value
        })
      })
    })

    const theorems = viewer.theorems || []
    theorems.forEach(t => {
      this.theorems.add({
        uid: t.uid,
        if: F.fromJSON(JSON.parse(t.if)),
        then: F.fromJSON(JSON.parse(t.then)),
        converse: null,
        description: t.description
      })
    })

    this.version = viewer.version
  }

  @action runProver() {
    const space = this.spaces.all.get(0)
    const theorems = this.theorems.all
    const traits = this.traits.forSpace(space.uid)
    return
  }
}

export default new Store()