import * as I from 'immutable'

import * as F from './Formula'
import PropertyFinder from './PropertyFinder'

const fragment = (str) => {
  if (!str) {
    return ''
  }
  const parts = str.split(/[~+&|\(\)]/)
  return parts[parts.length - 1].trim()
}

class Universe {
  constructor(spaces, properties, traits) {
    this.spaces = new PropertyFinder(spaces)
    this.properties = new PropertyFinder(properties)
    this.traits = I.Map(traits)
  }

  parseFormula(q) {
    if (!q) {
      return
    }
    const text = F.parse(q)
    if (!text) {
      return
    }
    return text.mapProperty(p => this.properties.resolve(p))
  }

  searchByFormula(scope, f) {
    scope = I.List(scope)

    if (!f) {
      return scope
    }

    const spaceIds = I.Set.fromKeys(this.traits.filter((traits) => {
      return f.check((prop, target) => {
        const t = traits[prop.id]
        return t && t.value === target
      })
    }))

    return scope.filter(s => spaceIds.includes(s.uid))
  }

  propertySuggestions(q) {
    if (!q) {
      return []
    }
    return this.properties.suggestionsFor(fragment(q))
  }

  spaceTraits(space) {
    const traits = this.traits.get(space.uid)

    return I.Map(traits).map((trait, propId) => {
      return {
        property: this.properties.find(propId),
        value: trait.value,
        deduced: trait.deduced
      }
    }).valueSeq()
  }
}

export default Universe
