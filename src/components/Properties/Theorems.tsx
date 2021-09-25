import React from 'react'

import { Property, useStore } from '../../models'
import { theoremsWithProperty } from '../../models/Store'
import Theorems from '../Theorems/SummaryList.svelte'
import { Svelte } from '../Svelte'

export default function ({ property }: { property: Property }) {
  const store = useStore()
  const theorems = theoremsWithProperty(store, property)

  return <Svelte component={Theorems} props={{ theorems }} />
}
