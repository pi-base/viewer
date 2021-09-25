import React from 'react'

import { useStore } from '../../models'
import { default as S } from '../../models/Store'
import Detail from './Detail.svelte'
import { Svelte } from '../Svelte'
import List from './List.svelte'

export function Theorem({
  id,
  tab,
}: {
  id: string
  tab?: 'converse' | 'references'
}) {
  const theorem = S.theorem(useStore(), id)
  if (theorem) {
    return <Svelte component={Detail} props={{ theorem, tab }} />
  } else {
    // TODO
    return null
  }
}

export function Theorems() {
  const theorems = S.theorems(useStore())
  return <Svelte component={List} props={{ theorems }} />
}
