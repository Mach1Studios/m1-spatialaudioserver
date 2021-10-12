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
        v-model="credentials.login"
        @keyup.enter="handler(parrent.close)"
      />
      <FormInput
        name="password"
        placeholder="Password"
        type="password"
        v-model="credentials.password"
        @keyup.enter="handler(parrent.close)"
      />
      <FormButton title="Enter" icon="login" @click="handler(parrent.close)"/>
    </template>
  </Modal>
  <div class="profile" v-else>
    <p>{{user ? user.nickname : 'Profile'}}</p>
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
      credentials: {
        login: '',
        password: '',
      },
    };
  },
  computed: mapState({
    user: (state) => state.auth.profile.user,
  }),
  methods: {
    ...mapActions('auth', ['login', 'logout']),
    async handler(callback) {
      const { credentials } = this;
      const isAuth = await this.login(credentials);
      if (isAuth) callback();
    },
    async ok() {
      await this.logout();
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
</style>
