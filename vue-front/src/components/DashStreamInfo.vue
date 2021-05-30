<template lang="html">
  <div class="table-container is-flex is-flex-direction-column is-justify-content-space-between dash">
    <h4 class="title">DASH Stream Info</h4>
    <table class="table is-striped is-narrow is-hoverable is-fullwidth">
      <tbody>
        <tr>
          <td>
            <p>Stream Name</p>
          </td>
          <td>
            <p>stream1</p>
          </td>
        </tr>
        <tr>
          <td>
            <p>Stream Url</p>
          </td>
          <td>
            <p>http://localhost/stream1.mpd</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
</script>

<style lang="css" scoped>
  .dash .title {
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.17;
    letter-spacing: -0.5px;
  }
  .table td {
    vertical-align: middle;
    text-align: left;
    cursor: pointer;
  }
  .table {
    border-radius: 0.3rem;
  }
  .table-button {
    background: transparent;
    border: none;
  }
</style>
