import type { Code, Construct, Token, Tokenizer } from 'micromark-util-types'

/**
 * Extends the Markdown parser, adding support for
 *
 * - external links - {{doi:123}}
 * - internal links - {S123}
 *
 * See https://github.com/micromark/micromark#creating-a-micromark-extension
 */
const cr = -5
const lf = -4
const crlf = -3
const eof = null
const backslash = 92
const leftBrace = 123
const rightBrace = 125

const link = 'link'
const linkString = 'linkString'
const linkMarker = 'linkMarker'
const chunkString = 'chunkString'

const tokenize: Tokenizer = (effects, ok, nok) => {
  let sizeOpen = 0

  return start

  function start(code: Code) {
    effects.enter(link)
    effects.enter(linkMarker)
    return open(code)
  }

  function open(code: Code) {
    if (code === leftBrace) {
      sizeOpen++
      effects.consume(code)
      return open
    }

    effects.exit(linkMarker)
    effects.enter(linkString, { external: sizeOpen > 1 })
    effects.enter(chunkString, { contentType: 'string' })
    return inside(code)
  }

  function close(code: Code) {
    if (code === rightBrace) {
      sizeOpen--
      effects.consume(code)
      return close
    }

    if (sizeOpen === 0) {
      effects.exit(linkMarker)
      effects.exit(link)
      return ok(code)
    }

    return nok(code)
  }

  function inside(code: Code) {
    if (code === cr || code === lf || code === crlf || code === eof) {
      return nok(code)
    }

    if (code === backslash) {
      effects.consume(code)
      return insideEscape
    }

    if (code === rightBrace) {
      effects.exit(chunkString)
      effects.exit(linkString)
      effects.enter(linkMarker)
      return close(code)
    }

    effects.consume(code)
    return inside
  }

  function insideEscape(code: Code) {
    if (code === 92 || code === rightBrace) {
      effects.consume(code)
      return inside
    }

    return inside(code)
  }
}

const construct: Construct = {
  name: 'links',
  tokenize,
}

const syntax = {
  text: {
    [leftBrace]: construct,
  },
}

function enterLinkString(token: Token) {
  this.enter(
    {
      type: 'citation',
      data: {
        hName: (token as any).external ? 'external-link' : 'internal-link',
        hProperties: {},
      },
    },
    token
  )
  this.buffer()
}

function exitLinkString(token: Token) {
  const id = this.resume()
  const node = this.exit(token)

  node.value = id
  node.data.hProperties.citation = id
}

const fromMarkdown = {
  enter: {
    linkString: enterLinkString,
  },
  exit: {
    linkString: exitLinkString,
  },
}

export function links() {
  const data = this.data()

  add('micromarkExtensions', syntax)
  add('fromMarkdownExtensions', fromMarkdown)

  function add(field: string, value: unknown) {
    const list = data[field] ? data[field] : (data[field] = [])

    list.push(value)
  }
}
