<template>
  <transition
    name="fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      class="confirmation__container"
      v-show="showConfirmationWindow"
      @click.self="preventClosing($event)"
    >
      <div
        class="confirmation__window"
        :class="{animatePrevention: animatePrevention, scaled: scaled}"
      >
        <div class="confirmation_paragraph">
          {{`Are you sure you want to ${info.text ? info.text.toLowerCase() : ''}?`}}
        </div>
        <div class="buttons__container">
          <button
            class="yes__button"
            @click="confirmed()"
          >
            yes
            <circleBgc :color="'rgba(25, 118, 210, 0.6)'" />
          </button>
          <button
            class="no__button"
            @click="cancelConfirmation()"
          >
            no
            <circleBgc />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import circleBgc from "./circle_bgc";
export default {
  name: "Confirmation",
  props: {
    showConfirmationWindow: {
      type: Boolean
    },
    info: {
      type: Object
    }
  },
  components: {
    circleBgc
  },
  data() {
    return {
      animatePrevention: false,
      scaled: false
    };
  },
  methods: {
    confirmed() {
      switch (this.$props.info.text) {
        case "Remove this event":
          this.$store.commit("removeEvent", this.$props.info.event);
          this.cancelConfirmation();
          break;
        case "Cancel this occurrence":
          this.$store.commit("cancelOccasion", this.$props.info.event);
          this.cancelConfirmation();
          break;
      }
    },
    afterEnter(el) {
      el.classList.add("opacity_bgc");
      this.scaled = true;
    },
    afterLeave(el) {
      el.classList.remove("opacity_bgc");
      this.scaled = false;
    },
    cancelConfirmation() {
      this.$emit("cancelConfirmation");
    },
    preventClosing() {
      this.animatePrevention = true;
      setTimeout(() => (this.animatePrevention = false), 300);
    }
  }
};
</script>

<style scoped>
.confirmation__container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  z-index: 99999;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.confirmation__window {
  background-color: #fff;
  padding: 15px;
  opacity: 0;
  border-radius: 3px;
  transform: scale(1.5, 1.5);
  box-shadow: 0 20px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-between;
  color: black;
  font-size: 0.95rem;
}
.confirmation__paragraph {
  width: 100%;
  padding: 5px;
  font-weight: 500;
  color: gray;
}
.buttons__container {
  width: 100%;
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.yes__button,
.no__button {
  padding: 10px;
  width: 100px;
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  text-transform: uppercase;
  background-color: rgba(211, 211, 211, 0.4);
  font-weight: 600;
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
  outline: none;
  border: none;
  transition: 0.3s;
}
.yes__button {
  color: rgb(25, 118, 210, 0.9);
}
.yes__button:hover {
  background-color: rgba(25, 118, 210, 0.25);
}
.no__button:hover {
  background-color: rgba(211, 211, 211, 0.6);
}
</style>