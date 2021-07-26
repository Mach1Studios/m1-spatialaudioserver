<template>
  <div class="container max">
    <div class="row">
      <div class="col s12">
        <div class="card">
          <UsersList/>
          <Modal title="Add user" icon="add" position="center">
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
