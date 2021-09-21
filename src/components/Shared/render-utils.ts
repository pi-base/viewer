import { Processor } from 'unified'
import { Parser } from '@pi-base/core'
import { map } from 'unist-util-map'
import { toH } from 'hast-to-hyperscript'
import h from 'hyperscript'
import { truncate } from './Display'

function shim() {
  return function transformer(tree: any) {
    return map(tree, (node) => {
      switch (node.tagName) {
        case 'inlineMath':
          return {
            ...node,
            tagName: 'inline-math',
          }
        case 'citation':
          return {
            ...node,
            tagName: 'external-link',
          }
        case 'internalLink':
          // FIXME: these don't actually render, although many of the examples
          // in the repo appear to be data formatting / parsing errors
          return {
            ...node,
            tagName: 'internal-link',
          }
      }

      return node
    })
  }
}

export const fullParser = Parser().use(shim)
export const previewParser = Parser().use(shim).use(truncate)

export async function render(parser: Processor<unknown>, body: string) {
  const parsed = await parser.run(parser.parse(body))
  return toH(h, parsed)
}
