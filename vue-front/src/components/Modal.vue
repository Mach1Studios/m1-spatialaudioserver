<template lang="html">
  <div>
    <div>
      <button class="round large border grey-light-3 transparent-border black-text open no-margin no-padding" @click="open()">
        <i v-show="icon" class="black-text">{{icon}}</i>
        <span>{{title}}</span>
      </button>
    </div>
    <div class="modal" :class="currentPosition">
      <nav>
        <button class="transparent round extra padding absolute right" @click="close()">
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
  .open {
    width: 100%;
    i {
      margin-right: 0;
    }
  }
</style>
