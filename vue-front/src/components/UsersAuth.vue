<template>
  <Modal v-if="!user" title="Sign In" title-classes="large-width add-user">
    <template #button>
      <button class="login">
        Sign in
      </button>
    </template>

    <template #default="parrent">
      <form @submit.prevent="handler(parrent.close)">
        <FormInput
          v-model="credentials.login"

          autocomplete="username"
          name="login"
          placeholder="Login"
          type="text"
          required
        />
        <FormInput
          v-model="credentials.password"

          autocomplete="current-password"
          name="password"
          placeholder="Password"
          type="password"
          required
        />
        <FormButton title="Enter" icon="login" type="submit" />
      </form>
    </template>
  </Modal>
  <div v-else class="profile">
    <Modal title="Are you sure?" title-classes="large-width add-user">
      <template #button>
        <button class="transparent-border">
          <i class="material-icons">logout</i>
        </button>
      </template>

      <template #default="parrent">
        <div class="grid logout">
          <div class="col s6">
            <FormButton title="Yes" @click="ok(parrent.close)" />
          </div>
          <div class="col s6">
            <FormButton title="No" @click="parrent.close" />
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
    color: var(--primary-highlight-color);

    font-size: 16px;
    font-weight: 500;

    margin: 5px;
    padding: 0 20px;

    z-index: 1;

    &:focus, &:hover {
      background: transparent;
      color: var(--additional-highlight-color);

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
  }

  .logout .button>:not(.dropdown,.badge) {
    margin-left: 0;
  }

  .login {
    border-radius: 0;
    border: 1px solid var(--primary-highlight-color);

    &:focus, &:hover {
      border: 1px solid var(--additional-highlight-color);
    }
  }
</style>
