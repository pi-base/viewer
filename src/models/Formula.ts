/* tslint:disable switch-default */
import * as Parser from './formula/parser.js'

import * as T from '../types'
import { union } from '../utils'

interface Atom<P> {
  kind: 'atom'
  property: P
  value: boolean
}

interface And<P> {
  kind: 'and'
  subs: Formula<P>[]
}

interface Or<P> {
  kind: 'or'
  subs: Formula<P>[]
}

export type Formula<P> = And<P> | Or<P> | Atom<P>

export function map<P, Q>(func: (p: Atom<P>) => Atom<Q>, formula: Formula<P>): Formula<Q> {
  switch (formula.kind) {
    case 'atom':
      return func(formula)
    default:
      return {
        ...formula,
        subs: formula.subs.map(sub => map(func, sub!))
      }
  }
}

export function mapProperty<P, Q>(func: (p: P) => Q, formula: Formula<P>): Formula<Q> {
  function mapAtom(a: Atom<P>): Atom<Q> {
    return { ...a, property: func(a.property) }
  }
  return map<P, Q>(mapAtom, formula)
}

export function compact<P>(f: Formula<P | undefined>): Formula<P> | undefined {
  try {
    return mapProperty(
      p => {
        if (p) { return p }
        throw undefined
      },
      f
    )
  } catch (e) {
    return
  }
}

export function toString(f: Formula<T.Property>): string {
  switch (f.kind) {
    case 'atom':
      const name = f.property.name
      return f.value ? name : '~' + name
    case 'and':
      return '(' + f.subs.map(sf => toString(sf!)).join(' + ') + ')'
    case 'or':
      return '(' + f.subs.map(sf => toString(sf!)).join(' + ') + ')'
  }
}

export function negate<P>(f: Formula<P>): Formula<P> {
  switch (f.kind) {
    case 'atom':
      return { kind: 'atom', property: f.property, value: !f.value }
    case 'and':
      return { kind: 'or', subs: f.subs.map(negate) }
    case 'or':
      return { kind: 'and', subs: f.subs.map(negate) }
  }
}

export function properties<P>(f: Formula<P>): Set<P> {
  switch (f.kind) {
    case 'atom':
      return new Set([f.property])
    default:
      return union(...f.subs.map(properties))
  }
}

export function evaluate(f: Formula<T.Id>, traits: Map<T.Id, boolean>): boolean | undefined {
  let result: boolean | undefined

  switch (f.kind) {
    case 'atom':
      if (traits.has(f.property)) {
        return traits.get(f.property) === f.value
      }
      return undefined
    case 'and':
      result = true // by default
      f.subs.forEach(sub => {
        const sv = evaluate(sub!, traits)
        if (sv === false) { // definitely false
          result = false // TODO: break early
        }
        if (result && sv === undefined) { // maybe false
          result = undefined
        }
      })
      return result
    case 'or':
      result = false // by default
      f.subs.forEach(sub => {
        const sv = evaluate(sub!, traits)
        if (sv === true) { // definitely true
          result = true // TODO: break early
        }
        if (result === false && sv === undefined) { // maybe true
          result = undefined
        }
      })
      return result
  }
}

// tslint:disable-next-line no-any
export function fromJSON(json: any): Formula<string> {
  if (json.and) {
    return and<string>(...json.and.map(fromJSON))
  } else if (json.or) {
    return or<string>(...json.or.map(fromJSON))
  } else if (json.property) {
    return atom<string>(json.property, json.value)
  } else {
    const property = Object.keys(json)[0]
    return atom<string>(property, json[property])
  }
}

export function toJSON(f: Formula<string>) {
  switch (f.kind) {
    case 'atom':
      const result = {}
      result[f.property] = f.value
      return result
    case 'and':
      return { and: f.subs.map(sf => toJSON(sf)) }
    case 'or':
      return { or: f.subs.map(sf => toJSON(sf)) }
  }
}

export function parse(q: string): Formula<string> | undefined {
  if (!q) { return }

  let parsed
  try {
    parsed = Parser.parse(q)
  } catch (e) {
    if (q && q.startsWith('(')) {
      return
    } else {
      return parse('(' + q + ')')
    }
  }

  return fromJSON(parsed)
}

export function and<P>(...subs: Formula<P>[]): And<P> {
  return { kind: 'and', subs: subs }
}

export function or<P>(...subs: Formula<P>[]): Or<P> {
  return { kind: 'or', subs: subs }
}

export function atom<P>(p: P, v: boolean): Atom<P> {
  return { kind: 'atom', property: p, value: v }
}
