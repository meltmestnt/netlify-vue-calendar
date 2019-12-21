<template>
  <transition
    name="fade-less"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      class="event__wrapper"
      v-if="editEvent"
      @click.self="preventClosing()"
    >
      <div
        class="edit__container"
        @click="toCloseAllDialogs($event)"
        :id="personalId"
        :class="{scaled: scaled, animatePrevention: animatePrevention,
         overflow__disable: overflowDisable}"
      >
        <div class="upper_part">
          <div
            class="control"
            @mouseover="showPopup($event, cancelEditing)"
            @mouseleave="clearPopups()"
          >
            <div
              class="close__container"
              @click="$emit('closeeditinfo', $event); similarEvents = []"
            >
              <div class="stripe"></div>
              <circleBgc :round="true" />
              <div class="stripe"></div>

            </div>
            <div class="control__buttons">
              <extraOptions
                @closeExtraOptions="showExtraOptions = false"
                :showExtraOptions="showExtraOptions"
                :event="event"
              />
              <div
                class="save"
                @click="inputInfo.title && saveChanges($event); inputInfo.title && $emit('closeeditinfo', $event)"
                :class="{disabled__save: !inputInfo.title}"
              >
                <p>Save</p>
                <circleBgc :color="'rgba(255,255,255,0.7)'" />
              </div>
              <div
                class="more__actions"
                @click.stop="showExtraOptions = true"
                v-show="!creating"
              >
                <p>More actions...</p>
                <circleBgc />
              </div>
            </div>
            <popup :info="cancelEditing" />
          </div>
          <div class="right__controls">
            <div class="input__buttons">
              <div class="input__container">
                <input
                  v-model="inputInfo.title"
                  type="text"
                  class="input input_title"
                >
              </div>
              <div class="control__buttons">
                <extraOptions
                  @closeExtraOptions="showExtraOptions = false"
                  :showExtraOptions="showExtraOptions"
                  :event="event"
                />
                <div
                  class="save"
                  :class="{disabled__save: !inputInfo.title}"
                  @click="inputInfo.title && saveChanges($event); inputInfo.title && $emit('closeeditinfo', $event)"
                >
                  <p>Save</p>
                  <circleBgc :color="'rgba(255,255,255,0.7)'" />
                </div>
                <div
                  class="more__actions"
                  @click.stop="showExtraOptions = true"
                  v-if="!creating"
                >
                  <p>More actions...</p>
                  <circleBgc />
                </div>
              </div>
            </div>
            <div class="date__buttons">
              <div
                class="date__container"
                v-if="getCurrentOptionRepeatText != 'Does not repeat'"
              >
                <div
                  class="more__actions"
                  @click="openWindow($event,'showBeginningCalendar')"
                >
                  <p>{{getBeginningTime}}</p>
                  <circleBgc />
                  <transition name="fade">
                    <div
                      class="calendar__container"
                      v-show="showBeginningCalendar"
                    >
                      <calendar
                        :notMenu="true"
                        @closeWindow="closeWindow"
                      />
                    </div>
                  </transition>
                </div>
                <p>to</p>
                <div
                  class="more__actions"
                  @click="openWindow($event,'showEndCalendar')"
                >
                  <p>{{getEndTime}}</p>
                  <circleBgc />
                  <transition name="fade">
                    <div
                      class="calendar__container calendar__container_right"
                      v-show="showEndCalendar"
                    >
                      <calendar
                        :notMenu="true"
                        @closeWindow="closeWindow"
                      />

                    </div>
                  </transition>
                </div>
              </div>
              <div class="repeat__options">
                <p @click="openRepeatOptions = true">{{getCurrentOptionRepeatText}}
                  <font-awesome-icon icon="caret-down" />
                </p>
                <transition name="fade">
                  <div
                    class="options__container"
                    v-show="openRepeatOptions"
                  >
                    <div
                      class="option"
                      v-for="option in options"
                      :key="option.text"
                      @click="newRepeatOption(option)"
                      :class="{active__option: option.active}"
                    >
                      {{option.text}}
                    </div>
                  </div>
                </transition>
              </div>
              <div class="date__container">
                <div class="when_to_repeat">
                  <div class="is_all_day">
                    <label>
                      <div class="all_day_div"><span
                          :class="{checked_all_day: inputInfo.allDay}"
                          class="all_day_span"
                        >
                          <font-awesome-icon
                            v-show="inputInfo.allDay"
                            icon="check"
                          />
                          <input
                            v-model="inputInfo.allDay"
                            type="checkbox"
                          >
                        </span>
                        <circleBgc
                          :round="true"
                          :color="'rgba(30,145,214,0.3)'"
                        />
                      </div> All day
                    </label>
                  </div>
                  <div class="repeatable">
                    <div class="repeat__container">
                      <input
                        type="text"
                        class="input"
                      >
                    </div>
                    <div class="repeat__options">
                      <p @click="openHowOftenOptions = true">{{getCurrentOptionHowOften}}
                        <font-awesome-icon icon="caret-down" />
                      </p>
                      <transition name="fade">
                        <div
                          class="options__container"
                          v-show="openHowOftenOptions"
                        >
                          <div
                            class="option"
                            v-for="option in howOftenOptions"
                            :key="option.text"
                            @click="newHowOftenOption(option)"
                            :class="{active__option: option.active}"
                          >
                            {{option.text}}
                          </div>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="tab_switch">
          <div
            class="tab__text"
            :class="{tab__text_active: eventDetails}"
            @click="chooseTab($event, 'event details')"
          >
            <p>Event details</p>
            <circleBgc />
          </div>
          <div
            class="tab__text"
            :class="{tab__text_active: !eventDetails}"
            @click="chooseTab($event, 'forecast')"
            v-if="!creating"
          >
            <p>Forecast</p>
            <circleBgc />
          </div>
        </div>
        <div class="slider__container">
          <div
            class="details__container"
            :class="{hidden_tab_reverse: !eventDetails}"
          >
            <eventDetails
              :event="$props.event"
              :personalId="personalId"
              ref="eventDet"
            />
          </div>

          <div
            :class="{hidden_tab: eventDetails}"
            class="forecast__container"
            v-if="!creating"
          >
            <p>The forecast shows previous & next 5 occurences within a year time</p>
            <div class="forecasts">
              <div
                class="forecast"
                v-for="similarEvent in lookForSimilarEvents($store.getters.returnMonthesWithDays)"
                :key="similarEvent.id"
                :class="{forecast_active: similarEvent.blue}"
              >
                <p>{{`${similarEvent.day == 1 ? similarEvent.day + 'st' :
                  similarEvent.day == 2 ? similarEvent.day + 'nd' : similarEvent.day == 3 ?
                  similarEvent.day + 'rd' : similarEvent.day + 'th'} ${similarEvent.month} ${$store.getters.returnDate.year}`}}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

  </transition>
