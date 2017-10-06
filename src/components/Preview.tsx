import * as React from 'react'

function Preview({ text }: { text: string }) {
  // TODO: split at word, TeX boundaries only
  const preview = text.split('\n')[0]
  return <div>{preview}</div>
}

export default Preview
