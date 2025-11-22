<template>
  <div class="playlist-form">
    <FormInput v-model="item.name" name="name" placeholder="Name" type="text" @keyup.enter="click" />
    <div>
      <FormButton :icon="icon" :title="title" @click="click" />
    </div>
  </div>
</template>

<script>
import FormButton from './Form/Button.vue';
import FormInput from './Form/Input.vue';

export default {
  name: 'PlaylistForm',
  components: {
    FormButton,
    FormInput,
  },
  props: {
    id: String,
    name: String,
    title: String,
    icon: String,

    action: Function,
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
    async click() {
      const { item } = this;
      await this.action(item);
      // Reset form after successful action (only for new playlists, not updates)
      if (!this.id) {
        this.item.name = '';
      }
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
