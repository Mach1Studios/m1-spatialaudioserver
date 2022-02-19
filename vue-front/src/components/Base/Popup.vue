<template>
  <button class="border round transparent-border" @click="open">
    <i class="material-icons-outlined">info</i>
    <div class="popup card" :style="position">
      <p v-for="(value, key) in items" :key="value" class="info small-margin">
        <b class="upper">{{key}}:</b> {{value}}
      </p>
    </div>
  </button>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    active: {
      type: Boolean,
      default() {
        return false;
      },
    },
    items: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return { left: 0, top: 0, show: false };
  },
  computed: {
    position() {
      return {
        display: this.active ? 'block' : 'none',

        top: `${this.top}px`,
        left: `${this.left}px`,
      };
    },
  },
  methods: {
    open(event) {
      this.show = true;

      this.top = event.pageY;
      this.left = event.pageX;
    },
  },
};
</script>

<style lang="scss" scoped>
  .popup {
    position: fixed;
    z-index: 1000;
    padding: 0.5em;
    border-radius: 1em;
    background-color: #252526;
    p {
      color: #ffffff;
    }
    b {
      color: #72646f;
      font-weight: 600;
    }
  }
  i {
    color: #4d4d4d;
    cursor: pointer;
    font-size: 16px;
  }
  button {
    &:hover {
      i {
        font-size: 20px;
        color: #ffffff;
      }
    }
  }

  .info {
    border-bottom: 1px #4d4d4d dotted;
  }
  p {
    text-align: justify;
  }
</style>
