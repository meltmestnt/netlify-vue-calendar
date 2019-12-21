<template>
  <div
    class="menu__container"
    :class="{hidden: !displayMenu}"
  >

    <Calendar @click="keepSlidedClass()" />
  </div>
</template>

<script>
import circleBgc from "./extras/circle_bgc.vue";
import popup from "./extras/popup.vue";
import Calendar from "./extras/calendar.vue";
export default {
  name: "Menu",
  components: {
    circleBgc,
    popup,
    Calendar
  },
  computed: {
    weekdays() {
      return this.$store.getters.returnDays;
    }
  },
  data() {
    return {
      displayMenu: false
    };
  },
  methods: {},
  mounted() {
    // Check this! It changes this.displayMenu twice because evaluates showMenu
    // function
    if (document.documentElement.clientWidth > 600) {
      eventBus.$emit("showMenu");
    }
  },
  created() {
    eventBus.$on("showMenu", ev => {
      this.displayMenu = !this.displayMenu;
    });
  }
};
</script>

<style scoped>
.menu__container {
  height: 94vh;
  width: 350px;
  white-space: nowrap;
  display: inline-block;
  border-right: 1px solid #e0e0e0;
  padding: 0px;
  transition: 0.3s cubic-bezier(0.19, 1, 0.22, 1);
}

.hidden {
  transform: translateX(-100%);
}

@media only screen and (max-width: 600px) {
  .menu__container {
    position: fixed;
    z-index: 9999;
    height: 100vh !important;
    top: 0;
    left: 0;
    background-color: #fff;
  }
}
</style>