</template>

<script>
import popup from "./extras/popup.vue";
import eventDetails from "./extras/event_details.vue";
import circleBgc from "./extras/circle_bgc.vue";
import calendar from "./extras/calendar.vue";
import extraOptions from "./extras/extra_options.vue";
export default {
  name: "InfoEdit",
  components: {
    popup,
    extraOptions,
    circleBgc,
    calendar,
    eventDetails
  },
  props: {
    creating: {
      type: Boolean
    },
    event: {
      type: Object
    },
    day: {
      type: Object,
      required: true
    },
    editEvent: {
      type: Boolean
    }
  },
  data() {
    return {
      showExtraOptions: false,
      cancelEditing: {
        text: "Cancel event changes",
        show: false,
        leftAligned: true
      },
      activeTime: "",
      personalId: "abc" + Math.floor(Math.random() * 10000),
      animatePrevention: false,
      inputInfo: {
        title: "",
        allDay: true,
        howOften: "Day",
        beginningTime: "Beginning time",
        endTime: "End time",
        currentOptionRepeatText: "Does not repeat"
      },
      openHowOftenOptions: false,
      openRepeatOptions: false,
      showBeginningCalendar: false,
      showEndCalendar: false,
      scaled: false,
      eventDetails: true,
      eventDetailsExpanded: false,
      overflowDisable: false,
      howOftenOptions: [
        {
          text: "Day",
          active: true
        },
        {
          text: "Week",
          active: false
        },
        {
          text: "Month",
          active: false
        }
      ],
      options: [
        {
          text: "Does not repeat",
          active: true
        },
        {
          text: "Daily",
          active: false
        },
        {
          text: "Weekly on Monday",
          active: false
        },
        {
          text: "Montly on the 1st Monday",
          active: false
        },
        {
          text: "Annualy on January 7th",
          active: false
        },
        {
          text: "Annualy on the 1st Monday of January",
          active: false
        },
        {
          text: "Every weekday (Monday to Friday)",
          active: false
        },
        {
          text: "Monthly on the 7th day",
          active: false
        },
        {
          text: "Custom",
          active: false
        }
      ]
    };
  },
  computed: {
    getCurrentOptionHowOften() {
      return this.inputInfo.howOften;
    },
    getCurrentOptionRepeatText() {
      return this.inputInfo.currentOptionRepeatText;
    },
    getBeginningTime() {
      return this.inputInfo.beginningTime;
    },
    getEndTime() {
      return this.inputInfo.endTime;
    }
  },
  watch: {
    getCurrentOptionRepeatText() {
      let container = document.querySelector(`#${this.personalId}`);
      container.style.overflow = "hidden";
      setTimeout(() => {
        container.style.overflow = "visible";
      }, 250);
      this.computeHeight("first");
    }
  },
  methods: {
    saveChanges(ev) {
      if (this.creating) {
        this.$refs.eventDet.createEvent({
          title: this.inputInfo.title,
          day: this.event.day
        });
      } else {
        this.$refs.eventDet.saveChanges({
          title: this.inputInfo.title
        });
      }
    },
    lookForSimilarEvents(monthesWithDays) {
      let eventCopy = {},
        similarEvents = [];
      monthesWithDays.forEach(month => {
        month.days.forEach(day => {
          if (day.events.length > 0) {
            day.events.forEach((event, index) => {
              if (event.title == this.$props.event.title) {
                eventCopy = Object.assign({}, event);
                eventCopy.id = `${event.day + event.month}${index}`;
                if (event == this.$props.event) {
                  eventCopy.blue = true;
                }
                similarEvents.push(eventCopy);
              }
            });
          }
        });
      });
      return similarEvents;
    },
    toCloseAllDialogs(ev) {
      if (
        !ev.target.classList.contains("date__container") &&
        !ev.target.classList.contains("date__buttons") &&
        !ev.target.classList.contains("upper__part") &&
        !ev.target.classList.contains("tab_switch") &&
        !ev.target.classList.contains("lover__part") &&
        !ev.target != ev.currentTarget &&
        !ev.target.classList.contains("save") &&
        !ev.target.parentNode.classList.contains("control")
      ) {
        return;
      }
      this.closeAllDialogs();
    },
    closeAllDialogs(ev) {
      this.openHowOftenOptions = false;
      this.openRepeatOptions = false;
      this.showExtraOptions = false;
      this.showEndCalendar = false;
      this.showBeginningCalendar = false;
      eventBus.$emit("closeAllDialogs");
    },
    computeHeight(type) {
      setTimeout(() => {
        let elem = document.querySelector(`#${this.personalId}`),
          overallheight = elem.offsetHeight,
          upper = elem.querySelector(".upper_part").offsetHeight,
          tab = elem.querySelector(".tab_switch").offsetHeight;
        if (type == "forecast") {
          let lover = elem.querySelector(".forecast__container").offsetHeight;
          elem.style.height = `${upper + tab + lover}px`;
          this.eventDetails = false;
        } else {
          let lover = elem.querySelector(".lover__part").offsetHeight;
          elem.style.height = `${upper + tab + lover}px`;
          this.eventDetails = true;
        }
      }, 1);
    },
    chooseTab(ev, type) {
      if (
        !ev.target.classList.contains(".tab__text") &&
        !ev.currentTarget.contains(ev.target)
      ) {
        return;
      }
      let elem = document.querySelector(`#${this.personalId}`);
      elem.style.overflow = "hidden";
      setTimeout(() => (elem.style.overflow = "visible"), 900);
      this.computeHeight(type);
    },
    afterEnter(el) {
      this.inputInfo.title = this.event.title;
      el.classList.add("opacity_bgc");
      this.scaled = true;
      this.computeHeight("first");
      let textarea = document.querySelector(
          `#${this.personalId} .extra_text_area`
        ),
        textareaheight = textarea.offsetHeight,
        elem = document.querySelector(`#${this.personalId}`),
        listener = null,
        title = elem.querySelector(".input_title");
      textarea.addEventListener("mousedown", ev => {
        elem.style.height = "auto";
        elem.style.maxHeight = "100vh";
      });
      textarea.addEventListener("mouseup", () => {
        this.computeHeight("first");
      });
      textarea.addEventListener("mouseleave", () => {
        this.computeHeight("first");
      });
      title.focus();
      this.$emit("closeNewEventDialog");
    },
    newHowOftenOption(opt) {
      this.howOftenOptions.forEach(option => {
        option.active = false;
      });
      opt.active = true;
      this.openHowOftenOptions = false;
      this.inputInfo.howOften = opt.text;
      this.$store.commit("howOftenRepeatExpand", {
        day: this.day,
        event: this.event,
        info: opt.text
      });
    },
    newRepeatOption(opt) {
      this.options.forEach(option => {
        option.active = false;
      });
      opt.active = true;
      this.openRepeatOptions = false;
      this.inputInfo.currentOptionRepeatText = opt.text;
    },
    afterLeave(el) {
      el.classList.remove("opacity_bgc");
      this.scaled = false;
    },
    showPopup(ev, show) {
      if (
        ev.target == ev.currentTarget ||
        ev.target.classList.contains("circle__container")
      ) {
        show.show = true;
      }
    },
    openWindow(ev, target) {
      if (ev.target.parentNode != ev.currentTarget) {
        return;
      } else {
        if (this.showBeginningCalendar || this.showEndCalendar) {
          this.closeWindow(ev, target);
        }
        if (target == "showBeginningCalendar") {
          this.activeTime = "beginningTime";
        } else {
          this.activeTime = "endTime";
        }
        this[target] = true;
      }
    },
    preventClosing() {
      this.animatePrevention = true;
      setTimeout(() => (this.animatePrevention = false), 300);
    },
    closeWindow(ev, info) {
      if (ev.target.classList.contains("more__actions")) {
        return;
      } else {
        this.showBeginningCalendar = false;
        this.showEndCalendar = false;
      }
      this.inputInfo[this.activeTime] = info.dayinweek
        ? `${info.month} ${
            info.dayinweek == 1
              ? info.dayinweek + "st"
              : info.dayinweek == 2
              ? info.dayinweek + "nd"
              : info.dayinweek == 3
              ? info.dayinweek + "rd"
              : info.dayinweek + "th"
          } ${info.year}`
        : "Choose date";
    },
    clearPopups() {
      this.cancelEditing.show = false;
    }
  }
};
</script>

