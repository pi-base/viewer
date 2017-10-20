import * as React from 'react'
import { graphql, gql } from 'react-apollo'
import * as I from 'immutable'

import { view, updateView, createProperty } from '../graph'

import { mobxStore } from '../store'

const Container = ({ children, viewer }) => {
  viewer.properties.forEach(p => {
    mobxStore.properties.add({
      uid: p.uid,
      name: p.name,
      description: p.description
    })
  })
  return children
}

export default view(`
  properties {
    uid
    name
    description
  }
`)(Container)