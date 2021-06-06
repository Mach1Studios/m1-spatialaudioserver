<template>
  <Header id="app-header"/>
  <router-view id="app-router"/>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: {
    Header,
  },
};
</script>

<style lang="scss">
@import "../node_modules/bulma/bulma.sass";
@import '~bulma-slider';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  min-height: 100vh;
  background-color: #1a1a1a;
}

#app-header {
  max-height: 10vh;
}

#app-router {
  min-height: 90vh;
}
</style>
