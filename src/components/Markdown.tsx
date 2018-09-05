import * as React from 'react'

import CitationDisplay from './CitationDisplay'
import Tex from './Tex'
import parser from './Markdown/parser'

const parse = parser({
  components: {
    citation: CitationDisplay,
    inlineMath: ({ formula }) => (<Tex component="span">${formula}$</Tex>)
  }
})

const Markdown = ({ text }) => {
  if (!text) { return null }
  return parse.processSync(text).contents
}

export default Markdown
