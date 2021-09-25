import React from 'react'

import { useStore } from '../../models'
import { default as S } from '../../models/Store'
import Detail from './Detail.svelte'
import List from './List.svelte'
import { Svelte } from '../Svelte'

export type Tab = 'theorems' | 'spaces' | 'references'

export function Property({ id, tab = 'theorems' }: { id: string; tab?: Tab }) {
  const property = S.property(useStore(), id)
  if (property) {
    return <Svelte component={Detail} props={{ property, tab }} />
  } else {
    // TODO
    return null
  }
}

export function Properties() {
  const properties = S.properties(useStore())
  return <Svelte component={List} props={{ properties }} />
}
