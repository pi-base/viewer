import katex from 'katex'

export class InlineMath extends HTMLElement {
  connectedCallback() {
    const formula = this.getAttribute('formula')
    if (!formula) {
      return
    }

    katex.render(formula, this, { throwOnError: false })
  }
}
