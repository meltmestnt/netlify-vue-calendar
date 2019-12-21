<template>
  <transition name="fade">
    <div
      class="event__info"
      :style="{transform: `translate(${x}, ${y})`, left: `${left}`}"
      @click.stop="closeExtraOptions($event)"
    >
      <div
        class="event__info_upper"
        :style="{'background-color': $props.event.color.color}"
      >
        <p class="title">
          {{event.title}}
        </p>
        <div class="controls">
          <div class="controls__wrapper">
            <extraOptions
              @closeExtraOptions="showExtraOptions = false"
              :event="event"
              :showExtraOptions="showExtraOptions"
            />
            <div
              class="control"
              @mouseover="showPopup($event, info)"
              @mouseleave="clearPopups()"
              @click.stop="showExtraOptions = true"
            >
              <font-awesome-icon icon="ellipsis-v" />
              <circleBgc
                :color="'rgba(255,255,255,0.7)'"
                :round="true"
              />
              <popup :info="info" />
            </div>
            <div
              class="control"
              @click="$emit('closeinfo', $event)"
            >
              <div class="close__container">
                <div class="stripe"></div>
                <div class="stripe"></div>
              </div>
              <circleBgc
                :color="'rgba(255,255,255,0.7)'"
                :round="true"
              />
            </div>

          </div>
        </div>
      </div>
      <div class="event__info_lover">
        <div
          class="pencil"
          @click="$emit('openEditInfo')"
        >
          <font-awesome-icon icon="pen" />
          <circleBgc
            :color="'rgba(255,255,255,0.7)'"
            :round="true"
          />
        </div>
        <div class="info__container">
          <div class="date__wrapper">
            <font-awesome-icon :icon="['far', 'clock']" />
            <p class="date__info">{{computeDate}}</p>
          </div>
          <div class="date__wrapper">
            <font-awesome-icon icon="suitcase" />
            <p class="type">{{$props.event.isBusy ? 'Busy' : 'Free'}}</p>
          </div>
          <div
            class="date__wrapper"
            v-show="$props.event.country"
          >
            <font-awesome-icon icon="map-marker-alt" />
            <p class="type">{{$props.event.country}}</p>
          </div>
          <div
            class="date__wrapper"
            v-show="$props.event.description"
          >
            <font-awesome-icon icon="align-left" />
            <p class="type">{{$props.event.description}}</p>
          </div>
          <div
            class="date__wrapper"
            v-show="$props.event.type"
          >
            <font-awesome-icon :icon="['far', 'calendar-alt']" />
            <p class="type">{{$props.event.type}}</p>
          </div>
          <div
            class="date__wrapper"
            v-show="$props.event.extraType.icon"
          >
            <font-awesome-icon :icon="$props.event.extraType.icon" />
            <p class="type">{{$props.event.extraType.text}}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
import circleBgc from "./extras/circle_bgc.vue";
import popup from "./extras/popup.vue";
import extraOptions from "./extras/extra_options.vue";
export default {
  name: "EventInfo",
  components: {
    extraOptions,
    circleBgc,
    popup
  },
  data() {
    return {
      showExtraOptions: false,
      info: {
        text: "Options",
        show: false
      },
      x: "0",
      y: "0",
      left: "100%"
    };
  },
  watch: {
    show() {
      this.computeLeft();
      this.computeTop();
    }
  },
  methods: {
    closeExtraOptions(ev) {
      if (document.querySelector(".controls__wrapper").contains(ev.target))
        return;
      this.showExtraOptions = false;
    },
    showPopup(ev, show) {
      if (
        ev.target == ev.currentTarget ||
        ev.target.classList.contains("circle__container")
      ) {
        show.show = true;
      }
    },
    clearPopups() {
      this.info.show = false;
    },
    computeLeft() {
      if (
        (this.target.getBoundingClientRect().left +
          450 +
          this.target.offsetWidth >=
          document.documentElement.clientWidth &&
          this.target.getBoundingClientRect().left > 450) ||
        (this.target.getBoundingClientRect().left +
          450 +
          this.target.offsetWidth >=
          window.innerWidth &&
          this.target.getBoundingClientRect().left > 450)
      ) {
        this.x = "-100%";
        this.left = "0";
      } else {
        this.x = "0%";
      }
    },
    computeTop() {
      if (
        this.target.getBoundingClientRect().top + 340 >
          document.documentElement.clientHight ||
        this.target.getBoundingClientRect().top + 340 > window.innerHeight
      ) {
        this.y = "-100%";
      } else {
        this.y = "0";
      }
    }
  },
  props: {
    event: {
      type: Object
    },
    show: {
      type: Boolean
    },
    target: {
      required: true
    },
    prevMonth: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computeDate() {
      let date = new Date(
          +this.$store.getters.returnDate.year,
          this.event.monthNumber,
          this.event.day
        ),
        weekday = date.getDay(),
        days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        year = +this.$store.getters.returnDate.year;
      if (this.event.month == "December" && this.prevMonth) {
        year -= 1;
      }
      for (let i = 0; i < days.length; i++) {
        if (i == parseInt(weekday)) {
          weekday = days[i];
        }
      }
      return `${weekday}, ${this.event.month}
         ${this.event.day < 10 ? "0" + this.event.day : this.event.day}
          ${year}`;
    }
  }
};
</script>

