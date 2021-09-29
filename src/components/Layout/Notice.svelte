<script lang="ts">
  export let title: string
</script>

<div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    {title}
  </div>
  <div class="toast-body">
    <slot />
  </div>
</div>

<style>
  .toast {
    position: absolute;
    bottom: 20px;
    left: 20px;
  }
</style>
