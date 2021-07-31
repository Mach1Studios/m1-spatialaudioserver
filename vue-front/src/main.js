import { createApp } from 'vue';
import 'beercss';

import App from './App.vue';
import router from './router';
import store from './store';

const application = createApp(App);

application
  .use(store)
  .use(router)
  .mount('#app');
