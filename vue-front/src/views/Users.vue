<template>
  <div class="container max">
    <div class="row">
      <div class="col s12">
        <div class="card round">
          <UsersList/>
          <Modal
            buttonClasses="small absolute center middle grey-light-3"
            icon="add"
            padding="small-padding large-margin"
            position="center"
            title="Add user"
            titleClasses="large-width add-user"
          >
            <UsersAddForm/>
          </Modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UsersList from '../components/UsersList.vue';
import Modal from '../components/Modal.vue';
import UsersAddForm from '../components/UsersAddForm.vue';

export default {
  components: {
    UsersList,
    Modal,
    UsersAddForm,
  },
};
</script>
<style lang="scss" scoped>
</style>
