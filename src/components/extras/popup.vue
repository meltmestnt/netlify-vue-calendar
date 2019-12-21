<template>
  <transition name="slideTop">
    <div
      class="popup__container"
      :class="{left_aligned: $props.info.leftAligned}"
      v-show="$props.info.show"
    >
      <p> {{$props.info.text}} </p>
    </div>
  </transition>

</template>

<script>
export default {
  name: "popup",
  props: {
    info: {
      type: Object
    }
  }
};
</script>

<style scoped>
.left_aligned {
  left: 150% !important;
}
.slideTop-enter-active,
.slideTop-leave-active {
  transition: 0.3s all;
}
.slideTop-enter-to,
.slideTop-leave {
  opacity: 1;
  transform: translate(-50%, 0%) !important;
}
.slideTop-enter,
.slideTop-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%) !important;
}
.popup__container {
  font-weight: 300;
  padding: 5px 10px 5px 10px;
  color: white;
  background-color: rgba(99, 99, 99, 0.9);
  box-shadow: 0px 1px 10px -1px black;
  position: absolute;
  border-radius: 2px;
  left: 50%;
  white-space: nowrap;
  font-size: 0.8rem;
  z-index: 9999;
  text-transform: none;
  transform: translate(-50%, 0);
  top: 150%;
}
@media only screen and (max-width: 600px) {
  .popup__container {
    white-space: nowrap;
    transform: translate(-30%, 0) !important;
  }
}
</style>