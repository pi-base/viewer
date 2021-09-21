import * as React from 'react'
import { getContext, SvelteComponentTyped } from 'svelte'
import { StoreContext } from '../models/Store/context'
import { Store } from '../models/Store/state'

type SvelteComponent<P> = {
  new (props: {
    target: HTMLElement
    props: P
    context: Map<string, unknown>
  }): SvelteComponentTyped<P>
}

export type SvelteProps<Props = {}> = {
  component: SvelteComponent<Props>
  props: Props
}

export function getStore(): Store {
  return getContext('store')
}

export class Svelte<Props> extends React.Component<SvelteProps<Props>> {
  private ref: React.RefObject<HTMLDivElement>
  private component: SvelteComponentTyped<Props> | undefined

  constructor(props: SvelteProps<Props>) {
    super(props)

    this.ref = React.createRef()
  }

  componentDidMount() {
    if (!this.ref.current) {
      return
    }

    const { component, props } = this.props

    const store = this.context

    this.component = new component({
      target: this.ref.current,
      props: props,
      context: new Map([['store', store]]),
    })
  }

  componentDidUpdate() {
    const { props } = this.props

    this.component?.$set(props)
  }

  componentWillUnmount() {
    this.component?.$destroy()
  }

  render() {
    return <div style={{ display: 'contents' }} ref={this.ref}></div>
  }
}

Svelte.contextType = StoreContext
