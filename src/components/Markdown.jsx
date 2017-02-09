import React from 'react'
import marked from 'marked'

const rawMarkup = (text) => {
    return { __html: marked(text, {sanitize: true}) }
}

const Markdown = ({ text }) => {
    if (text) {
        return <div className="markdown" dangerouslySetInnerHTML={rawMarkup(text)}/>
    } else {
        return <div className="markdown"/>
    }
}

export default Markdown
