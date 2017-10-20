import { ApolloClient } from 'apollo-client'

import { Client } from './graph/client'

import { action, computed, observable } from 'mobx'
import { Finder } from './models/PropertyFinder'

import Collection from './store/Collection'
import Traits from './store/Traits'

import * as I from 'immutable'
import * as T from './types'
import * as F from './models/Formula'
import * as Q from './queries'

export class Store {
  @observable spaces: Collection<T.Id, T.Space>
  @observable properties: Collection<T.Id, T.Property>
  @observable theorems: Collection<T.Id, T.Theorem>
  @observable traits: Traits
  @observable version: string

  apollo: ApolloClient

  constructor(client?: ApolloClient) {
    this.spaces = new Collection()
    this.properties = new Collection()
    this.theorems = new Collection()
    this.traits = new Traits(this.spaces, this.properties)

    this.apollo = client || (new Client()).apollo
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

  traitsBySpace(spaceId: T.Id): I.List<T.Trait> {
    return I.List()
  }

  hasProof(trait: T.Trait) {
    return false
  }

  currentUser(): { name: string } | undefined {
    return undefined
  }

  loadView(query: any) {
    this.apollo.query({ query }).then(response => {
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
}

export default new Store()