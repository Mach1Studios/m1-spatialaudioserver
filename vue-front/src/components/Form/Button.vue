<template>
  <button :type="type" class="button small responsive upper round grey3">
    <i v-if="icon" class="material-icons">{{icon}}</i>
    <span class="small-text">{{title}}</span>
  </button>
</template>

<script>
export default {
  name: 'FormButton',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
      default: 'button',
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  padding: 0;
  margin: 16rem 0 16rem 0;

  i {
    font-size: 16px;
    color: #4d4d4d;
  }
  span {
    color: #1c1c1c;
  }
}
</style>
