<template lang="html">
  <div class="field label border">
    <input
      :name="name"
      :type="type"
      :value="modelValue"
      @blur="select"
      @focus="select"
      @input="$emit('update:modelValue', $event.target.value)"

      autocomplete="off"
    >
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
    modelValue: {
      type: String,
    },
    plaseholder: {
      type: String,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return { focused: false };
  },
  methods: {
    select({ type }) {
      if (type === 'focus') {
        this.focused = true;
      } else if (type === 'blur' && this.modelValue === '') {
        this.focused = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.field {
  input {
    &:focus {
      border-color: #1c1c1c;
    }
  }
}
</style>
