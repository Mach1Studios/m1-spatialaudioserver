<template lang="html">
  <table class="table border large center-align">
    <thead>
      <tr>
        <th><abbr title="#">#</abbr></th>
        <th><abbr title="NICKNAME">NICKNAME</abbr></th>
        <th><abbr title="E-MAIL">E-MAIL</abbr></th>
        <th><abbr title="ROLE">ROLE</abbr></th>
        <th><abbr title="LAST SEEN">LAST SEEN</abbr></th>
        <th><abbr title="REMOVE"></abbr></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <p>1</p>
        </td>
        <td>
          <p>Siouxsie_1957</p>
        </td>
        <td>
          <p>siouxsieandthebanshees@gmail.com</p>
        </td>
        <td>
          <p>User</p>
        </td>
        <td>
          <p>21.07.1995</p>
        </td>
        <td>
          <button class="border round transparent-border black-text">
            <i>delete</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>

export default {
  name: 'UsersList',
};
</script>

<style lang="scss" scoped>
  .table abbr {
    width: 100%;

    font-style: normal;
    font-weight: bold;
    font-size: 1rem;

    line-height: 1.17;
    letter-spacing: -0.5px;
  }

  .table td {
    vertical-align: middle;
    cursor: pointer;
  }

  .table th {
    vertical-align: middle;
  }

  .table {
    border-radius: 0.3rem;
  }
</style>
