<template>
  <transition name="fade">
    <div
      class="create__event__container"
      :class="{left_transform: leftTransform, top_transform: topTransform,
      both_transform: leftTransform && topTransform}"
      :style="{top: computeTop,
     left: computeLeft, width: w, height: h}"
      @click="closeAllDialogs($event)"
      @keyup.esc="closeAllDialogs($event); $emit('closenewEventDialog', $event)"
    >
      <div class="upper__part">
        <div class="controls__container">
          <div
            :class="{disabled: titleCheck}"
            class="save__container"
            @click.stop="createEvent($event)"
          >
            <font-awesome-icon icon="save" />
            <p>Save</p>
            <circleBgc :color="'rgba(255,255,255,0.7)'" />
          </div>
          <div
            class="control"
            @click="$emit('closeNewEventDialog', $event)"
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
        <div class="input__container">
          <input
            type="text"
            placeholder="Add title"
            name="title-input"
            autofocus
            class="input"
            v-model="event.title"
            @keypress.enter="event.title && createEvent()"
          >
        </div>
      </div>
      <div class="lover__part">

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
        <div class="date__container">
          <font-awesome-icon :icon="['far', 'clock']" />
          <p>{{computeDate}}</p>
        </div>
        <eventDetails
          :event="event"
          :removeMargin='true'
        />
      </div>
    </div>
  </transition>
</template>

<script>
import eventDetails from "./extras/event_details.vue";
import circleBgc from "./extras/circle_bgc.vue";
import InfoEdit from "./InfoEdit.vue";
export default {
  name: "createEvent",
  components: {
    eventDetails,
    circleBgc,
    InfoEdit
  },
  data() {
    return {
      editEvent: false,
      leftTransform: false,
      topTransform: false,
      preventMultipleEvents: false,
      w: "360px",
      h: "518px"
    };
  },
  methods: {
    closeEditInfo() {
      this.editEvent = false;
    },
    openEditInfo() {
      this.determineMonth();
      this.editEvent = true;
    },
    determineMonth() {
      if (this.prevMonthCreate) {
        this.$emit("changeEv", {
          monthNumber: this.event.monthNumber - 1,
          month: this.monthName(this.event.monthNumber - 1)
        });
      } else if (this.nextMonthCreate) {
        this.$emit("changeEv", {
          monthNumber: this.event.monthNumber + 1,
          month: this.monthName(this.event.monthNumber + 1)
        });
      }
    },
    createEvent(ev) {
      if (!this.event.title) return;
      else if (this.preventMultipleEvents) return;
      this.preventMultipleEvents = true;
      this.$emit("closeNewEventDialog", ev);
      this.determineMonth();
      eventBus.$emit("createEvent", {
        title: this.event.title,
        day: this.event.day
      });
    },
    closeAllDialogs(ev) {
      if (ev.target.parentNode.classList.contains("repeat__options")) {
        return;
      }
      eventBus.$emit("closeAllDialogs");
    },
    monthName(monthNumber) {
      let monthes = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      let monthName = "January";
      monthes.forEach((month, i) => {
        if (i == monthNumber) {
          monthName = month;
        }
      });
      return monthName;
    },
    getMonthNumber(month) {
      let monthes = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      for (let i = 0; i < monthes.length; i++) {
        if (monthes[i] == month) {
          return i;
        }
      }
    }
  },
  computed: {
    title() {
      return this.event.title;
    },
    titleCheck() {
      if (this.event.title) {
        return false;
      } else {
        return true;
      }
    },
    computeTop() {
      if (
        this.clientRect.top + parseInt(this.h) <=
        Math.max(document.documentElement.clientHeight || window.innerHeight)
      ) {
        this.topTransform = false;
      } else {
        this.topTransform = true;
      }
      return `${this.clientRect.top}px`;
    },
    computeLeft() {
      if (
        this.clientRect.left + parseInt(this.w) <=
        Math.max(document.documentElement.clientWidth || window.innerWidth)
      ) {
        this.leftTransform = false;
      } else {
        this.leftTransform = true;
      }
      return `${this.clientRect.left - this.clientRect.leftOffsetMenu}px`;
    },
    getDate() {
      return this.$store.getters.returnDate;
    },
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
      for (let i = 0; i < days.length; i++) {
        if (i == parseInt(weekday)) {
          weekday = days[i];
        }
      }
      return `${weekday}, ${this.event.month}
         ${this.event.day < 10 ? "0" + this.event.day : this.event.day}
          ${year}`;
    }
  },
  watch: {
    title() {
      this.$emit("changeTitle", this.event.title);
    },
    clientRect() {
      this.determineMonth();
      this.preventMultipleEvents = false;
      document.querySelector('input[name="title-input"]').focus();
    }
  },
  props: {
    event: {
      type: Object
    },
    nextMonthCreate: {
      type: Boolean
    },
    prevMonthCreate: {
      type: Boolean
    },
    clientRect: {
      type: Object,
      required: true
    },
    day: {
      type: Object
    }
  }
};
</script>

<style scoped>
.disabled {
  color: rgba(0, 0, 0, 0.3);
  cursor: auto !important;
}
.disabled div {
  display: none !important;
}
.disabled:hover {
  background-color: rgba(0, 0, 0, 0) !important;
}
.left_transform {
  transform: translate(-140%, 1%);
}
.top_transform {
  transform: translateY(-110%);
}
.both_transform {
  transform: translate(-150%, -110%);
}
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
.date__container {
  padding: 15px;
  display: flex;
  align-items: center;
  flex-direction: row;
  color: gray;
}
.date__container svg {
  font-size: 1.3rem;
  margin-right: 10px;
}
.lover__part {
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  padding: 15px;
  position: relative;
}
.pencil {
  position: absolute;
  top: 0;
  left: 10px;
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
.control {
  cursor: pointer;
  margin: 0px 5px 0px 5px;
  width: 35px;
  min-width: 35px;
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.95);
  height: 35px;
  text-rendering: optimizeLegibility;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  position: relative;
}
.control:hover,
.save__container:hover {
  background-color: rgba(211, 211, 211, 0.3);
}
.control:first-child {
  font-size: 1.2rem;
}
.input__container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.input__container .input {
  width: 80%;
  padding: 13px;
  color: gray;
  border: 0;
  font-size: 1.2rem;
  border-radius: 2px;
  outline: none;
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
.save__container {
  padding: 10px;
  display: flex;
  position: relative;
  flex-direction: row;
  margin-right: 20px;
  cursor: pointer;
  text-transform: uppercase;
  align-items: center;
}
.save__container p {
  font-size: 0.8rem;
}
.save__container svg {
  margin-right: 10px;
  font-size: 1.2rem;
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
.controls__container {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
}
.upper__part {
  width: 100%;
  display: flex;
  height: 128px;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  padding: 15px;
  background-color: rgb(25, 118, 210);
  color: white;
  font-weight: 600;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.create__event__container {
  position: absolute;
  z-index: 9999;
  background-color: #fff;
  box-shadow: 0 20px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
}
@media only screen and (max-width: 600px) {
  .create__event__container {
    position: fixed;
    top: 0 !important;
    left: 0 !important;
    height: 100vh !important;
    width: 100vw !important;
    transform: translate(0, 0) !important;
    z-index: 9999;
  }
  .upper__part {
    height: 20% !important;
  }
  .lover__part {
    height: 80% !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
  }
}
</style>