import React from 'react'

import { useStore } from '../../models'
import { default as S } from '../../models/Store'
import Detail from './Detail.svelte'
import Search from './Search.svelte'
import { Svelte } from '../Svelte'

export type Tab = 'theorems' | 'properties' | 'references'

export function Space({ id, tab = 'theorems' }: { id: string; tab?: Tab }) {
  const space = S.space(useStore(), id)
  if (space) {
    return <Svelte component={Detail} props={{ space, tab }} />
  } else {
    // TODO
    return null
  }
}

export function Spaces() {
  return <Svelte component={Search} props={{}} />
}
