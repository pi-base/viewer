import React from 'react'

import showdown from 'showdown'

const escapeTeX = () => {
  const escape = (match) => {
    // Escape any markdown special characters
    return match.replace(/([\\`*_{}\[\]()#+-.!])/g, '\\$1')
  }

  return [
    {
      type: 'lang',
      regex: /\\\((.*?)\\\)/g, // Inside TeX delimiters
      replace: (_, s) => ('\\(' + escape(s) + '\\)')
    },
    {
      type: 'lang',
      regex: /¨D(.*?)¨D/g, // Showdown converts $ internally into ¨D
      replace: (_, s) => ('$' + escape(s) + '$')
    }
  ]
}

const converter = new showdown.Converter({extensions: [escapeTeX]})
// converter.setFlavor('github')

const rawMarkup = (text) => {
  return { __html: converter.makeHtml(text) }
}

const Markdown = ({ text }) => {
  if (text) {
    return <div className="markdown" dangerouslySetInnerHTML={rawMarkup(text)}/>
  } else {
    return <div className="markdown"/>
  }
}

export default Markdown
