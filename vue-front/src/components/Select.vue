<template lang="html">
  <div class="select">
    <button class="border transparent-border small-space" data-ui="#dropdown1_">
      <span>Select to add new track(s) in playlist</span>
      <i class="material icons">arrow_drop_down</i>
      <div id="dropdown1_" data-ui="#dropdown1_" class="dropdown">
        <a>Title</a>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Select',
};
</script>

<style lang="scss" scoped>
  .select {
    margin-top: 0;
    border-radius: 0;
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
    button:hover {
      background-color: #f5f5f5;
    }
  }
</style>
