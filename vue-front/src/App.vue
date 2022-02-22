<template>
  <Header id="app-header"/>
  <router-view id="app-router" v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'slide-left'">
      <component :is="Component"/>
    </transition>
  </router-view>
  <Notifications/>
  <Preloader
    :title="loader.title"
    :description="loader.description"
    :isLoading="loader.isLoading"
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
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    // color: #2c3e50;

    // max-height: 100vh;
    min-height: 100vh;
    background-color: #1c1c1c;

    position: static;
  }

  #app-header {
    max-height: 10vh;
  }
  //
  #app-router {
    // max-height: 90vh;
    // position: static;
    overflow: hidden;
  }

  .button, button {
    box-shadow: none !important;
  }

  :root {
    --default-font-size: 14px;
    --height: 10vh;
  }

  * {
    font-size: var(--default-font-size);
    width: auto;
    height: auto;
    // position: static;
    // max-height: inherit;
  }
  html, body {
    // position: static;
    // height: 100vh;
    // max-height: 100vh;
  }
  body {
    // max-height: 100vh;
    // position: static;
    // display: grid;
    overflow: hidden;
  }
  .slide-left-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-left-leave-active {
    // transition: all 0.3s ease;
    // transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-left-enter-from,
  .slide-left-leave-to {
    transform: translateX(100px);
    opacity: 0;
  }
  @media screen and (orientation: portrait) {
    body {
      overflow-y: scroll;
    }
  }
</style>
