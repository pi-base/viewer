/* global it expect */
import * as F from './Formula'

const f = F.parse('compact + (connected || not second countable) + ~first countable')

it('has accessors', () => {
  expect(f.and[1].or[1].property).toEqual('second countable')
})

describe('parsing', () => {
  it('can parse a simple formula', () => {
    expect(
      F.parse('Compact')
    ).toEqual(
      F.atom('Compact', true)
    )
  })

  it('handles whitespace', () => {
    expect(
      F.parse('   \t   Second Countable \n ')
    ).toEqual(
      F.atom('Second Countable', true)
    )
  })

  it('can negate properties', () => {
    expect(
      F.parse('not compact')
    ).toEqual(
      F.atom('compact', false)
    )
  })

  it('can inserts parens', () => {
    expect(
      F.parse('compact + connected + ~t_2')
    ).toEqual(
      F.and(
        F.atom('compact', true),
        F.atom('connected', true),
        F.atom('t_2', false)
      )
    )
  })

  it('allows parens', () => {
    expect(F.parse('(foo + bar)')).toEqual(
      F.and(
        F.atom('foo', true),
        F.atom('bar', true)
      )
    )
  })

  it('handles errors with parens', () => {
    expect(F.parse('(some stuff + |)')).toBeUndefined()
  })

  it('can parse nested formulae', () => {
    expect(f).toEqual(
      F.and(
        F.atom('compact', true),
        F.or(
          F.atom('connected', true),
          F.atom('second countable', false)
        ),
        F.atom('first countable', false)
      )
    )
  })

  it('handles empty strings', () => {
    expect(F.parse()).toBeUndefined()
    expect(F.parse('')).toBeUndefined()
  })
})

describe('mapping', () => {
  it('can map over atoms', () => {
    expect(
      f.map(atom => ({
        property: atom.property.length,
        value: !atom.value
      }))
    ).toEqual(
      F.and(
        F.atom(7, false),
        F.or(
          F.atom(9, false),
          F.atom(16, true)
        ),
        F.atom(15, true)
      )
    )
  })

  it('accumulate property lists', () => {
    expect(f.properties()).toEqual(I.OrderedSet([
      'compact', 'connected', 'second countable', 'first countable'
    ]))
  })

  it('can negate', () => {
    expect(f.negate()).toEqual(
      F.or(
        F.atom('compact', false),
        F.and(
          F.atom('connected', false),
          F.atom('second countable', true)
        ),
        F.atom('first countable', true)
      )
    )
  })

  it('can map over properties', () => {
    expect(f.mapProperty(p => p[0])).toEqual(
      F.and(
        F.atom('c', true),
        F.or(
          F.atom('c', true),
          F.atom('s', false)
        ),
        F.atom('f', false)
      )
    )
  })
})

describe('evaluation', () => {
  const h = f.mapProperty(p => I.Map({
    uid: p
  }))

  it('can find a match', () => {
    const traits = I.fromJS({
      compact: {
        value: true
      },
      'second countable': {
        value: false
      },
      'first countable': {
        value: false
      }
    })
    expect(h.evaluate(traits)).toEqual(true)
  })

  it('can find a miss', () => {
    const traits = I.fromJS({
      compact: {
        value: true
      },
      'second countable': {
        value: false
      },
      'first countable': {
        value: true
      }
    })
    expect(h.evaluate(traits)).toEqual(false)
  })

  it('can be undefined', () => {
    const traits = I.fromJS({
      compact: {
        value: true
      },
      'second countable': {
        value: true
      },
      'first countable': {
        value: false
      }
    })
    expect(h.evaluate(traits)).toBeUndefined()
  })
})