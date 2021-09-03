<template lang="html">
  <div class="no-margin" :class="paddingSize">
    <button class="round border transparent-border open" :class="buttonFeature" @click="open">
      <i v-show="icon" class="material-icons">{{icon}}</i>
      <span class="small-text">{{title}}</span>
    </button>
    <div v-show="active" class="overlay active dark" @click="close"></div>
    <div class="modal round" :class="currentPosition">
      <nav>
        <button class="transparent round absolute right close" @click="close">
          <i class="material-icons">highlight_off</i>
        </button>
      </nav>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Modal',
  props: {
    position: {
      type: String,
    },
    feature: {
      type: String,
    },
    padding: {
      type: String,
    },
    title: String,
    icon: String,
  },
  data() {
    return { active: false };
  },
  computed: {
    currentPosition() {
      const { active, position } = this;
      return {
        active,
        [position]: true,
      };
    },
    buttonFeature() {
      const { feature } = this;
      return {
        [feature]: true,
      };
    },
    paddingSize() {
      const { padding } = this;
      return {
        [padding]: true,
      };
    },
  },
  methods: {
    close() {
      this.active = false;
    },
    open() {
      this.active = true;
    },
  },
};
</script>

<style lang="scss" scoped>
  .open {
    i {
      font-size: 14px;
      color: #4d4d4d;
    }
    span {
      color: #1c1c1c;
      font-size: 14px;
    }
  }

  .open:hover {
    i {
      font-size: 18px;
    }
  }
  .close {
    padding-top: 16px;
    padding-right: 0;
    i {
      color: #1c1c1c;
    }
  }

  td>nav>div>button {
    min-height: 24rem;
    max-height: 24rem;
  }
</style>
