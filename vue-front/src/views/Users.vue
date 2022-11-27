<template>
  <div class="max-size">
    <div class="container max no-scroll">
      <div class="row">
        <div class="col s12 m12 l12">
          <div id="UsersList" class="card round">
            <UsersList />
            <Modal
              button-classes="small responsive round grey3"
              icon="add"
              padding="small-padding large-margin"
              position="center"
              title="Add user"
              title-classes="large-width add-user"
            >
              <UsersAddForm
                title="Add user"
                icon="add"

                :action="create"
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
    <!-- <Readme /> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import UsersList from '../components/UsersList.vue';
import Modal from '../components/Base/Modal.vue';
import UsersAddForm from '../components/UsersAddForm.vue';

// import Readme from './test.md';

export default {
  components: {
    UsersList,
    Modal,
    UsersAddForm,
    // Readme,
  },
  methods: { ...mapActions('users', ['create']) },
};
</script>
<style lang="scss" scoped>
  .max-size {
    height: 100vh;
  }

  .container {
    padding-left: 55rem;
    padding-right: 55rem;
  }

  #UsersList {
    height: auto;
    max-height: 87vh;
    max-width: 100%;

    align-content: space-between;
    display: flex;
    flex-direction: column;
  }

  .card {
    background-color: #252526;
  }

  @media screen and (orientation: portrait) {
    .container {
      padding-left: 8rem;
      padding-right: 8rem;
    }

    #UsersList {
      height: auto;
      max-height: 80vh;
      max-width: 100%;

      align-content: space-between;
      display: flex;
      flex-direction: column;
    }
  }
</style>