<style scoped>
.fade-leave-active,
.fade-enter-active {
  transition: 0.3s opacity cubic-bezier(0.25, 0.8, 0.5, 1);
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.fade-leave-to,
.fade-enter {
  opacity: 0;
}
.close__container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.stripe {
  width: 50%;
  position: absolute;
  height: 3px;
  background-color: #fff;
}
.stripe:first-child {
  transform: rotate(45deg);
}
.stripe:last-child {
  transform: rotate(-45deg);
}
.event__info {
  position: absolute;
  cursor: auto;
  display: flex;
  flex-direction: column;
  z-index: 999;
  border-radius: 4px;
  left: 0;
  top: 0%;
  width: 40vw;
  max-width: 450px;
  min-width: 350px;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
}
.event__info_upper {
  display: flex;
  width: 100%;
  flex-direction: row;
  height: 120px;
  justify-content: flex-start;
  align-items: center;
}
.title {
  height: 100%;
  width: 70%;
  font-size: 1.2rem;
  word-wrap: break-word !important;
  white-space: normal !important;
  padding: 25px;
}
.controls {
  display: flex;
  flex-direction: row;
  width: 30%;
  height: 100%;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 15px;
  -webkit-font-smoothing: antialiased;
}
.control {
  cursor: pointer;
  margin: 0px 5px 0px 5px;
  width: 45px;
  min-width: 45px;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.95);
  height: 45px;
  text-rendering: optimizeLegibility;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  position: relative;
}
.control:hover {
  background-color: rgba(211, 211, 211, 0.3);
}
.control:first-child {
  font-size: 1.2rem;
}
.controls__wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
}

.event__info_lover {
  width: 100%;
  min-height: 120px;
  background-color: #fff;
  color: black;
  font-size: 0.85rem;
  font-weight: 300;
  position: relative;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  text-align: left;
}
.info__container {
  width: 100%;
  color: rgba(0, 0, 0, 0.8);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 25px;
}
.date__wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px 20px 10px 20px;
  justify-content: flex-start;
  -webkit-font-smoothing: antialiased;
  align-items: center;
  position: relative;
  text-rendering: optimizeLegibility;
  margin-bottom: 6px;
}
.date__wrapper > p {
  margin-left: 40px;
  text-rendering: optimizeLegibility;
}
.date__wrapper > svg {
  color: gray;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 20px;
  font-size: 1.2rem;
  text-rendering: optimizeLegibility;
}
.pencil {
  position: absolute;
  top: 0;
  left: 0;
  text-rendering: optimizeLegibility;
  transform: translate(25%, -65%);
  border-radius: 50%;
  cursor: pointer;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  transition: 0.3s;
  padding: 11px;
  font-size: 1rem;
  -webkit-font-smoothing: antialiased;
  color: white;
  background-color: rgb(55, 55, 55);
}
.pencil:hover {
  background-color: grey;
}
@media only screen and (max-width: 600px) {
  .event__info {
    position: fixed;
    top: 0 !important;
    left: 0 !important;
    height: 100vh !important;
    width: 100vw !important;
    transform: translate(0, 0) !important;
    z-index: 999;
  }
  .event__info_upper {
    height: 20% !important;
  }
  .event__info_lover {
    height: 80% !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
  }
  .info__container {
    align-items: flex-start !important;
    justify-content: flex-start !important;
    margin: 25px 10px 25px 10px;
  }
}
</style>