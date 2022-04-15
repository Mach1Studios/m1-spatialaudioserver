<template>
  <div class="container max">
    <div class="row">
      <div class="col s12 m12 l12">
        <div class="card round">
          <UsersList/>
          <Modal
            buttonClasses="small responsive round grey3"
            icon="add"
            padding="small-padding large-margin"
            position="center"
            title="Add user"
            titleClasses="large-width add-user"
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
</template>

<script>
import { mapActions } from 'vuex';

import UsersList from '../components/UsersList.vue';
import Modal from '../components/Base/Modal.vue';
import UsersAddForm from '../components/UsersAddForm.vue';

export default {
  components: {
    UsersList,
    Modal,
    UsersAddForm,
  },
  methods: { ...mapActions('users', ['create']) },
};
</script>
<style lang="scss" scoped>
  .card {
    background-color: #252526;
  }
  @media screen and (orientation: portrait) {
  }
</style>
