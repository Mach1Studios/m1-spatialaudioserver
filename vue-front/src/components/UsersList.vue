<template>
  <div class="user-list">
    <table class="table-user-list large center-align">
      <thead>
        <tr>
          <th><abbr title="#">#</abbr></th>
          <th><abbr title="NICKNAME">NICKNAME</abbr></th>
          <th><abbr title="E-MAIL">E-MAIL</abbr></th>
          <th><abbr title="ROLE">ROLE</abbr></th>
          <th><abbr title="LAST SEEN">LAST SEEN</abbr></th>
          <!-- <th><abbr title="EDIT"></abbr></th>
          <th><abbr title="REMOVE"></abbr></th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in users" :key="item">
          <td>
            <p class="medium-text">{{ index + 1 }}</p>
          </td>
          <td>
            <p class="medium-text">{{item.nickname}}</p>
          </td>
          <td>
            <p class="medium-text mobile">{{item.email}}</p>
          </td>
          <td>
            <p class="medium-text">{{item.role}}</p>
          </td>
          <td>
            <p class="medium-text">{{item.lastSeen}}</p>
          </td>
          <td>
            <Modal
              title="Update user"
              button=" "
              icon="edit"
              position="center"
              padding="no-padding"
              buttonClasses="small responsive"
              titleClasses="large-width"
            >
              <UsersAddForm
                icon="save"
                title="Save"
                :item="item"

                :action="update"
              />
            </Modal>
          </td>
          <td>
            <button class="border round transparent-border black-text" @click="remove(item.id)">
              <i class="material-icons">delete</i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Modal from './Base/Modal.vue';
import UsersAddForm from './UsersAddForm.vue';

export default {
  name: 'UsersList',
  props: { admin: Boolean },
  components: {
    Modal,
    UsersAddForm,
  },
  computed: mapState({ users: (state) => state.users.items }),
  methods: { ...mapActions('users', ['update', 'remove']) },
  created() {
    this.$store.dispatch('users/getAll');
  },
};
</script>

<style lang="scss" scoped>
  .table-user-list {
    button {
     i {
       font-size: 16px;
     }
     &:hover {
       i {
         font-size: 20px;
         color: #ffffff;
       }
     }
    }
    abbr {
      color: #ffffff;
    }
    p {
      color: #ffffff;
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
      border-bottom: 1px #212121 solid;
      vertical-align: middle;
      cursor: pointer;
    }
    th {
      vertical-align: middle;
    }
  }

  .button:focus::after, .button:hover::after, button:focus::after, button:hover::after {
    background: none;
  }

  @media screen and (orientation: portrait) {
    .user-list {
      overflow-x: scroll;
    }
    .user-list-table {
      width: 200vw;
    }
  }
</style>
