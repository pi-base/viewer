function gather(nodes: any[], to: number) {
  let length = 0
  let acc = []

  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i]

    if (node.type === 'text') {
      if (node.value.length + length >= to) {
        const fragment =
          node.value.slice(0, to - length - node.value.length) + '...'
        acc.push({ ...node, value: fragment })
        return acc
      } else {
        acc.push(node)
        length = length + node.value.length + 1
      }
    } else {
      if (length + 3 >= to) {
        acc.push(node)
        acc.push({ type: 'text', value: '...' })
        return acc
      } else {
        acc.push(node)
        length = length + 3
      }
    }
  }

  return acc
}

export function truncate(this: any, to: number = 100) {
  return function transformer(tree: any) {
    const node = tree.children[0]
    return { ...node, children: gather(node.children, to) }
  }
}
