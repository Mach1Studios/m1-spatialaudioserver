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
            <p class="medium-text">{{ item.nickname }}</p>
          </td>
          <td>
            <p class="medium-text mobile">{{ item.email }}</p>
          </td>
          <td>
            <p class="medium-text">{{ item.role }}</p>
          </td>
          <td>
            <p class="medium-text">{{ item.lastSeen }}</p>
          </td>
          <td>
            <Modal
              title="Update user"
              button=" "
              icon="edit"
              position="center"
              padding="no-padding"
              button-classes="small responsive edit-btn"
              title-classes="large-width"
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
  components: {
    Modal,
    UsersAddForm,
  },
  props: { admin: Boolean },
  computed: mapState({ users: (state) => state.users.items }),
  methods: { ...mapActions('users', ['update', 'remove']) },
  created() {
    this.$store.dispatch('users/getAll');
  },
};
</script>

<style lang="scss" scoped>
  .table-user-list {
    i {
      color: #626161;
    }

    button {
     i {
       font-size: 16px;
     }

     &:hover {
       i {
         color: #ffffff;
         font-size: 20px;
       }
     }
    }

    abbr {
      color: #ffffff;

      font-style: normal;
      font-weight: bold;
      letter-spacing: -0.5px;
      line-height: 1.17;

      width: 100%;
    }

    p {
      color: #ffffff;
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

  button:focus::after, button:hover::after {
    background: none;
  }

  @media screen and (orientation: portrait) {
    .user-list {
      overflow-x: scroll;
    }

    .table-user-list {
      width: 200vw;
    }
  }
</style>
