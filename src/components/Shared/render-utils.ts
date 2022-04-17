import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import { links } from './links'
import { truncate } from './Display'

const unnest = () => {
  return function transformer(tree) {
    if (
      tree &&
      tree.children.length === 1 &&
      tree.children[0].type === 'paragraph' &&
      tree.children[0].children.length === 1
    ) {
      return {
        ...tree,
        children: tree.children[0].children,
      }
    }

    return tree
  }
}

function parser() {
  return unified().use([
    remarkParse,
    links,
    unnest,
    remarkMath,
    remarkRehype,
    rehypeKatex,
    rehypeStringify,
  ])
}

const full = parser()
const truncated = parser().use([truncate])

export async function render(body: string, truncate: boolean = false) {
  const parser = truncate ? truncated : full

  const file = await parser.process(body)

  return String(file)
}
