import { ApolloClient } from 'apollo-client'

import { Client } from './graph/client'

import { action, computed, observable, reaction } from 'mobx'
import { Finder } from './models/Finder'

import Collection from './store/Collection'
import Proofs from './store/Proofs'
import Traits from './store/Traits'
import User from './store/User'

import * as I from 'immutable'
import * as T from './types'
import * as L from './logic'
import * as F from './models/Formula'
import * as Q from './queries'

export interface ParseError {
  kind: 'parseError'
  message: T.PropertyId[]
}

export class Store {
  @observable branch: T.Branch
  @observable version?: string

  spaces: Collection<T.Id, T.Space>
  properties: Collection<T.Id, T.Property>
  theorems: Collection<T.Id, T.Theorem>
  traits: Traits

  client: Client
  user: User

  proofs: Proofs

  constructor(client?: Client) {
    this.branch = 'audited'

    this.reset()

    this.client = client || new Client()
    this.user = new User()
  }

  login(token: T.Token) {
    return this.client.login(token)
  }

  reset() {
    this.spaces = new Collection()
    this.properties = new Collection()
    this.theorems = new Collection()
    this.traits = new Traits(this.spaces, this.properties)

    this.proofs = new Proofs()
  }

  @computed get propertyFinder(): Finder<T.Property> {
    return new Finder(this.properties.all)
  }

  @computed get spaceFinder(): Finder<T.Space> {
    return new Finder(this.spaces.all)
  }

  parseFormula(text: string): F.Formula<T.Property> | ParseError {
    const parsed = F.parse(text)
    if (!parsed) { return { kind: 'parseError', message: [] } }

    let errors: T.PropertyId[] = []

    const result = F.mapProperty(
      id => {
        const property = this.propertyFinder.find(id)
        if (!property) { errors.push(id) }
        return property as T.Property
      },
      parsed
    )

    if (errors.length > 0) {
      return { kind: 'parseError', message: errors }
    } else {
      return result
    }
  }

  search({ text, formula }: { text?: string, formula?: F.Formula<T.PropertyId> }) {
    let spaces = this.spaces.all
    if (formula) {
      spaces = spaces.filter((s: T.Space) => {
        const ts = this.traits.map.get(s.uid)
        if (!ts) { return false }
        return F.evaluate(formula, I.Map(ts)) === true
      }).toList()
    }
    if (text) {
      spaces = I.List(this.spaceFinder.search(text)) // FIXME: might have results not in `spaces`
    }
    return spaces
  }

  counterexamples(theorem: T.Theorem) {
    const formula = F.and(F.negate(theorem.if), theorem.then)
    return this.search({ formula })
  }

  theoremProperties(t: T.Theorem): I.List<T.Property> {
    const ids = F.properties(t.if).union(F.properties(t.then))
    const props: T.Property[] = []
    ids.forEach(uid => {
      const prop = this.properties.find(uid!)
      if (prop) { props.push(prop) } // FIXME: else?
    })
    return I.List(props)
  }

  loadView(query: any) {
    return this.client.query({ query }).then(response => {
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

  @action changeBranch(branch: T.Branch) {
    this.branch = branch
    this.version = undefined
    this.reset()
  }
}

export default new Store()