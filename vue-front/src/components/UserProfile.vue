<template>
  <div>
    <form class="user-profile">
      <h4 class="title large-text upper">User name</h4>
      <FormInput name="nickname" placeholder="Nickname" type="text" v-model="user.nickname"/>
      <FormButton title="change username" icon="check" @click="click"/>
      <h4 class="title large-text upper">Change password</h4>
      <FormInput
        v-if="!user.id"
        v-model="user.password"

        autocomplete="new-password"
        name="password"
        placeholder="Old password"
        type="password"
      />
      <FormInput
        v-if="!user.id"
        v-model="user.password"

        autocomplete="new-password"
        name="password"
        placeholder="New password"
        type="password"
      />
      <FormInput
        v-if="!user.id"
        v-model="user.password"

        autocomplete="new-password"
        name="password"
        placeholder="Repeat new password"
        type="password"
      />
      <FormButton title="change password" icon="check" @click="click"/>
    </form>
  </div>
</template>

<script>

import FormInput from './Form/Input.vue';
import FormButton from './Form/Button.vue';

export default {
  name: 'UsersAddForm',
  components: {
    FormInput,
    FormButton,
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
      user: {},
      focused: {},
    };
  },
  methods: {
    select({ target: { name }, type }) {
      if (type === 'focus') {
        this.focused[name] = true;
      } else if (type === 'blur' && this.user[name] === '') {
        this.focused[name] = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  h4 {
    color: #ffffff;
  }
</style>
