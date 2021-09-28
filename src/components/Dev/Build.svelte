<script lang="ts">
  import * as Build from '../../build'
</script>

<table class="table">
  <tbody>
    <tr>
      <th>Branch</th>
      <td>{Build.branch}</td>
    </tr>
    <tr>
      <th>Commit</th>
      <td>{Build.commitRef}</td>
    </tr>
    <tr>
      <th>Context</th>
      <td>{Build.context}</td>
    </tr>
  </tbody>
</table>
