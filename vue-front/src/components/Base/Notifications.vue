<template>
  <div class="notification">
    <div
      v-for="(notification, index) in notifications"
      v-show="notification.visible"

      :key="notification.id"
      class="toast white-text notification active"

      :class="{
        pink: notification.icon === 'error',
        green: notification.icon === 'done',
        orange: notification.icon === 'info'
      }"
      :style="{ opacity: 1 - (multiplier - index) * 0.08 }"
    >
      <div class="round notification-count">
        <i class="material-icons">{{ notification.icon }}:</i>
        <span>{{ notifications[index].count }}</span>
      </div>
      <span style="white-space: pre-line">{{ notification.message }}</span>
      <i class="material-icons close" @click="unsetToast(notification.id)">close</i>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

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
    ...mapMutations(['unsetToast']),
  },
};
</script>

<style lang="scss" scoped>
  .notification {
    height: auto;
    width: 80%;

    position: fixed;
    bottom: 72rem;
    right: auto;
    left: 50%;
    top: auto;

    transform: translate(-50%);
    z-index: 601;
  }
  .notification-count {
    background-color: #d31c5a;
    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 40rem;
    min-width: 40rem;
    font-size: 14rem;
    font-weight: 500;
    color: var(--on-secondary);
    padding: 0 16rem;
    // margin: 0 8rem;
    text-transform: none;
    border-radius: 0;
    user-select: none;
    gap: 8rem;
  }
  .toast {
    bottom: 0;
    margin: 10rem;
    position: relative;
    .close {
      position: absolute;
      right: 0;
      padding-right: 10rem;
    }
  }
</style>
