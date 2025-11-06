import { createRouter, createWebHistory } from 'vue-router';

import Store from '../store';
import SpatialAudioPlayer from '../views/SpatialAudioPlayer.vue';

const routes = [
  {
    path: '/',
    name: 'SpatialAudioPlayer',
    component: SpatialAudioPlayer,
    meta: {
      transition: 'slide-left',
      public: true, // Mark as public route - no auth required
    },
  },
  {
    path: '/playlist/:id',
    name: 'PublicPlaylist',
    component: () => import('../views/PublicPlaylist.vue'),
    meta: {
      transition: 'slide-left',
      public: true, // Mark as public route - no auth required
    },
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
    meta: {
      transition: 'slide-left',
      public: true, // Documentation should be publicly accessible
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  // Skip auth check for public routes
  if (to.meta.public) {
    return undefined;
  }

  try {
    await Store.dispatch('auth/restore');

    if (to.meta.requiresAdmin) {
      if (!Store.getters['auth/userId']) {
        return {
          path: '/',
        };
      }
    }

    return undefined;
  } catch (e) {
    return {
      path: '/',
    };
  }
});

export default router;
