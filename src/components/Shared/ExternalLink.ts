export class ExternalLink extends HTMLElement {
  connectedCallback() {
    const citation = this.getAttribute('citation')
    if (!citation) {
      this.innerHTML = `<code>Citation not found</code>`
      return
    }

    const parsed = parse(citation)
    if (!parsed) {
      this.innerHTML = `<code>Could not parse citation: ${citation}</code>`
    } else if ('href' in parsed) {
      const { name, href } = parsed
      this.innerHTML = `<a href="${href}">${name}</a>`
    } else {
      const { kind, id } = parsed
      this.innerHTML = `${kind} ${id}`
    }
  }
}

function parse(citation: string) {
  const [kind, id] = citation.split(':', 2)
  if (!kind || !id) {
    return null
  }

  switch (kind.toLowerCase()) {
    case 'doi':
      return {
        href: `https://doi.org/${id}`,
        name: `DOI ${id}`,
      }
    case 'mr':
      return {
        href: `https://mathscinet.ams.org/mathscinet-getitem?mr=${id}`,
        name: `${id}`,
      }
    case 'wikipedia':
      return {
        href: `https://en.wikipedia.org/wiki/${id}`,
        name: `Wikipedia ${id}`,
      }
    case 'mathse':
      return {
        href: `https://math.stackexchange.com/questions/${id}`,
        name: `Math StackExchange ${id}`,
      }
    case 'mo':
      return {
        href: `https://mathoverflow.net/questions/${id}`,
        name: `MathOverflow ${id}`,
      }
  }

  return { kind, id }
}
