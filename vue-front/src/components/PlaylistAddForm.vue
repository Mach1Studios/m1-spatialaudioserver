<template>
  <div class="large-width add-playlist">
    <h4 class="title center-align large-text">New playlist</h4>
    <div class="field label border">
      <input name="name" type="text" autocomplete="off" @focus="select" @blur="select">
      <label>Name</label>
    </div>
    <div>
      <button class="border round transparent-border small-space grey-light-3" @click="add()">
        <i class="material-icons">add</i>
        <span class="small-text">Add Playlist</span>
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PlaylistAddForm',
};
</script>

<style lang="scss" scoped>
  .add-playlist {
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
