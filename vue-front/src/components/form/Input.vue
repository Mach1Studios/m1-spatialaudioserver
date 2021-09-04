<template lang="html">
  <div class="field label border">
    <input :name="name" :type="type" :value="value" @focus="select" @blur="select" autocomplete="off">
    <label v-show="plaseholder" :class="{ active: focused }">{{plaseholder}}</label>
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: 'text',
    },
    value: {
      type: String,
    },
    plaseholder: {
      type: String,
    },
  },
  data() {
    return { focused: false };
  },
  methods: {
    select({ target: { name }, type }) {
      console.log(name, type);
      if (type === 'focus') {
        this.focused = true;
      } else if (type === 'blur' && this.value === '') {
        this.focused = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
