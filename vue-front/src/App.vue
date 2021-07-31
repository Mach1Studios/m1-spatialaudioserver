<template>
  <Header id="app-header"/>
  <router-view id="app-router"/>
  <Preloader
    :title="loader.title"
    :description="loader.description"
    :isLoading="loader.isLoading"
  />
</template>

<script>
import { mapState } from 'vuex';

import Header from './components/Header.vue';
import Preloader from './components/Preloader.vue';

export default {
  components: {
    Header, Preloader,
  },
  computed: mapState({
    loader: (state) => state.loader,
  }),
};
</script>

<style lang="scss">
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
  max-height: 90vh;
}
.button, button {
  box-shadow: none !important;
}
</style>
