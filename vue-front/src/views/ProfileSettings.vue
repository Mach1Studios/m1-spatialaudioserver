<template>
  <main class="max responsive no-scroll">
    <div class="grid">
      <div class="col s12 m6 l6">
        <h4 class="title upper white-text">
          Profile Settings
        </h4>
        <article class="round">
          <UserProfile />
        </article>
      </div>
      <div class="col s12 m6 l6">
        <Info />
      </div>
    </div>
  </main>
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
  article {
    background-color: var(--secondary-dark-color);
  }

  main {
    padding-left: 55rem;
    padding-right: 55rem;
  }

  @media screen and (orientation: portrait) {
    main {
      padding-left: 8rem;
      padding-right: 8rem;
    }
  }
</style>
