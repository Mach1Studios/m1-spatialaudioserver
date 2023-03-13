<template>
  <div id="Documentation">
    <main class="max responsive">
      <div class="grid">
        <div class="col s12">
          <div id="swagger" class="swagger" />
          <!-- <iframe id="swagger" :srcdoc="html" /> -->
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// eslint-disable-next-line
import SwaggerUI from 'swagger-ui';

// import 'swagger-ui/dist/swagger-ui.css';
import '../swagger-new-theme.css';
// import 'swagger-ui-themes/themes/3.x/theme-newspaper.css';
// import Markdown from './markdown.md';

export default {
  components: {
    // Markdown,
  },
  // data() {
  //   return {
  //     html: `
  //     <!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //     <meta charset="utf-8" />
  //     <meta name="viewport" content="width=device-width, initial-scale=1" />
  //     <meta
  //       name="description"
  //       content="SwaggerUI"
  //     />
  //     <title>SwaggerUI</title>
  //     <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
  //     </head>
  //     <body>
  //     <div id="swagger-ui"></div>
  //     <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js" crossorigin />
  //     <script>
  //     window.onload = () => {
  //       window.ui = SwaggerUIBundle({
  //         url: 'https://petstore3.swagger.io/api/v3/openapi.json',
  //         dom_id: '#swagger-ui',
  //       });
  //     };
  //
  //     </body>
  //     </html>
  //     `,
  //   };
  // },
  mounted() {
    /* eslint-disable global-require */
    const spec = require('../spec.json');
    // console.log(spec);
    SwaggerUI({
      spec,
      dom_id: '#swagger',
      layout: 'BaseLayout',
    });
  },
};
</script>
<style lang="scss" scoped>
  #Documentation {
    max-height: 90vh;
    // background-color: #1c1c1c;
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
