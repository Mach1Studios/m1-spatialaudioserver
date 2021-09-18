<template>
  <div class="add-user">
    <FormInput name="nickname" placeholder="Nickname" type="text" v-model="user.nickname"/>
    <FormInput name="email" placeholder="E-mail" type="text" v-model="user.email"/>
    <FormInput name="password" placeholder="Password" type="password" v-model="user.password"/>
    <FormSelect name="users" placeholder="Role" :options="roles" v-model="user.role"/>
    <FormButton v-if="!userId" title="Add User" icon="add" @click="add()"/>
    <FormButton v-else title="Save" icon="save" @click="save()"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

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
    userId: String,
  },
  data() {
    return {
      roles: [{ id: 'user', name: 'user' }, { id: 'admin', name: 'admin' }],
      user: {
        nickname: '',
        email: '',
        role: '',
        password: '',
      },
      focused: {},
    };
  },
  methods: {
    ...mapActions('users', ['create', 'update']),
    select({ target: { name }, type }) {
      if (type === 'focus') {
        this.focused[name] = true;
      } else if (type === 'blur' && this.user[name] === '') {
        this.focused[name] = false;
      }
    },
    add() {
      this.create(this.user);
    },
    save() {
      this.update(this.user);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
