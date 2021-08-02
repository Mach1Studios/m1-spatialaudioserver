<template lang="html">
  <div class="medium-padding">
    <div class="medium-margin">
      <button class="round medium border grey-light-3 transparent-border black-text absolute middle center" @click="open">
        <i v-show="icon" class="black-text">{{icon}}</i>
        <span class="small-text">{{title}}</span>
      </button>
    </div>
    <div v-show="active" class="overlay active dark" @click="close"></div>
    <div class="modal" :class="currentPosition">
      <nav>
        <button class="transparent round absolute right close" @click="close">
          <i class="black-text">highlight_off</i>
        </button>
      </nav>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Modal',
  props: {
    position: {
      type: String,
    },
    title: String,
    icon: String,
  },
  data() {
    return { active: false };
  },
  computed: {
    currentPosition() {
      const { active, position } = this;
      return { active, [position]: true };
    },
  },
  methods: {
    close() {
      this.active = false;
    },
    open() {
      this.active = true;
    },
  },
};
</script>

<style lang="scss" scoped>
  .close {
    padding-top: 16px;
    padding-right: 0;
  }
</style>
