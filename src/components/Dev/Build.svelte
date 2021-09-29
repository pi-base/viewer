<script lang="ts">
  import { branch, commitRef, context } from '../../build'
</script>

<table class="table">
  <tbody>
    <tr>
      <th>Branch</th>
      <td>{branch}</td>
    </tr>
    <tr>
      <th>Commit</th>
      <td>{commitRef}</td>
    </tr>
    <tr>
      <th>Context</th>
      <td>{context}</td>
    </tr>
  </tbody>
</table>
