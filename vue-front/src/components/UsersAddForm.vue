<template lang="html">
  <div class="add-user">
    <FormInput name="nickname" placeholder="Nickname" v-model="user.nickname"/>
    <FormInput name="email" placeholder="E-mail" v-model="user.email"/>
    <FormInput name="password" placeholder="Password" v-model="user.password"/>

    <FormSelect name="users" placeholder="Role" :options="roles" v-model="user.role"/>
    <button class="border round transparent-border small-space grey-light-3" @click="add()">
      <i class="material-icons">add</i>
      <span class="small-text">Add User</span>
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import FormInput from './Form/Input.vue';
import FormSelect from './Form/Select.vue';

export default {
  name: 'UsersAddForm',
  components: {
    FormInput,
    FormSelect,
  },
  data() {
    return {
      roles: ['user', 'admin'],
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
    ...mapActions('users', ['create']),
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
  },
};
</script>

<style lang="scss" scoped>
  .add-user {
    i {
      font-size: 16px;
      color: #4d4d4d;
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
