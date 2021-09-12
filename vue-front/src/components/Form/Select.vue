<template>
  <div class="field label sufix">
    <select
      :name="name"
      :value="modelValue"
      @blur="select"
      @focus="select"
      @input="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="option in options" :key="option.id" :value="option.id"><label>{{ option.name }}</label></option>
    </select>
    <label v-show="placeholder" :class="{ active: focused }">{{placeholder}}</label>
    <i class="material-icons">arrow_drop_down</i>
  </div>
</template>

<script>

export default {
  name: 'FormSelect',
  props: {
    name: {
      type: String,
      required: true,
    },
    // type: {
    //   type: String,
    //   required: true,
    //   default: 'text',
    // },
    modelValue: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    options: {
      type: Array,
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
    select {
      &:focus {
        border-color: #1c1c1c;
        border-bottom: none;
      }
    }
  }
</style>
