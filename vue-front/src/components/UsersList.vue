<template>
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
          <p class="medium-text">{{item.number}}</p>
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
            <i class="material-icons">edit</i>
          </button>
        </td>
        <td>
          <button class="border round transparent-border black-text" @click="remove(item)">
            <i class="material-icons">delete</i>
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
  .table {
    p {
      color: #1c1c1c;
    }
    i {
      color: #4d4d4d;
    }
    abbr {
      width: 100%;

      font-style: normal;
      font-weight: bold;

      line-height: 1.17;
      letter-spacing: -0.5px;
    }
    td {
      vertical-align: middle;
      cursor: pointer;
    }
    th {
      vertical-align: middle;
    }
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
