<template>
  <button class="button border round transparent-border small-space grey-light-3">
    <i class="material-icons">{{icon}}</i>
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
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  width: 100%;
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
