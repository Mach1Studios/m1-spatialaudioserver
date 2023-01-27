<template>
  <div class="flex-item scroll">
    <table class="table-user-list large-space center-align">
      <thead class="front">
        <tr>
          <th><abbr title="#">#</abbr></th>
          <th><abbr title="NICKNAME">NICKNAME</abbr></th>
          <th><abbr title="E-MAIL">E-MAIL</abbr></th>
          <th><abbr title="ROLE">ROLE</abbr></th>
          <th><abbr title="LAST SEEN">LAST SEEN</abbr></th>
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
  .flex-item {
    scrollbar-color: var(--primary-color);

    &::-webkit-scrollbar-track {
      background-color: var(--secondary-color);
      border-radius: 3rem;
    }

    &::-webkit-scrollbar {
      background-color: var(--secondary-color);
      border-radius: 3rem;

      width: 5rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--primary-color);
      border-radius: 3em;
    }
  }

  .table-user-list {
    display: block;
    overflow: hidden;
    width: 100%;

    tbody {
      width: 100%;
    }

    i {
      color: var(--primary-highlight-color);
    }

    button {
     i {
       font-size: 16px;
     }

     &:hover {
       i {
         color: var(--secondary-highlight-color);
         font-size: 20px;
       }
     }
    }

    abbr {
      color: var(--secondary-highlight-color);

      font-style: normal;
      font-weight: bold;
      letter-spacing: -0.5px;
      line-height: 1.17;

      width: 100%;
    }

    p {
      color: var(--secondary-highlight-color);
    }

    td {
      border-bottom: 1px var(--additional-dark-color) solid;
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
    .table-user-list {
      overflow-x: scroll;
      width: 200vw;
    }
  }
</style>
