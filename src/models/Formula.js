// TODO: this should be .pegjs with appropriate build tooling,
//       but I'm not sure how to get that to play nice with
//       the test environment
import parser from './formula/parser.js'
import * as I from 'immutable'

export class Formula {
  constructor(subs) {
    this.subs = subs
  }

  map(f) {
    return new this.constructor(this.subs.map(sub => sub.map(f)))
  }

  mapProperty(f) {
    return this.map(({
      property,
      value
    }) => ({
      property: f(property),
      value: value
    }))
  }
}

class Conjunction extends Formula {
  get and() {
    return this.subs
  }

  toJSON() {
    return {
      and: this.subs.map(f => f.toJSON())
    }
  }

  evaluate(traits) {
    let result = true // by default
    for (let sub of this.subs) {
      const sv = sub.evaluate(traits)
      if (sv === false) { // definitely false
        return false
      }
      if (sv === undefined) { // maybe false
        result = undefined
      }
    }
    return result
  }

  matches(traits) {
    for (let sub of this.subs) {
      const sv = sub.matches(traits)
      if (sv === false) {
        return false
      }
    }
    return true
  }
}

class Disjunction extends Formula {
  get or() {
    return this.subs
  }

  toJSON() {
    return {
      or: this.subs.map(f => f.toJSON())
    }
  }

  evaluate(traits) {
    let result = false
    for (let sub of this.subs) {
      const sv = sub.evaluate(traits)
      if (sv === true) { // definitely true
        return true
      }
      if (sv === undefined) { // maybe true
        result = undefined
      }
    }
    return result
  }

  matches(traits) {
    for (let sub of this.subs) {
      const sv = sub.matches(traits)
      if (sv === true) {
        return true
      }
    }
    return false
  }
}

class Atom extends Formula {
  constructor({
    property,
    value
  }) {
    super()
    if (typeof(property) === 'object') {
      this.property = I.Map(property)
    } else {
      this.property = property
    }
    this.value = value
  }

  map(f) {
    return new this.constructor(f({
      property: this.property,
      value: this.value
    }))
  }

  toJSON() {
    return {
      property: this.property,
      value: this.value
    }
  }

  evaluate(traits) {
    const trait = traits.get(this.property.get('uid'))
    return trait ? trait.get('value') === this.value : undefined
  }

  matches(traits) {
    const trait = traits.get(this.property.get('uid'))
    if (trait === undefined) {
      return this.value === undefined
    } else {
      return this.value === trait.get('value')
    }
  }
}

export const fromJSON = (json) => {
  if (json.and) {
    return new Conjunction(json.and.map(fromJSON))
  } else if (json.or) {
    return new Disjunction(json.or.map(fromJSON))
  } else {
    return new Atom(json)
  }
}

export const negate = (f) => {
  if (f.and) {
    return new Disjunction(f.subs.map(sf => negate(sf)))
  } else if (f.or) {
    return new Conjunction(f.subs.map(sf => negate(sf)))
  } else {
    return new Atom({
      property: f.property,
      value: !f.value
    })
  }
}

export const parse = (q) => {
  if (!q) {
    return
  }

  let parsed
  try {
    parsed = parser.parse(q)
  } catch (e) {
    if (q && q.startsWith('(')) {
      return
    } else {
      return parse('(' + q + ')')
    }
  }

  return fromJSON(parsed)
}

export const map = (formula, func) => {
  if (!formula) {
    return
  }

  if (formula.and) {
    return new Conjunction(formula.and.map(sf => map(sf, func)))
  } else if (formula.or) {
    return new Disjunction(formula.or.map(sf => map(sf, func)))
  } else if (formula.property) {
    return new Atom({
      property: func(formula.property),
      value: formula.value
    })
  } else {
    for (let prop in formula) {
      // { prop: value } -- really only want the first one
      if (Object.prototype.hasOwnProperty.call(formula, prop)) {
        return new Atom({
          property: func(prop),
          value: formula[prop]
        })
      }
    }
  }
}

export const and = (subs) => new Conjunction(subs)
export const or = (subs) => new Disjunction(subs)
export const atom = (p, v) => new Atom({
  property: p,
  value: v
})

export const withProperty = (f) =>
  (a) => atom(f(a.property), a.value)

export const properties = (f) => {
  if (!f) {
    return []
  }
  if (f.toJS) {
    f = f.toJS()
  }

  if (f.and) {
    return f.and.reduce((acc, sf) => {
      return acc.concat(properties(sf))
    }, [])
  } else if (f.or) {
    return f.or.reduce((acc, sf) => {
      return acc.concat(properties(sf))
    }, [])
  } else if (f.property) {
    return [f.property]
  } else {
    for (let prop in f) {
      // { prop: value } -- really only want the first one
      if (Object.prototype.hasOwnProperty.call(f, prop)) {
        return [prop]
      }
    }
  }
}
