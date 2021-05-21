import { createApp } from 'vue';
import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';

import App from './App.vue';
import router from './router';
import store from './store';

const application = createApp(App);
application.config.isCustomElement = (tag) => tag.startsWith('ion-');
application
  .use(store)
  .use(router)
  .use(VuePlyr, { plyr: {} })
  .mount('#app');
