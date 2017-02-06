// TODO: this should be .pegjs with appropriate build tooling,
//       but I'm not sure how to get that to play nice with
//       the test environment
import parser from './formula/parser.js'

export const PARSED_TEXT             = 'PARSED_TEXT'
export const NORMALIZED_PROPERTY_IDS = 'NORMALIZED_PROPERTY_IDS'
export const NORMALIZED_TEXT         = 'NORMALIZED_TEXT'

class Formula {
    constructor(subs) { this.subs = subs }

    map(f) {
        return new this.constructor(this.subs.map(sub => sub.map(f)))
    }

    mapProperty(f) {
        return this.map(({ property, value }) => ({
            property: f(property),
            value:    value
        }))
    }
}

export class Conjunction extends Formula {
    get and() { return this.subs }

    toJSON() {
        return { and: this.subs.map(f => f.toJSON()) }
    }

    check(pred) {
      for (let sub of this.subs) {
        if (sub.check(pred) === false) { return false }
      }
      return true
    }
}

class Disjunction extends Formula {
    get or() { return this.subs }

    toJSON() {
        return { or: this.subs.map(f => f.toJSON()) }
    }

    check(pred) {
      for (let sub of this.subs) {
        if (sub.check(pred) === true) { return true }
      }
      return false
    }
}

class Atom extends Formula {
    constructor({property, value}) {
        super()
        this.property = property
        this.value = value
    }

    map(f) {
        return new this.constructor(f({property: this.property, value: this.value}))
    }

    toJSON() {
        return { property: this.property, value: this.value }
    }

    check(pred) {
      return pred(this.property, this.value)
    }
}

const fromJSON = (json) => {
    if (json.and) {
        return new Conjunction(json.and.map(fromJSON))
    } else if (json.or) {
        return new Disjunction(json.or.map(fromJSON))
    } else {
        return new Atom(json)
    }
}

export function negate(f) {
    if (f.and) {
        return new Disjunction(f.subs.map(sf => negate(sf)))
    } else if (f.or) {
        return new Conjunction(f.subs.map(sf => negate(sf)))
    } else {
        return new Atom({ property: f.property, value: !f.value })
    }
}

export function parse(q) {
    let parsed

    try {
        parsed = parser.parse(q)
    } catch (e) {
        if (q && q.startsWith('(')) {
            return null
        } else {
            return parse('(' + q + ')')
        }
    }

    let formula = fromJSON(parsed)
    formula.property_type = PARSED_TEXT
    return formula
}

export function map(formula, func) {
    if (!formula) { return formula }

    if (formula.and) {
        return { and: formula.and.map(sf => map(sf, func)) }
    } else if (formula.or) {
        return { or: formula.or.map(sf => map(sf, func)) }
    } else {
        return { property: func(formula.property), value: formula.value }
    }
}
