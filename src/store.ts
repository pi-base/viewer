import { ApolloClient } from 'apollo-client'

import { Client } from './graph/client'

import { action, computed, observable, reaction } from 'mobx'
import { Finder } from './models/PropertyFinder'

import Collection from './store/Collection'
import Proofs from './store/Proofs'
import Traits from './store/Traits'
import User from './store/User'

import * as I from 'immutable'
import * as T from './types'
import * as L from './logic'
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

    reaction(
      () => this.traits.values,
      () => this.checkAll()
    )
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

      const traits = s.traits || []
      traits.forEach(t => {
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

  @action checkAll() {
    this.spaces.all.forEach(space => {
      setTimeout(
        () => {
          const traits = this.traits.map.get(space!.uid)
          if (!traits) { return }

          const recordProof = (propertyId, proof) => this.proofs.record(
            space!.uid, propertyId, proof
          )

          this.theorems.all.forEach(theorem => {
            L.apply({ theorem: theorem!, traits, recordProof })
          })
        },
        0
      )
    })
  }
}

export default new Store()