<script lang="ts">
  export let setSearch: (q: string) => void

  const examples = [
    {
      title: 'All Non-Metric Continua',
      query: 'compact + connected + t_2 + ~metrizable',
    },
    {
      title: 'A Common Non-Theorem',
      query: 'first countable + separable + ~second countable',
    },
  ]
</script>

<p>
  <b>Not sure where to start?</b>

  Try one of the following searches:
</p>
{#each examples as { title, query } (title)}
  <article>
    <h5>{title}</h5>
    <pre
      class="example"
      on:click={() => setSearch(query)}>
      {query}
    </pre>
  </article>
{/each}
