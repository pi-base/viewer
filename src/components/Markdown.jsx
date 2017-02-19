import React from 'react'

import showdown from 'showdown'
const converter = new showdown.Converter()
converter.setFlavor('github')

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
