<script lang="ts">
  import Build from './Dev/Build.svelte'
  import Data from './Dev/Data.svelte'
  import Errors from './Dev/Errors.svelte'
  import Fetch from './Dev/Fetch.svelte'
  import { Col, Row } from './Layout'

  import { Dispatch } from '../actions'
  import { Handler } from '../errors'
  import { getStore } from './Svelte'

  export let dispatch: Dispatch
  export let handler: Handler

  const store = getStore()
</script>

<Row>
  <Col>
    <h3>Data Bundle</h3>
    <Fetch {store} {dispatch} {handler} />
  </Col>
  <Col>
    <Data {store} />
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
