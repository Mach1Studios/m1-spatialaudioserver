<template>
  <div class="menu top home" role="navigation" aria-label="main navigation">
    <img class="logo" src="../assets/logo-bg.svg">
    <div class="navigation" :class="{ active: isActive }">
      <router-link v-if="isAdmin" class="link" to="/dashboard">Dashboard</router-link>
      <router-link class="link" to="/">Spatial Audio Player</router-link>
      <router-link v-if="isAdmin" class="link" to="/users">Users</router-link>
    </div>
    <div style="flex-grow: 1;"></div>
    <router-link v-if="isAuthorized" class="profile link" to="/settings">
      {{user ? user.nickname : 'Profile'}}
    </router-link>
    <UsersAuth/>
    <div class="mobile">
      <button @click="menu">
        <i class="material-icons-outlined">{{ isActive ? 'close' : 'menu'}}</i>
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

    a, button, img {
      padding: 0 20px;
      margin: 5px;
      font-weight: 500;
      font-size: 16px;
    }
    a {
      color: #626161;
      font-weight: 500;
      width: fit-content;
      &:focus, &:focus-within, &:hover, &.router-link-active {
        color: #fefefe;
      }

      &.profile {
        margin: auto;
        padding: 0;
        font-size: var(--default-font-size);
      }
    }
    button {
      background-color: transparent;
      border-radius: 0;
      border: 1px solid #626161;
      color: #626161;
      &:focus, &:hover, &.router-link-active {
        color: #fefefe;
        background: transparent;
        border: 1px solid #fefefe;
        &::after {
          background: transparent;
        }
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
    padding: 0;
    margin: 0;
    z-index: 98;
    right: 0;
    button {
      border: none;
      &:focus, &:hover, &.router-link-active {
        color: #fefefe;
        border: none;
        background: transparent;
        &::after {
          background: transparent;
        }
      }
    }
  }
  @media screen and (orientation: portrait) {
    .home {
      z-index: 700;
      padding: 0 8rem;
      button, img {
        padding: 0;
      }
    }
    .logo {
      z-index: 800;
    }
    .navigation {
      visibility: hidden;

      display: flex;
      flex-direction: column;

      position: fixed;
      bottom: 0;
      height: 100vh;
      width: 100vw;

      background-color: #1c1c1c;

      a {
        width: auto;
        max-width: 100%;
        justify-content: flex-end;

        font-size: 2em;
        text-align: left;
        padding: 0 10rem 0 10rem;
      }
      a:first-child {
        margin-top: 10vh;
      }
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
