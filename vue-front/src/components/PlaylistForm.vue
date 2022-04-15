<template>
  <div class="playlist-form large-width">
    <FormInput name="name" placeholder="Name" type="text" v-model="item.name" @keyup.enter="click"/>
    <div>
      <FormButton :icon="icon" :title="title" @click="click"/>
    </div>
  </div>
</template>

<script>
import FormButton from './Form/Button.vue';
import FormInput from './Form/Input.vue';

export default {
  name: 'PlaylistForm',
  props: {
    id: String,
    name: String,
    title: String,
    icon: String,

    action: Function,
  },
  components: {
    FormButton,
    FormInput,
  },
  data() {
    return {
      item: {
        id: '',
        name: '',
      },
      focused: {},
    };
  },
  methods: {
    select({ target: { name }, type }) {
      if (type === 'focus') {
        this.focused[name] = true;
      } else if (type === 'blur' && this.item[name] === '') {
        this.focused[name] = false;
      }
    },
    click() {
      const { item } = this;
      this.action(item);
    },
  },
  created() {
    const { id, name } = this;
    if (id && name) {
      this.item.id = id;
      this.item.name = name;
    }
  },
};
</script>

<style lang="scss" scoped>
  .playlist-form {
    .title {
      font-style: normal;
      font-weight: bold;

      line-height: 1.17;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    i {
      font-size: 16px;
      color: #4d4d4d;
    }
    input {
      &:focus {
        border-color: #1c1c1c;
      }
    }
    select{
      &:focus {
        border-bottom: 2rem solid #1c1c1c;
      }
    }
    span {
      color: #1c1c1c;
    }
    i {
      font-size: 16px;
      color: #4d4d4d;
    }
    button {
      width: 100%;
      padding: 0;
      margin: 16rem 0 16rem 0;
    }
  }
</style>
