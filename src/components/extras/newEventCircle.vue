<template>
  <div class="new__event__container" @click="createEvent()">
      <circleBgc :round="true" :color="'rgba(255,255,255,0.5)'" />
    <span class="line"></span><span class="line"></span>
  </div>
</template>

<script>
import circleBgc from './circle_bgc.vue';
export default {
  name: "CircleCreate",
  components: {
      circleBgc,
  },
  props: {
    
  },
  data() {
    return {};
  },
  methods: {
    createEvent() {
      this.$emit('createEvent', document.querySelector('div[data-day="1"]'),
      null);
    }
  }
};
</script>

<style scoped>
.line {
    width: 25%;
    height: 2px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.line:last-child {
    transform: translate(-50%, -50%) rotate(90deg);
}
.new__event__container {
  width: 65px;
  height: 65px;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
  border-radius: 50%;
  background-color: #4287f5;
  position: fixed;
  bottom: 3%;
  z-index: 9999;
  cursor: pointer;
  right: 3%;
}
</style>