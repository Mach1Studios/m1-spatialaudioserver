<template>
  <div class="toast white-text notification" :class="{ pink: notification.isError, green: notification.isSuccess, active: isActive }">
    <i class="material-icons">{{icon}}</i>
    <span>{{notification.message}}</span>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'Notifications',
  props: {},
  computed: {
    ...mapState({
      notification: (state) => state.notification,
    }),
    icon() {
      if (this.notification.isError) return 'error';
      if (this.notification.isSuccess) return 'done';

      return 'info';
    },
    isActive() {
      console.log('nit');
      return this.notification.isError || this.notification.isSuccess;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
  .notification {
    z-index: 100;
  }
</style>
