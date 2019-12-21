<template>
  <transition name="fade">
    <div
      class="extra__options__container"
      v-show="showExtraOptions"
    >
      <div class="extra__options">
        <div
          class="option"
          v-for="option in options"
          :key="option.id"
          @click="clickOption(option)"
        >
          {{option.text}}
          <circleBgc />
        </div>
      </div>

    </div>
  </transition>

</template>

<script>
import circleBgc from './circle_bgc.vue';
export default {
  name: "ExtraOptions",
  components: {
      circleBgc
  },
  props: {
    showExtraOptions: {
      required: true,
      type: Boolean
    },
    event: {
        required: true,
        type: Object
    }
  },
  watch: {
    showExtraOptions() {
      if (this.$props.event.canceled) {
        this.options.forEach(option => {
          if (option.text == 'Cancel this occurrence') {
            option.text = 'Undo cancellation'
          }
        })
      }
      else {
        this.options.forEach(option => {
          if (option.text == 'Undo cancellation') {
            option.text = 'Cancel this occurrence';
          }
        })
      }
    }
  },
  data() {
    return {
      options: [
        {
          text: "Remove this event"
        },
        {
          text: "Cancel this occurrence"
        },
        {
          text: "Set this event as first occurrence "
        },
        {
          text: "Set this event as last occurrence "
        }
      ]
    };
  },
  methods: {
      clickOption(opt) {
          eventBus.$emit('confirmationWindow', {
              event: this.event,
              text: opt.text
          })
          this.$emit('closeExtraOptions');
      }
  }
};
</script>

<style scoped>
.option {
  width: 100%;
  padding: 15px;
  transition: 0.3s;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.option:hover {
  background-color: rgba(211, 211, 211, 0.4);
}
.extra__options {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.extra__options__container {
  z-index: 9999;
  min-width: 75px;
  padding: 10px 0px 10px 0px;
  background: #fff;
  color: rgba(0, 0, 0, 0.87);
  position: absolute;
  top: 0;
  font-size: 1.05rem;
  border-radius: 2px;
  right: 0;
  transform: transitionX(-100%);
  font-weight: normal;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
}
</style>