/* global it expect */
import {
  parse,
  negate,
} from './Formula'

it('can parse a simple formula', () => {
  expect(
    parse('Compact').toJSON()
  ).toEqual({
    property: 'Compact',
    value: true
  })
})

it('handles whitespace', () => {
  expect(
    parse('   \t   Second Countable \n ').toJSON()
  ).toEqual({
    property: 'Second Countable',
    value: true
  })
})

it('can negate properties', () => {
  expect(
    parse('not compact').toJSON()
  ).toEqual({
    property: 'compact',
    value: false
  })
})

it('can parse conjunctions', () => {
  expect(
    parse('compact + connected + ~t_2').toJSON()
  ).toEqual({
    and: [{
        property: 'compact',
        value: true
      },
      {
        property: 'connected',
        value: true
      },
      {
        property: 't_2',
        value: false
      }
    ]
  })
})

it('can parse nested formulae', () => {
  expect(
    parse('compact + (connected || not second countable) + ~first countable').toJSON()
  ).toEqual({
    and: [{
        property: 'compact',
        value: true
      },
      {
        or: [{
            property: 'connected',
            value: true
          },
          {
            property: 'second countable',
            value: false
          }
        ]
      },
      {
        property: 'first countable',
        value: false
      }
    ]
  })
})

it('can map over formulae', () => {
  const parsed = parse('compact + (connected || not second countable) + ~first countable')
  const mapped = parsed.map(atom => ({
    property: atom.property.length,
    value: !atom.value
  })).toJSON()

  expect(mapped).toEqual({
    and: [{
        property: 7,
        value: false
      },
      {
        or: [{
            property: 9,
            value: false
          },
          {
            property: 16,
            value: true
          }
        ]
      },
      {
        property: 15,
        value: true
      }
    ]
  })
})

it('can negate formulae', () => {
  const parsed = parse('compact + (connected || not second countable) + ~first countable')
  const mapped = negate(parsed).toJSON()

  expect(mapped).toEqual({
    or: [{
        property: "compact",
        value: false
      },
      {
        and: [{
            property: "connected",
            value: false
          },
          {
            property: "second countable",
            value: true
          }
        ]
      },
      {
        property: "first countable",
        value: true
      }
    ]
  })
})
