<template lang="html">
  <table class="table user-list-table border large center-align">
    <thead>
      <tr>
        <th><abbr title="#">#</abbr></th>
        <th><abbr title="NICKNAME">NICKNAME</abbr></th>
        <th><abbr title="E-MAIL">E-MAIL</abbr></th>
        <th><abbr title="ROLE">ROLE</abbr></th>
        <th><abbr title="LAST SEEN">LAST SEEN</abbr></th>
        <th><abbr title="EDIT">EDIT</abbr></th>
        <th><abbr title="REMOVE"></abbr></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in users" :key="item">
        <td>
          <p class="medium-text">{{item.id}}</p>
        </td>
        <td>
          <p class="medium-text">{{item.nickname}}</p>
        </td>
        <td>
          <p class="medium-text">{{item.email}}</p>
        </td>
        <td>
          <p class="medium-text">{{item.role}}</p>
        </td>
        <td>
          <p class="medium-text">{{item.lastSeen}}</p>
        </td>
        <td>
          <button class="border round transparent-border black-text">
            <i class="material-icons-outlined">edit</i>
          </button>
        </td>
        <td>
          <button class="border round transparent-border black-text" @click="remove(item)">
            <i>delete</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'UsersList',
  props: { admin: Boolean },
  computed: mapState({
    users: (state) => state.users.items,
  }),
  methods: {
    ...mapActions('users', ['remove']),
  },
  created() {
    this.$store.dispatch('users/getAll');
  },
};
</script>

<style lang="scss" scoped>
  .table abbr {
    width: 100%;

    font-style: normal;
    font-weight: bold;

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
  .user-list-table button {
    i {
      font-size: 16px;
    }
  }
  .user-list-table button:hover {
    i {
      font-size: 20px;
    }
  }
</style>
