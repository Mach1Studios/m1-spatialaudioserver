<template>
  <Modal v-if="!user" title="Log In" titleClasses="large-width add-user">
    <template #button>
      <button>Log in</button>
    </template>

    <template #default="parrent">
      <FormInput
        name="login"
        placeholder="Email"
        type="text"
        v-model="login"
      />
      <FormInput
        name="password"
        placeholder="Password"
        type="text"
        v-model="password"
      />
      <FormButton title="Enter" icon="add" @click="handler(parrent.close)"/>
    </template>
  </Modal>
  <div v-else>
    <p style="z-index: 1; color: white">{{user?.nickname}}</p>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Modal from './Modal.vue';

import FormInput from './Form/Input.vue';
import FormButton from './Form/Button.vue';

export default {
  name: 'UsersAuth',
  components: {
    Modal, FormInput, FormButton,
  },
  data() {
    return {
      login: '',
      password: '',
    };
  },
  computed: mapState({
    user: (state) => state.auth.profile.user,
  }),
  methods: {
    ...mapActions('auth', { auth: 'login' }),
    async handler(callback) {
      const { login, password } = this;
      const isAuth = await this.auth({ login, password });
      if (isAuth) callback();
    },
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
