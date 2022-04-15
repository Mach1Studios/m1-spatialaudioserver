<template>
  <Modal v-if="!user" title="Sign In" titleClasses="large-width add-user">
    <template #button>
      <button class="login">Sign in</button>
    </template>

    <template #default="parrent">
      <form @submit.prevent="handler(parrent.close)">
        <FormInput
          autocomplete="username"
          name="login"
          placeholder="Login"
          type="text"

          v-model="credentials.login"
          required
        />
        <FormInput
          autocomplete="current-password"
          name="password"
          placeholder="Password"
          type="password"

          v-model="credentials.password"
          required
        />
        <FormButton title="Enter" icon="login" type="submit" @click="handler(parrent.close)"/>
      </form>
    </template>
  </Modal>
  <div v-else class="profile">
    <Modal title="Are you sure?" titleClasses="large-width add-user">
      <template #button>
        <button class="transparent-border"><i class="material-icons">logout</i></button>
      </template>

      <template #default="parrent">
        <div class="row no-wrap logout">
          <div class="col">
            <FormButton title="Yes" @click="ok(parrent.close)"/>
          </div>
          <div class="col">
            <FormButton title="No" @click="parrent.close"/>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import Modal from './Base/Modal.vue';

import FormInput from './Form/Input.vue';
import FormButton from './Form/Button.vue';

export default {
  name: 'UsersAuth',
  components: { Modal, FormInput, FormButton },
  data() {
    return {
      credentials: {
        login: '',
        password: '',
      },
    };
  },
  computed: mapState({ user: (state) => state.auth.profile.user }),
  methods: {
    ...mapActions('auth', ['login', 'logout']),
    async handler(callback) {
      const { credentials } = this;

      if (credentials.login !== '' && credentials.password !== '') {
        const isAuth = await this.login(credentials);
        if (isAuth) callback();
      }
    },
    async ok() {
      await this.logout();
      await this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped>
  button {
    background-color: transparent;
    color: #626161;

    padding: 0 20px;
    margin: 5px;
    font-weight: 500;
    font-size: 16px;

    z-index: 1;

    &:focus, &:hover {
      color: #fefefe;
      background: transparent;
      &::after {
        background: transparent;
      }
    }
    i {
      font-size: 16px;
    }
  }
  .profile {
    display: flex;

    p {
      z-index: 1;
      color: white;
      margin: auto;
    }
  }
  .logout .button>:not(.dropdown,.badge) {
    margin-left: 0;
  }
  .login {
    border: 1px solid #626161;
    border-radius: 0;
    &:focus, &:hover {
      border: 1px solid #fefefe;
    }
  }
</style>
