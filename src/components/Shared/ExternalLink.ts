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
      const { kind, name } = parsed
      this.innerHTML = `${kind} ${name}`
    }
  }
}

function parse(citation: string) {
  const [kind, id] = citation.split(':', 2)
  if (!kind || !id) {
    return null
  }

  return render({ kind, id })
}

export function render({
  kind,
  id,
  name,
}: {
  kind: string
  id: string
  name?: string
}) {
  switch (kind.toLowerCase()) {
    case 'doi':
      return {
        href: `https://doi.org/${id}`,
        name: name || `DOI ${id}`,
      }
    case 'mr':
      return {
        href: `https://mathscinet.ams.org/mathscinet-getitem?mr=${id}`,
        name: name || `${id}`,
      }
    case 'wikipedia':
      return {
        href: `https://en.wikipedia.org/wiki/${id}`,
        name: name || `Wikipedia ${id}`,
      }
    case 'mathse':
      return {
        href: `https://math.stackexchange.com/questions/${id}`,
        name: name || `Math StackExchange ${id}`,
      }
    case 'mo':
      return {
        href: `https://mathoverflow.net/questions/${id}`,
        name: name || `MathOverflow ${id}`,
      }
  }

  return { kind, name: name || id }
}
