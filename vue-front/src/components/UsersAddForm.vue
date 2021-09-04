<template lang="html">
  <FormInput name="nickname" plaseholder="Nickname" v-model="user.nickname"/>
  <FormInput name="email" plaseholder="E-mail" v-model="user.email"/>
  <FormInput name="password" plaseholder="Password" v-model="user.password"/>

  <div class="field label sufix">
    <select v-model="user.role">
      <option>user</option>
      <option>admin</option>
    </select>
    <label class="active">Role</label>
    <i class="material-icons">arrow_drop_down</i>
  </div>
  <button class="border round transparent-border small-space grey-light-3" @click="add()">
    <i class="material-icons">add</i>
    <span class="small-text">Add User</span>
  </button>
</template>

<script>
import { mapActions } from 'vuex';
import FormInput from './form/Input.vue';

export default {
  name: 'UsersAddForm',
  components: { FormInput },
  data() {
    return {
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
  // .add-user {
  //   i {
  //     font-size: 16px;
  //     color: #4d4d4d;
  //   }
  //   input {
  //     &:focus {
  //       border-color: #1c1c1c;
  //     }
  //   }
  //   select{
  //     &:focus {
  //       border-bottom: 2rem solid #1c1c1c;
  //     }
  //   }
  //   span {
  //     color: #1c1c1c;
  //   }
  //   i {
  //     font-size: 16px;
  //     color: #4d4d4d;
  //   }
  //   button {
  //     width: 100%;
  //     padding: 0;
  //     margin: 16rem 0 16rem 0;
  //   }
  // }
</style>
