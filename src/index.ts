import { enableMapSet } from 'immer'
import { InlineMath } from './components/Shared/InlineMath'
import { ExternalLink } from './components/Shared/ExternalLink'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import App from './App.svelte'
import * as Error from './errors'

enableMapSet()

customElements.define('inline-math', InlineMath)
customElements.define('external-link', ExternalLink)

const errorHandler: Error.Handler =
  process.env.NODE_ENV === 'production'
    ? Error.sentry(
        'https://0fa430dd1dc347e2a82c413d8e3acb75@o397472.ingest.sentry.io/5251960'
      )
    : Error.log()

const app = new App({
  target: document.getElementById('root')!,
  props: {
    handler: errorHandler,
  },
})

export default app
