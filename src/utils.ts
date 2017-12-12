export function union<P>(...sets: Set<P>[]): Set<P> {
  return sets.reduce(
    (acc, set) => {
      set.forEach(p => acc.add(p))
      return acc
    },
    new Set()
  )
}

export const by = key => (a, b) => {
  if (a[key] >= b[key]) {
    return 1
  } else if (a[key] === b[key]) {
    return 0
  } else {
    return -1
  }
}