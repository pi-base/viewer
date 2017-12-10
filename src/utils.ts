export function union<P>(...sets: Set<P>[]): Set<P> {
  return sets.reduce(
    (acc, set) => {
      set.forEach(p => acc.add(p))
      return set
    },
    new Set()
  )
}