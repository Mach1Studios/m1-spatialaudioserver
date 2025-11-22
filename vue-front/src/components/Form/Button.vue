<template>
  <button :type="type" class="button small responsive upper grey3">
    <i v-if="icon" class="material-icons fill">{{ icon }}</i>
    <span class="small-text">{{ title }}</span>
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
    margin: 16rem 0 16rem 0;
    padding: 0;

    i {
      color: var(--primary-highlight-color);
      font-size: 16px;
    }

    span {
      color: var(--primary-dark-color);
    }
  }
  button::after {
    background-image: none;
  }
</style>
