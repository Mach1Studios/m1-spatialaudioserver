<template lang="html">
  <Modal title="Log In" titleClasses="large-width add-user">
    <template #button>
      <button>Log in</button>
    </template>

    <div class="">
      <FormInput
        name="login"
        placeholder="Nickname or email"
        :value="login"
      />
      <FormInput
        name="password"
        placeholder="Your Password"
        :value="password"
      />
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue';
import FormInput from './form/Input.vue';

export default {
  name: 'UsersAuth',
  components: {
    Modal, FormInput,
  },
  data() {
    return {
      login: '',
      password: '',
    };
  },
};
</script>

<style lang="scss" scoped>
button {
  background-color: transparent;
  border-radius: 0;
  border: 1px solid #626161;
  color: #626161;

  padding: 0 20px;
  margin: 5px;
  font-weight: 500;
  font-size: 16px;

  z-index: 1;
  &:focus, &:hover {
    color: #fefefe;
    background: transparent;
    border: 1px solid #fefefe;
    &::after {
      background: transparent;
    }
  }
}
</style>
