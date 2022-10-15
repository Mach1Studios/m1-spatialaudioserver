<template>
  <div class="menu top home" role="navigation" aria-label="main navigation">
    <img class="logo" src="../assets/logo-bg.svg">
    <div class="navigation" :class="{ active: isActive }">
      <router-link v-if="isAdmin" class="link" to="/dashboard">
        Dashboard
      </router-link>
      <router-link class="link" to="/">
        Spatial Audio Player
      </router-link>
      <router-link v-if="isAdmin" class="link" to="/users">
        Users
      </router-link>
    </div>
    <div style="flex-grow: 1;" />
    <router-link v-if="isAuthorized" class="profile link" to="/settings">
      {{ user ? user.nickname : 'Profile' }}
    </router-link>
    <UsersAuth />
    <div class="mobile">
      <button @click="menu">
        <i class="material-icons-outlined">{{ isActive ? 'close' : 'menu' }}</i>
      </button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import UsersAuth from './UsersAuth.vue';

export default {
  components: { UsersAuth },
  data() {
    return { isActive: false };
  },
  computed: mapState({
    isAdmin: (state) => _.get(state, 'auth.profile.user.role') === 'admin',
    isAuthorized: (state) => _.has(state, 'auth.profile.user.role'),
    user: (state) => state.auth.profile.user,
  }),
  methods: {
    menu() {
      this.isActive = !this.isActive;
    },
  },
};
</script>

<style lang="scss" scoped>
  .home {
    background-color: #1a1a1a;

    justify-content: space-around;
    padding: 0 30px;

    z-index: 98;

    button, img {
      font-size: 16px;
      font-weight: 500;

      margin: 5px;
      padding: 0 20px;
    }

    .link {
      padding: 0 10px;
    }

    button {
      background-color: transparent;
      color: #626161;

      border-radius: 0;
      border: 1px solid #626161;
      &:focus, &:hover {
        background: transparent;
        color: #fefefe;

        border: 1px solid #fefefe;

        &::after {
          background: transparent;
        }
      }
    }

    .mobile button {
      border: none;

      &:focus, &:hover {
        border: none;
      }
    }
  }

  .logo {
    height: 70%;
  }

  .navigation {
    z-index: 98;
  }

  .mobile {
    background-color: #1a1a1a;

    justify-content: space-around;
    margin: 0;
    padding: 0;
    right: 0;

    z-index: 98;
  }

  @media screen and (orientation: portrait) {
    .home {
      padding: 0 8rem;

      z-index: 700;

      button, img {
        padding: 0;
      }
    }

    .logo {
      z-index: 800;
    }

    .navigation {
      background-color: #1c1c1c;
      height: 100vh;
      width: 100vw;

      bottom: 0;
      display: flex;
      flex-direction: column;
      position: fixed;
      visibility: hidden;
    }

    .navigation.active {
      visibility: visible;
    }
  }
  @media screen and (orientation: landscape) {
    .mobile {
      display: none;
    }
  }
</style>
