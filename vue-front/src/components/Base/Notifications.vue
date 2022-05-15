<template>
  <div class="notification">
    <div
      v-for="(notification, index) in notifications"
      :key="notification.id"

      class="toast white-text notification active"
      :class="{
        pink: notification.icon === 'error',
        green: notification.icon === 'done',
        orange: notification.icon === 'info'
      }"

      :style="{ opacity: 1 - (multiplier - index) * 0.08 }"
    >
      <i class="material-icons">{{ notification.icon }}</i>
      <span style="white-space: pre-line">{{ notification.message }}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'Notifications',
  props: {},
  computed: {
    ...mapState({
      notifications: (state) => state.notifications,
      multiplier: (state) => Object.keys(state.notifications).length - 1,
    }),
  },
};
</script>

<style lang="scss" scoped>
  .notification {
    z-index: 601;

    position: fixed;
    top: auto;
    bottom: 72rem;
    left: 50%;
    right: auto;
    width: 80%;
    height: auto;

    transform: translate(-50%);
  }
  .toast {
    position: relative;

    bottom: 0;
    margin: 10rem;
  }
</style>
