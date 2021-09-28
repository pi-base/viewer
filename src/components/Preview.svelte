<script lang="ts">
  import { Tex } from './Shared/index'

  let body = ''
</script>

<div class="row">
  <div class="col-6">
    <textarea
      bind:value={body}
      class="form-control"
      rows={10}
      placeholder="Enter text to preview"
    />
  </div>
  <div class="col-6">
    <!-- FIXME: this component currently only renders on mount -->
    <Tex {body} />
  </div>
</div>
