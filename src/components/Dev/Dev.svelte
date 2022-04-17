<script lang="ts">
  import Build from './Build.svelte'
  import Data from './Data.svelte'
  import Errors from './Errors.svelte'
  import Fetch from './Fetch.svelte'
  import { Col, Row } from '../Layout'

  import type { Dispatch } from '../../actions'
  import type { Handler } from '../../errors'
  import { getStore } from '../../context'

  export let dispatch: Dispatch
  export let handler: Handler

  const store = getStore()
</script>

<Row>
  <Col>
    <h3>Data Bundle</h3>
    <Fetch store={$store} {dispatch} {handler} />
  </Col>
  <Col>
    <h3>Derivations</h3>
    <Data store={$store} />
  </Col>
</Row>
<Row>
  <Col>
    <h3>Build</h3>
    <Build />
  </Col>
  <Col>
    <h3>Errors</h3>
    <Errors />
  </Col>
</Row>
