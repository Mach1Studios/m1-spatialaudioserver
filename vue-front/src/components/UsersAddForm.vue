<template>
  <form class="add-user" @submit.prevent="click">
    <FormInput v-model="user.nickname" name="nickname" placeholder="Nickname" type="text" />
    <FormInput v-model="user.email" name="email" placeholder="E-mail" type="text" />
    <FormInput
      v-if="!user.id"
      v-model="user.password"

      autocomplete="new-password"
      name="password"
      placeholder="Password"
      type="password"
    />
    <FormSelect v-model="user.role" name="users" placeholder="Role" select-skin="dark" :options="roles" />
    <FormButton :icon="icon" :title="title" @click="click" />
  </form>
</template>

<script>
// import { mapActions } from 'vuex';

import FormButton from './Form/Button.vue';
import FormInput from './Form/Input.vue';
import FormSelect from './Form/Select.vue';

export default {
  name: 'UsersAddForm',
  components: {
    FormButton,
    FormInput,
    FormSelect,
  },
  props: {
    title: String,
    icon: String,
    item: {
      type: Object,
      required: false,
    },

    action: Function,
  },
  data() {
    return {
      roles: [
        { id: 'user', name: 'user' },
        { id: 'admin', name: 'admin' },
      ],
      user: {},
      focused: {},
    };
  },
  methods: {
    // ...mapActions('users', ['create', 'update']),
    select({ target: { name }, type }) {
      if (type === 'focus') {
        this.focused[name] = true;
      } else if (type === 'blur' && this.user[name] === '') {
        this.focused[name] = false;
      }
    },
    async click() {
      const { user } = this;
      await this.action(user);
    },
    // add() {
    //   this.create(this.user);
    // },
    // save() {
    //   this.update(this.user);
    // },
  },
  created() {
    const { item } = this;
    if (item && item.id) {
      this.user = { ...item };
    }
  },
};
</script>
