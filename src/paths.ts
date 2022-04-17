import type { Property, Space, Theorem, Trait } from './models'

export const property = (property: Property) => `/properties/${property.uid}`

export const space = (space: Space) => `/spaces/${space.uid}`

export const theorem = (theorem: Theorem) => `/theorems/${theorem.uid}`

export const trait = ({
  space,
  property,
}: Pick<Trait, 'space' | 'property'>) => {
  return `/spaces/${space}/properties/${property}`
}

const dataRepo = `https://github.com/pi-base/data`
const viewerRepo = `https://github.com/pi-base/viewer`

export function contributeExample() {
  return `${dataRepo}/new/master`
}

export function resolveId(id: string) {
  switch (id.toLowerCase()[0]) {
    case 't':
    case 'i':
      return `/theorems/${id}`
    case 'p':
      return `/properties/${id}`
    case 's':
      return `/spaces/${id}`
    default:
      // TODO
      throw new Error(`Could not resolve id=${id}`)
  }
}

export function viewerIssues({ body, title }: { body: string; title: string }) {
  return `${viewerRepo}/issues/new?title=${title}&body=${body}`
}

export function contributingGuide() {
  return `${dataRepo}/blob/master/CONTRIBUTING.md`
}

export default {
  contributeExample,
  contributingGuide,
  property,
  space,
  theorem,
  trait,
  viewerIssues,
}
