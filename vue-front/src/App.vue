<template>
  <Header/>
  <AudioUploader/>
</template>

<script>
import Header from '@/components/Header.vue';
import AudioUploader from '@/components/AudioUploader.vue';

export default {
  components: {
    Header,
    AudioUploader,
  },
};
</script>

<style lang="scss">
@import "../node_modules/bulma/bulma.sass";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
body{
  background-color: #1a1a1a;
}
</style>