<style scoped>
.disabled__save {
  background-color: rgba(0, 0, 0, 0.1) !important;
  color: black !important;
  cursor: auto !important;
}
.control .control__buttons {
  display: none;
}
.details__container {
  visibility: visible;
  width: 100%;
  transition: 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.overflow__disable {
  overflow: hidden !important;
}
.hidden_tab {
  position: absolute;
  visibility: hidden !important;
  transform: translateX(100%);
}
.hidden_tab_reverse {
  position: absolute;
  visibility: hidden !important;
  transform: translateX(-100%);
}
.forecast__container {
  width: 100%;
  color: black;
  transition: 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
  font-size: 0.9rem;
  font-weight: 300;
  white-space: normal;
  visibility: visible;
  padding: 20px;
  padding-bottom: 10px;
}
.forecasts {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.forecast {
  padding: 10px 15px 10px 15px;
  border-radius: 2px;
  margin: 10px;
  margin-bottom: 0;
  margin-left: 0;
  cursor: pointer;
  min-width: 200px;
  font-weight: 500;
  color: black;
  font-size: 0.85rem;
  background: #e0e0e0;
}
.forecast_active {
  color: white;
  background: #1976d2;
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
.fade-less-leave-active,
.fade-less-enter-active {
  transition: 0.1s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}
.fade-less-enter-to,
.fade-less-leave {
  opacity: 1;
}
.fade-less-leave-to,
.fade-less-enter {
  opacity: 0;
}
.slider__container {
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: visible;
}
.slider__container__expanded {
  max-height: 800px;
}
.upper_part {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px;
}
.tab_switch {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.tab_switch .tab__text {
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  text-transform: uppercase;
  cursor: pointer;
  color: rgba(66, 66, 66, 0.6);
  font-weight: 600;
  margin-right: 10px;
  padding: 15px;
}
.tab__text_active {
  color: rgba(66, 66, 66, 0.9) !important;
}
.tab__text_active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1e91d6;
}
.is_all_day {
  height: 100%;
  font-size: 1.05rem;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.54);
}
.is_all_day label {
  display: flex;
  align-items: center;
}
.is_all_day input {
  opacity: 0;
  outline: none;
  border: none;
}
.checked_all_day {
  color: white;
  background-color: rgba(30, 145, 214, 0.7) !important;
  border: none !important;
}
.all_day_div {
  width: 50px;
  height: 50px;
  margin-right: 5px;
  position: relative;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.all_day_span {
  width: 20px;
  position: relative;
  height: 20px;
  font-size: 0.8rem;
  border: 2px solid black;
  background-color: #fff;
}
.all_day_span svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.when_to_repeat {
  width: 60%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  max-height: 60px;
  flex-direction: row;
}
.repeat__container {
  width: 150px;
  display: inline-block;
  height: 50px;
}
.repeatable {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.repeatable .repeat__options {
  width: 150px !important;
  display: inline-block;
  height: 50px;
  margin: 0px 0px 0px 10px;
}
.repeat__container input {
  width: 100%;
  height: 100%;
}
.calendar__container {
  width: 300px;
  z-index: 9999;
  height: 300px;
  border-radius: 2px;
  position: absolute;
  white-space: nowrap;
  top: 0;
  left: 0;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  background-color: #fff;
}
.repeat__options {
  width: 60%;
  height: 50px;
  position: relative;
  margin-top: 20px;
  font-size: 0.9rem;
  font-weight: 300;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: rgba(66, 66, 66, 0.9);
  background-color: rgba(211, 211, 211, 0.25);
}
.repeat__options p {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
p > svg {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}
.options__container {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-width: 428px;
  max-height: 300px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  background-color: #fff;
}
.active__option {
  color: #1976d2 !important;
}
.option {
  padding: 15px;
  width: 100%;
  transition: 0.3s;
  cursor: pointer;
}
.option:hover {
  background-color: rgba(66, 66, 66, 0.1);
}
.date__buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.right__controls {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
}
.input__container {
  width: 100%;
  height: 50px;
}
.date__container p {
  margin-right: 10px;
  font-weight: 300;
}
.date__container {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  color: black;
  align-items: center;
}
.input__buttons {
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
}
.input {
  width: 100%;
  height: 100%;
  border: none;
  padding: 10px;
  outline: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(66, 66, 66, 0.9);
  background-color: rgba(211, 211, 211, 0.25);
}
.control__buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  position: relative;
}
.save {
  width: 90px;
  height: 50px;
  display: flex;
  justify-content: center;
  position: relative;
  text-align: center;
  align-items: center;
  margin: 0px 10px 0px 10px;
  color: white;
  font-weight: 500;
  padding: 15px;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  background-color: rgb(25, 118, 210);
  transition: 0.3s;
}
.save:hover {
  background-color: rgba(25, 118, 210, 0.86);
}
.more__actions {
  height: 50px;
  display: flex;
  transition: 0.3s;
  font-size: 0.9rem;
  margin-right: 10px;
  text-transform: uppercase;
  position: relative;
  border-radius: 2px;
  font-weight: 500;
  color: black;
  background-color: rgba(211, 211, 211, 0.25);
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
  min-width: 90px;
}
.more__actions p {
  margin: 0;
  padding: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-weight: 500;
}
.more__actions:hover {
  background-color: rgba(211, 211, 211, 0.75);
}
.close__container {
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 50%;
  transition: 0.3s;
}
.stripe {
  width: 45%;
  position: absolute;
  height: 2px;
  background-color: black;
}
.stripe:first-child {
  transform: rotate(45deg);
}
.stripe:last-child {
  transform: rotate(-45deg);
}
.control {
  cursor: pointer;
  margin: 5px 10px 0px 10px;
  width: 40px;
  min-width: 40px;
  font-size: 1.5rem;
  background: rgba(211, 211, 211, 0.3);
  height: 40px;
  text-rendering: optimizeLegibility;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  position: relative;
  transition: 0.3s;
}
.close__container:hover {
  background: rgb(211, 211, 211, 0.75);
}
.event__wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  z-index: 99999;
  transition: 0.4s;
  transform: translate(0, 0) !important;
}
.edit__container {
  width: 80%;
  white-space: nowrap;
  min-width: 600px;
  max-width: 800px;
  position: relative;
  border-radius: 2px;
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2),
    0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
  background-color: white;
  transform: scale(0.7, 0.7);
  opacity: 0;
  overflow: visible;
  z-index: 99999;
  transition: 0.35s;
}

@media only screen and (max-width: 600px) {
  .right__controls .control__buttons {
    display: none;
  }
  .all_day_div {
    margin: 0;
  }
  .calendar__container_right {
    left: 100%;
    transform: translateX(-100%);
  }
  .calendar__container .calendar__container {
    left: 0;
  }
  .repeat__options {
    width: 100%;
    margin-left: 0 !important;
  }
  .when_to_repeat {
    width: 100%;
  }
  .when_to_repeat .is_all_day {
    width: 25%;
    margin-right: 4%;
  }
  .when_to_repeat .repeatable {
    width: 71%;
  }
  .repeatable .repeat__options {
    margin-left: 4%;
  }
  .repeatable .repeat__container {
    margin-right: 4%;
  }
  .date__container {
    justify-content: space-between;
  }
  .right__controls .input {
    width: 100%;
  }
  .input__container {
    display: flex;
    justify-content: center;
  }
  .control {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #fff;
    margin: 0px 0px 20px 0px;
  }
  .control .close__container {
    background-color: #fff;
    background: rgba(211, 211, 211, 0.3);
    border-radius: 50%;
  }
  .control .control__buttons {
    display: flex;
    justify-content: space-between;
  }
  .more__actions {
    margin-right: 0;
  }
  .right__controls {
    justify-content: center;
  }
  .upper_part {
    padding: 15px;
    flex-direction: column;
  }
  .edit__container {
    overflow: auto !important;
    overflow-x: hidden;
    width: 100%;
    height: 100% !important;
    min-width: 0;
  }
}
</style>