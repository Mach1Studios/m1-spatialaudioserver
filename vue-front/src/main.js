import { createApp } from 'vue';
import 'beercss';

import App from './App.vue';
import router from './router';
import Store from './store';

const application = createApp(App);

application
  .use(Store)
  .use(router)
  .mount('#app');
