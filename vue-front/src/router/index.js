import { createRouter, createWebHistory } from 'vue-router';

import Store from '../store';
import SpatialAudioPlayer from '../views/SpatialAudioPlayer.vue';

const routes = [
  {
    path: '/',
    name: 'SpatialAudioPlayer',
    component: SpatialAudioPlayer,
    meta: { transition: 'slide-left' },
  },
  {
    path: '/playlist/:id',
    name: 'PublicPlaylist',
    component: () => import('../views/PublicPlaylist.vue'),
    meta: { transition: 'slide-left' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      requiresAdmin: true,
      transition: 'slide-left',
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: {
      requiresAdmin: true,
      transition: 'slide-left',
    },
  },
  {
    path: '/settings',
    name: 'ProfileSettings',
    component: () => import('../views/ProfileSettings.vue'),
    meta: { transition: 'slide-left' },
  },
  {
    path: '/documentation',
    name: 'Documentation',
    component: () => import('../views/Documentation.vue'),
    meta: { transition: 'slide-left' },
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
