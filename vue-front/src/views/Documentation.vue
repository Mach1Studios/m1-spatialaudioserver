<template>
  <main class="max responsive no-scroll">
    <div class="grid">
      <div class="col s12">
        <Markdown />
      </div>
    </div>
  </main>
</template>

<script>

import Markdown from './markdown.md';

export default {
  components: {
    Markdown,
  },
};
</script>
<style lang="scss" scoped>
  main {
    padding-left: 55rem;
    padding-right: 55rem;
  }

  @media screen and (orientation: portrait) {
    main {
      padding-left: 8rem;
      padding-right: 8rem;
    }
  }
</style>
