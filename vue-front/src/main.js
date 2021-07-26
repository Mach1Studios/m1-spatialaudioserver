import { createApp } from 'vue';
import 'beercss';
import VuePlyr from 'vue-plyr';
import 'vue-plyr/dist/vue-plyr.css';

import App from './App.vue';
import router from './router';
import store from './store';

const application = createApp(App);

application
  .use(store)
  .use(router)
  .use(VuePlyr, { plyr: {} })
  .mount('#app');
