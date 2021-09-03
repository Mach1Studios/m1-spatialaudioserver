<template lang="html">
  <div class="large-width add-user">
    <h4 class="title center-align large-text">User Form</h4>
    <div class="field label border">
      <input name="nickname" type="text" autocomplete="off" v-model="user.nickname" @focus="select" @blur="select">
      <label :class="{ active: focused.nickname }">Nickname</label>
    </div>
    <div class="field label border">
      <input name="email" type="text" autocomplete="off" v-model="user.email" @focus="select" @blur="select">
      <label :class="{ active: focused.email }">E-mail</label>
    </div>
    <div class="field label border">
      <input name="password" type="password" autocomplete="new-password" v-model="user.password" @focus="select" @blur="select">
      <label :class="{ active: focused.password }">Password</label>
    </div>
    <div class="field label sufix">
      <select v-model="user.role">
        <option>user</option>
        <option>admin</option>
      </select>
      <label class="active">Role</label>
      <i class="material-icons">arrow_drop_down</i>
    </div>
    <div>
      <button class="border round transparent-border small-space grey-light-3" @click="add()">
        <i class="material-icons">add</i>
        <span class="small-text">Add User</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'UsersAddForm',
  data() {
    return {
      user: {
        nickname: '',
        email: '',
        role: '',
        password: '',
      },
      focused: {

      },
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
