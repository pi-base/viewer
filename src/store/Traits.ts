import * as I from 'immutable'
import { action, computed, observable } from 'mobx'

import Collection from './Collection'
import * as T from '../types'

class Traits {
  @observable map: Map<T.Id, Map<T.Id, boolean>>

  spaces: Collection<T.Id, T.Space>
  properties: Collection<T.Id, T.Property>

  constructor(spaces: Collection<T.Id, T.Space>, properties: Collection<T.Id, T.Property>) {
    this.spaces = spaces
    this.properties = properties
    this.map = new Map()
  }

  @action add(trait: { space: T.Id, property: T.Id, value: boolean }) {
    const { space, property, value } = trait
    if (!this.map.has(space)) {
      this.map.set(space, new Map())
    }
    this.map.get(space)!.set(property, value)
  }

  @computed get values(): I.Map<T.Id, I.Map<T.Id, boolean>> {
    return I.fromJS(this.map)
  }

  check(space: T.Id, property: T.Id) {
    const traits = this.map.get(space)
    if (!traits) { return undefined }
    return traits.get(property)
  }

  forSpace(space: T.Id): I.List<T.Trait> {
    const traits = this.map.get(space) || new Map()
    const result = I.List<T.Trait>().withMutations(l => {
      traits.forEach((value, property) => {
        l.push({
          space: this.spaces.find(space),
          property: this.properties.find(property),
          value
        } as any) // FIXME
      })
    })
    return result
  }
}

export default Traits
