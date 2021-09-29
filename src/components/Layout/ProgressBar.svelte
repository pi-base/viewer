<script lang="ts">
  export let now: number
  export let max: number

  $: percent = (100.0 * now) / max
</script>

<div class="progress">
  <div
    role="progressbar"
    class="progress-bar progress-bar-animated progress-bar-striped"
    aria-valuemin={0}
    aria-valuenow={now}
    aria-valuemax={max}
    style={`width: ${percent}%;`}
  >
    <span class="sr-only">{percent}%</span>
  </div>
</div>
