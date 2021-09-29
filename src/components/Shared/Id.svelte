<script lang="ts">
  import { Link } from 'svelte-routing'
  import { trim } from '@pi-base/core/lib/Id'
  import { resolveId } from '../../paths'

  export let value: string
</script>

<Link to={resolveId(value)}>
  {trim(value)}
</Link>
