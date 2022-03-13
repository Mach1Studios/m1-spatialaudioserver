<template>
  <div class="field label suffix border">
    <select
      :name="name"
      :value="modelValue"

      @blur="select"
      @focus="select"
      @input="$emit('update:modelValue', $event.target.value)"

      :class="{ defaultClass }"
    >
      <option class="decorated" v-for="option in options" :key="option.id" :value="option.id" :selected="defaultValue === option.id"><label>{{ option.name }}</label></option>
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
    modelValue: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    options: {
      type: Array,
    },
    defaultValue: {
      type: String,
      default() {
        return null;
      },
    },
    defaultClass: {
      type: String,
      default() {
        return 'defaultClass';
      },
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
  .defaultClass {
    color: #1c1c1c;
  }
  .field>select {
    color: #1c1c1c;
  }
  .field {
    select {
      &::-webkit-scrollbar-track
      {
        border-radius: 3em;
        background-color: #ffffff;
      }

      &::-webkit-scrollbar
      {
        width: 5px;
        background-color: #ffffff;
      }

      &::-webkit-scrollbar-thumb
      {
        border-radius: 3em;
        background-color: #858585;
      }
      &:focus {
        border: 1rem #55555c solid;
      }
      &:focus-within {
        border: 1rem #55555c solid;
      }
    }
  }
  label {
    padding: 0 4rem 0 4rem;
    background-color: #e0e0e0;
  }
  option {
    color: #252526;
  }
  .field.label.border:not(.fill)>label.active {
    color: #55555c;
  }
</style>
