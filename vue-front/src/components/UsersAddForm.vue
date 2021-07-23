<template lang="html">
  <div class="large-width list">
    <h4 class="title center-align">User Form</h4>
    <div class="field label round fill">
      <input type="text">
      <label>Nickname</label>
    </div>
    <div class="field label round fill">
      <input type="text">
      <label>E-mail</label>
    </div>
    <div class="field label round fill">
      <input type="text">
      <label>Role</label>
    </div>
    <div>
      <button class="round large border grey-light-3 transparent-border black-text open no-margin no-padding">
        <i class="black-text">add</i>
        <span>Add User</span>
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UsersList',
};
</script>

<style lang="scss" scoped>
.list .title {
  font-style: normal;
  font-weight: bold;
  font-size: 1rem;

  line-height: 1.17;
  letter-spacing: -0.5px;
  text-transform: uppercase;
}
.open {
  width: 100%;
  i {
    margin-right: 0;
  }
}
</style>
