<template>
  <div class="container max no-scroll">
    <div class="row">
      <div class="col s12 m6 l6">
        <h4 class="title upper white-text">Profile Settings</h4>
        <div class="card round">
          <UserProfile/>
        </div>
      </div>
      <div class="col s12 m6 l6">
        <Info/>
      </div>
    </div>
  </div>
</template>

<script>

import UserProfile from '../components/UserProfile.vue';
import Info from '../components/Info.vue';

export default {
  components: {
    UserProfile,
    Info,
  },
};
</script>
<style lang="scss" scoped>
  .card {
    background-color: #252526;
  }
</style>
