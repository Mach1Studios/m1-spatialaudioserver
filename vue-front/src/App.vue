<template>
  <Header id="app-header" />
  <router-view id="app-router" v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'slide-left'">
      <component :is="Component" />
    </transition>
  </router-view>
  <Notifications />
  <Preloader
    :title="loader.title"
    :description="loader.description"
    :is-loading="loader.isLoading"
  />
</template>

<script>
import { mapState } from 'vuex';

import Header from './components/Header.vue';
import Notifications from './components/Base/Notifications.vue';
import Preloader from './components/Base/Preloader.vue';

export default {
  components: { Header, Preloader, Notifications },
  computed: mapState({ loader: (state) => state.loader }),
};
</script>

<style lang="scss">
  #app {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;

    background-color: #1c1c1c;

    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;

    min-height: 100vh;
    position: static;
  }

  #app-header {
    max-height: 10vh;
  }

  #app-router {
    overflow: hidden;
  }

  .button, button {
    box-shadow: none !important;
  }

  :root {
    --default-font-size: 14px;
    --height: 10vh;
    --primary: #e0e0e0;
  }

  * {
    font-size: var(--default-font-size);

    height: auto;
    width: auto;
  }

  body {
    overflow: hidden;
  }

  .slide-left-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-left-enter-from,
  .slide-left-leave-to {
    opacity: 0;
    transform: translateX(100px);
  }

  @media screen and (orientation: portrait) {
    body {
      overflow-y: scroll;
    }
  }
</style>
