<template>
  <div id="app"
  @click="closeWindow($event)"
  >
    
    <transition
      name="fade"
      @afterEnter='afterEnter'
    >
      <div
        class="fadeBgc"
        v-if="fadeBgc"
        @click="removeFade($event)"
      >
      </div>
    </transition>
    <Header />
    <div class="menu__and__header">
      <Menu />
      <monthContainer />
    </div>

  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Menu from "./components/Menu.vue";
import monthContainer from "./components/layouts/monthContainer.vue";

export default {
  name: "app",
  components: {
    Header,
    Menu,
    monthContainer,
    
  },
  data() {
    return {
      fadeBgc: false
    };
  },
  methods: {
    afterEnter(el) {
      el.classList.add("opacity_fade");
    },
    removeFade(ev) {
      eventBus.$emit("fadeBackground", ev);
    },
    closeWindow(ev) {
      eventBus.$emit('closeWindow', ev)
    }
  },
  created() {
    this.$store.commit('initialiseMonthes');
    eventBus.$on("fadeBackground", ev => {
      if (
        !ev.currentTarget.classList.contains("burger") &&
        !ev.currentTarget.classList.contains("fadeBgc")
      ) {
        return;
      }
      if (ev.currentTarget.classList.contains("fadeBgc")) {
        eventBus.$emit("showMenu", ev);
      }
      this.fadeBgc = !this.fadeBgc;
    });
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
.opacity_bgc {
  background-color: rgba(0, 0, 0, 0.3);  
}
.opacity_fade {
  opacity: 0.3;
}
.fade-enter-active,
.fade-leave-active {
  transition: 0.5s all;
}
.fade-enter-to,
.fade-leave {
  opacity: 0.3;
}
.fade-leave-to,
.fade-enter {
  opacity: 0;
}
body,head {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}
.fadeBgc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128) !important;
  z-index: 99;
}
.menu__and__header {
  width: 100%;
  height: 94vh;
  display: flex;
  flex-direction: row;
  overflow: visible;
  align-items: center;
  position: relative;
  transition: 0.6s all cubic-bezier(0.19, 1, 0.22, 1);
}
#app {
  overflow: visible;
  font-family: "Roboto", sans-serif;
  width: 100%;
  height: 100%;
  transition: 0.6s all cubic-bezier(0.19, 1, 0.22, 1);
}
p,button,div, h1,h2,h3,h4,h5,h6, input {
  font-family: "Roboto", sans-serif;
}
.animatePrevention {
  animation: preventClose 0.3s 1;
}
.scaled {
  transform: scale(1, 1) !important;
  opacity: 1 !important;
  transition: 0.25s all cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes preventClose {
  0% {
    transform: scale(1, 1);
  }
  5% {
    transform: scale(1.03, 1.03);
  }
  50%,
  100% {
    transform: scale(1, 1);
  }
}
</style>
