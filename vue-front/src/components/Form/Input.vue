<template>
  <div class="field label border">
    <input
      :name="name"
      :type="type"
      :value="modelValue"

      @blur="select"
      @focus="select"
      @input="$emit('update:modelValue', $event.target.value)"

      :autocomplete="autocomplete"
      :required="required"
    >
    <label v-show="placeholder" :class="{ active: focused }">{{placeholder}}</label>
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
    placeholder: {
      type: String,
    },
    autocomplete: {
      type: String,
      default: 'off',
      required: false,
    },
    required: {
      type: Boolean,
      default: true,
      required: false,
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
  created() {
    this.focused = this.modelValue !== '';
  },
};
</script>

<style lang="scss" scoped>
  .field {
    input {
      // clip-path: polygon(0% 0%, 12rem 0%, 12rem 8rem, 80rem 8rem, 80rem 0%, 100% 0%, 100% 100%, 0% 100%);
      border: 1rem #323237 solid;
      color: #ffffff;
      -webkit-text-fill-color: #ffffff !important;
      &:focus {
        border: 1rem #55555c solid;
      }
    }
    label {
      background-color: #252526;
      padding: 0 4rem 0 4rem;
    }
  }
  .field.label>:focus~label {
    color: #55555c;
    background-color: #252526;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }
</style>
