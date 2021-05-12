<template lang="html">
  <table class="table is-striped is-narrow is-hoverable is-fullwidth">
    <thead>
      <tr>
        <th><abbr title="#">#</abbr></th>
        <th><abbr title="NAME">NAME</abbr></th>
        <th><abbr title="DURATION">DURATION</abbr></th>
        <th><abbr title="TRASH"></abbr></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>
          <p>1</p>
        </th>
        <td>
          <p>Follow - In Death It Ends</p>
        </td>
        <td>
          <p>5:24</p>
        </td>
        <td>
          <button class="button trash-button">
            <span class="icon is-small trash">
              <img src="../assets/delete.svg">
            </span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {};
</script>

<style lang="css" scoped>
  abbr {
    font-style: normal;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.17;
    letter-spacing: -0.5px;
    width: 100%;
  }
  .table td {
    vertical-align: middle;
  }
  .table th {
    vertical-align: middle;
  }
  .button.trash-button {
    background: transparent;
    border: none;
  }
  .table {
    border-radius: 0.3rem;
  }
</style>
