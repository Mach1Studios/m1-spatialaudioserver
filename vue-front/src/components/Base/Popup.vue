<template>
  <button class="border round transparent-border" @click="open">
    <i class="material-icons">info</i>
    <div class="popup" :style="position">
      <p v-for="(value, key) in items" :key="value" class="info small-margin">
        <b class="upper">{{ key }}:</b> {{ value }}
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
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap');

  .popup {
    background-color: var(--secondary-dark-color);
    border-radius: 0;

    position: fixed;
    padding: 0.5em;
    z-index: 1000;

    p {
      color: var(--secondary-highlight-color);
      font-family: 'Courier Prime', monospace;
      text-align: justify;
    }

    b {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      color: var(--primary-highlight-color);
      font-weight: 600;
    }
  }

  i {
    color: var(--primary-highlight-color);
    font-size: 16px;

    cursor: pointer;
  }

  button {
    &:hover {
      i {
        color: var(--secondary-highlight-color);
        font-size: 20px;
      }
    }
  }

  .info {
    border-bottom: 1px var(--primary-highlight-color) dotted;
  }
</style>
