<template>
  <div class="notification">
    <div
      v-for="(notification, index) in notifications"
      :key="notification.id"

      class="toast white-text notification"
      :class="{ pink: notification.isError, green: notification.isSuccess, active: notification.isError || notification.isSuccess }"

      :style="{ opacity: 1 - (multiplier - index) * 0.08 }"
    >
      <i class="material-icons">{{ icon(index) }}</i>
      <span style="white-space: pre-line">{{ notification.message }} {{ index }}</span>
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
  methods: {
    icon(id) {
      if (this.notifications[id].isError) return 'error';
      if (this.notifications[id].isSuccess) return 'done';

      return 'info';
    },
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
