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
  option {
    color: #252526;
  }

  .field.light.label.border:not(.fill)>label.active {
    color: #55555c;
  }

  .field.light > select {
    color: #eaeaea;
  }

  .field.dark > select {
    color: #eaeaea;
  }

  .field.light {
    select {
      border: 1rem #b1b1b1 solid;
      color: #eaeaea;
      -webkit-text-fill-color: #252526 !important;
    }
    label {
      background-color: #e0e0e0;
      padding: 0 4rem 0 4rem;
    }
  }

  .field.dark {
    select {
      border: 1rem #323237 solid;
      color: #ffffff;
      -webkit-text-fill-color: #ffffff !important;
    }
    label {
      background-color: #252526;
      padding: 0 4rem 0 4rem;
    }
  }

  .field.light.label>:focus~label {
    color: #252526;
    background-color: #e0e0e0;
  }

  .field.dark.label.border:not(.fill)>label.active {
    color: #55555c;
  }

  .field.light select:focus {
    border: 1rem #b1b1b1 solid;
  }
  .field.dark select:focus {
      border: 1rem #55555c solid;
  }
  .field.dark.label>:focus~label {
    color: #55555c;
    background-color: #252526;
  }
</style>
