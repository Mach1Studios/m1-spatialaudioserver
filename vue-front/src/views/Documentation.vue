<template>
  <div id="Documentation">
    <main class="max responsive">
      <div class="grid">
        <div class="col s12">
          <div id="swagger" class="swagger" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// eslint-disable-next-line
import SwaggerUI from 'swagger-ui';

import 'swagger-ui/dist/swagger-ui.css';
// import Markdown from './markdown.md';

export default {
  components: {
    // Markdown,
  },
  mounted() {
    /* eslint-disable global-require */
    const spec = require('../spec.json');
    console.log(spec);
    SwaggerUI({
      spec,
      dom_id: '#swagger',
    });
  },
};
</script>
<style lang="scss" scoped>
  #Documentation {
    max-height: 90vh;
  }

  .swagger {
    max-height: 90vh;
    overflow-x: hidden;
    overflow-y: scroll !important;
  }

  main {
    padding-left: 55rem;
    padding-right: 55rem;
  }

  main.responsive.max {
    color: #ffffff;
  }

  svg .svg-assets {
    display: none;
  }

  @media screen and (orientation: portrait) {
    main {
      padding-left: 8rem;
      padding-right: 8rem;
    }
  }
</style>
