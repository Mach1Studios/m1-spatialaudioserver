<template lang="html">
  <div class="menu top home" role="navigation" aria-label="main navigation">
    <img class="logo" src="../assets/logo-bg.svg">
    <router-link class="link" to="/">Home</router-link>
    <router-link class="link" to="/spatialaudioplayer">Spatial Audio Player</router-link>
    <router-link class="link" to="/users">Users</router-link>
    <div class=""></div>
    <button class="button">Log in</button>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
  .home {
    background-color: #1a1a1a;

    justify-content: space-around;

    padding: 0 30px;
    z-index: 98;
  }
  .logo {
    height: 70%;

    margin: 5px;
  }
  .button {
    display: inline-block;
    font-weight: 500;
    background-color: transparent;
    border: 1px solid #626161;
    color: #626161;
    padding: 4px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 0.8em;
    cursor: pointer;
    border-radius: 0;
  }
  .button:focus, .button:hover {
    color: #fefefe;
    background: transparent;
    border: 1px solid #fefefe;
  }
  button:focus::after, button:hover::after {
    background: transparent;
  }
  .menu a {
    color: #626161;
    font-weight: 500;
    font-size: 1em;
  }
  .menu a:focus, .menu a:focus-within, .menu a:hover {
    background-color: transparent;
    color: #fefefe;
  }
</style>
