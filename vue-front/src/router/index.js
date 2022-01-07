import { createRouter, createWebHistory } from 'vue-router';

import Store from '../store';
import SpatialAudioPlayer from '../views/SpatialAudioPlayer.vue';

const routes = [
  {
    path: '/',
    name: 'SpatialAudioPlayer',
    component: SpatialAudioPlayer,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      requiresAdmin: true,
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: {
      requiresAdmin: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// eslint-disable-next-line consistent-return
router.beforeEach(async (to) => {
  try {
    await Store.dispatch('auth/restore');

    if (to.meta.requiresAdmin) {
      if (!Store.getters['auth/userId']) {
        return {
          path: '/',
        };
      }
    }
  } catch (e) {
    return {
      path: '/',
    };
  }
});

export default router;
