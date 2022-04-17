<script lang="ts">
  import { Tex } from '../Shared'

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
    <Tex {body} />
  </div>
</div>
