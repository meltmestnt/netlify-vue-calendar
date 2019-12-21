<template>
  <div
    class="circle__container"
    @click="increaseSize($event)"
    :class="{rounded: $props.round}"
  >
    <div
      class="circle__background"
      :style="{backgroundColor: $props.color, width: `${x}px`, height: `${y}px`, opacity: `${opacity}`, top: `${top}px`, left: `${left}px`}"
      v-show="showCircle"
    >

    </div>
  </div>

</template>

<script>
export default {
  name: "circleBgc",
  props: {
      round: {
          type: Boolean
      },
      color: {
        type: String,
        default: 'rgba(128, 128, 128, 0.65)',
      }
  },
  data() {
    return {
      x: 20,
      y: 20,
      opacity: 1,
      showCircle: false,
      top: 50,
      left: 50,
    };
  },
  methods: {
    increaseSize(ev) {
        
      let left = ev.clientX - ev.currentTarget.getBoundingClientRect().left;
      let top = ev.clientY - ev.currentTarget.getBoundingClientRect().top;
      let stop = setInterval(() => {
        if (this.opacity <= 0) {
          clearInterval(stop);
          this.showCircle = false;
          this.x = 10;
          this.y = 10;
          this.opacity = 1;
          return;
        } else {
          this.showCircle = true;
          this.x += 3;
          this.y += 3;
          this.opacity -= 0.013;
          this.left = left;
          this.top = top;
        }
      }, 1);
    }
  }
};
</script>

<style scoped>
.circle__container {
  width: 100%;
  overflow: hidden;
  height: 100%;
  display: block;
  position: absolute;
  top: 0;
  z-index: 999;
  left: 0;
}
.rounded {
    border-radius: 50%;
}
.circle__background {
  border-radius: 50%;
  display: block;
  position: absolute;
  transform: translate(-50%, -50%);
}
</style>