<template>
  <div class="tooltip right" :class="{ active }">
    <p v-for="(value, key) in items" :key="value" class="info small-margin">
      <b class="upper">{{key}}:</b> {{value}}
    </p>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    active: {
      type: Boolean,
      default() {
        return false;
      },
    },
    items: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  // created() {
  //   console.log(this.items);
  // },
};
</script>

<style lang="scss" scoped>
  .tooltip {
    background-color: #ffffff;
    color: #1c1c1c;
    z-index: 200;
    position: fixed;
    -webkit-transform: translateY(0);
    -moz-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
    top: auto;
    bottom: auto;
    left: auto;
    right: auto;
    // transition-property: position;
  }
  .tooltip:hover {
  }

  .info {
    border-bottom: 1px #dfdfdf dotted;
  }
  p {
    text-align: justify;
  }
</style>
