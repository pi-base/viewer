<script lang="ts">
  import { trim } from '@pi-base/core/lib/Id'
  import { resolveId } from '../../paths'

  export let value: string
</script>

<a href={resolveId(value)}>
  {trim(value)}
</a>
