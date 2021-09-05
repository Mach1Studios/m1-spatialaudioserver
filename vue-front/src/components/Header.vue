<template>
  <div class="menu top home" role="navigation" aria-label="main navigation">
    <img class="logo" src="../assets/logo-bg.svg">
    <router-link class="link" to="/">Home</router-link>
    <router-link class="link" to="/spatialaudioplayer">Spatial Audio Player</router-link>
    <router-link class="link" to="/users">Users</router-link>
    <div style="flex-grow: 1;"></div>
    <UsersAuth/>
  </div>
</template>

<script>
import UsersAuth from './UsersAuth.vue';

export default {
  components: {
    UsersAuth,
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
      &:focus, &:focus-within, &:hover {
        color: #fefefe;
      }
    }
    button {
      background-color: transparent;
      border-radius: 0;
      border: 1px solid #626161;
      color: #626161;
      &:focus, &:hover {
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
</style>
