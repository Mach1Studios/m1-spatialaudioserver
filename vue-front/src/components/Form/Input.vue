<template>
  <div class="field label border">
    <input
      :name="name"
      :type="type"
      :value="modelValue"

      :autocomplete="autocomplete"
      :required="required"
      @blur="select"

      @focus="select"
      @input="$emit('update:modelValue', $event.target.value)"
    >
    <label v-show="placeholder" :class="{ active: focused }">{{ placeholder }}</label>
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
      -webkit-text-fill-color: var(--secondary-highlight-color) !important;
      border: 1rem var(--secondary-color) solid;

      color: var(--secondary-highlight-color);

      &:-webkit-autofill {
        transition: background-color 5000s ease-in-out 0s;
      }

      &:focus {
        border: 1rem var(--additional-accent-color) solid;
      }
    }

    label {
      background-color: var(--secondary-dark-color);
      padding: 0 4rem 0 4rem;
    }
  }

  .field.label>:focus~label {
    background-color: var(--secondary-dark-color);
    color: var(--additional-accent-color);
  }

  .field label {
    color: var(--additional-accent-color);
  }

  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }
</style>
