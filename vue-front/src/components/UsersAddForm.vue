<template lang="html">
  <div class="large-width list">
    <h4 class="title center-align large-text">User Form</h4>
    <div class="field label border">
      <input type="text" v-model="user.nickname" @focus="test()">
      <label :class="{ active: isActiveNickname }">Nickname</label>
    </div>
    <div class="field label border">
      <input type="text" v-model="user.email">
      <label class="active">E-mail</label>
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
      <button class="round large border grey-light-3 transparent-border black-text" @click="add()">
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
      },
      isActiveNickname: false,
    };
  },
  methods: {
    ...mapActions('users', ['create']),
    test() {
      console.log('test');
      this.isActiveNickname = true;
    },
    add() {
      this.create(this.user);
      console.log(this.user);
    },
  },
};
</script>

<style lang="scss" scoped>
  .list {
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
  }
</style>
