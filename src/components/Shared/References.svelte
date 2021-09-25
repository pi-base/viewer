<script lang="ts">
  import { Ref } from '@pi-base/core'
  import { tag } from '@pi-base/core/lib/Ref'
  import { render as link } from './ExternalLink'

  export let refs: Ref[] = []

  $: links = refs.map((r) => link(tag(r)))
</script>

<ul>
  {#each links as ref}
    {#if ref.href}
      <li>
        <a href={ref.href}>
          {ref.name}
        </a>
      </li>
      <!-- TODO: else -->
    {/if}
  {/each}
</ul>
