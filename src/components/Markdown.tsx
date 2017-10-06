import * as React from 'react'

import { markdown } from 'pi-base-core'

const rawMarkup = (text: string) => {
  return { __html: markdown(text) }
}

const Markdown = ({ text }: { text: string }) => {
  if (!text) { return <div className="markdown"/> }

  return <div className="markdown" dangerouslySetInnerHTML={rawMarkup(text)}/>
}

export default Markdown
