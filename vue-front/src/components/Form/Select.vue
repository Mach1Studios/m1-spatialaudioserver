<template>
  <div class="field label suffix border" :class="selectSkin">
    <select
      :name="name"
      :value="modelValue"
      @blur="select"
      @focus="select"
      @input="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="option in options" :key="option.id" class="decorated" :value="option.id">
        <label>{{ option.name }}</label>
      </option>
    </select>
    <label v-show="placeholder" :class="{ active: focused }">{{ placeholder }}</label>
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
    modelValue: {
      type: String,
      default() {
        return null;
      },
    },
    placeholder: {
      type: String,
    },
    options: {
      type: Array,
    },
    // defaultValue: {
    //   type: String,
    //   default() {
    //     return null;
    //   },
    // },
    selectSkin: {
      type: String,
      default: 'light',
      validator: (value) => (value === 'light' ? 'light' : 'dark'),
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
    if (this.modelValue !== '') {
      this.focused = true;
    }
  },
};
</script>

<style lang="scss" scoped>
  .field {
    margin-bottom: 0;
  }

  option {
    color: var(--secondary-dark-color);
  }

  select {
    clip-path: none !important;
  }

  .field.light.label.border:not(.fill)>label.active {
    color: var(--additional-accent-color);
  }

  .field.light > select {
    color: var(--secondary-light-color);
  }

  .field.dark > select {
    color: var(--secondary-light-color);
  }

  .field.light {
    select {
      -webkit-text-fill-color: var(--secondary-dark-color) !important;
      border: 1rem var(--additional-color) solid;

      color: var(--secondary-light-color);
    }

    label {
      background-color: var(--primary-light-color);
      padding: 0 4rem 0 4rem;
    }
  }

  .field.dark {
    i {
      color: var(--additional-accent-color);
    }

    select {
      -webkit-text-fill-color: var(--secondary-highlight-color) !important;
      border: 1rem var(--secondary-color) solid;

      color: var(--secondary-highlight-color);
    }

    label {
      background-color: var(--secondary-dark-color);
      padding: 0 4rem 0 4rem;
    }
  }

  .field.light.label>:focus~label {
    background-color: var(--primary-light-color);
    color: var(--secondary-dark-color);
  }

  .field.dark.label.border:not(.fill)>label.active {
    color: var(--additional-accent-color);
  }

  .field.light select:focus {
    border: 1rem var(--additional-color) solid;
  }

  .field.dark select:focus {
    border: 1rem var(--additional-accent-color) solid;
  }

  .field.dark.label>:focus~label {
    background-color: var(--secondary-dark-color);
    color: var(--additional-accent-color);
  }
</style>
