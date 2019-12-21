<template>
  <div
    class="lover__part"
    :class="{remove__margin: removeMargin}"
  >
    <div class="lover__input__container">
      <font-awesome-icon
        :class="{active: inputInfo.country && inputInfo.country != 'Country'}"
        icon="map-marker-alt"
      />
      <div class="input__container">
        <input
          v-model="inputInfo.country"
          placeholder="Add country"
          type="text"
          class="input"
        >
      </div>
    </div>
    <div
      class="lover__input__container"
      v-if="!removeMargin"
    >
      <font-awesome-icon
        :class="{active: inputInfo.description}"
        icon="align-left"
      />

      <textarea
        placeholder="Add description"
        v-model="inputInfo.description"
        class="extra_text_area"
        cols="20"
        rows="10"
      ></textarea>

    </div>
    <div
      class="lover__input__container"
      v-else
    >
      <font-awesome-icon
        :class="{active: inputInfo.description}"
        icon="align-left"
      />

      <input
        v-model="inputInfo.description"
        placeholder="Add description"
        type="text"
        class="input"
      >

    </div>
    <div class="lover__input__container">
      <font-awesome-icon
        :class="{active: inputInfo.type && inputInfo.type != 'Regular event'}"
        :icon="['far', 'calendar-alt']"
      />
      <div class="input__container">
        <input
          v-model="inputInfo.type"
          type="text"
          class="input"
        >
      </div>
    </div>
    <div class="lover__input__container">
      <font-awesome-icon
        :class="{active: openColorOptions}"
        icon="adjust"
      />
      <div class="repeat__options">
        <p @click="openColorOptions = true">{{getCurrentColorOptions}}
          <font-awesome-icon icon="caret-down" />
        </p>
        <transition name="fade">
          <div
            class="options__container color__options_extra"
            v-show="openColorOptions"
          >
            <div
              class="option"
              v-for="option in colorOptions"
              :key="option.name"
              @click="newColorOption(option)"
              :style="{'background-color': option.color}"
            >
              {{option.name}}
              <circleBgc :color="'rgba(255,255,255,0.8)'" />
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="lover__input__container">
      <font-awesome-icon
        :class="{active: openTypeOptions}"
        :icon="['far','question-circle']"
      />
      <div class="repeat__options">
        <p @click="openTypeOptions = true">{{getCurrentTypeOptions}}
          <font-awesome-icon icon="caret-down" />
        </p>
        <transition name="fade">
          <div
            class="options__container type__options_extra"
            v-show="openTypeOptions"
          >
            <div
              class="option"
              v-for="option in typeOptions"
              :key="option.text"
              @click="newTypeOption(option)"
              :class="{active__option: option.active}"
            >
              <font-awesome-icon
                v-if="option.icon"
                :icon="option.icon"
              />
              {{option.text}}
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="lover__input__container">
      <font-awesome-icon
        :class="{active: openBusyOptions}"
        icon="suitcase"
      />
      <div class="repeat__options">
        <p @click="openBusyOptions = true">{{getCurrentIsBusy}}
          <font-awesome-icon icon="caret-down" />
        </p>
        <transition name="fade">
          <div
            class="options__container"
            v-show="openBusyOptions"
          >
            <div
              class="option"
              v-for="option in busyOptions"
              :key="option.text"
              @click="newBusyOption(option)"
              :class="{active__option: option.active}"
            >
              {{option.text}}
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import circleBgc from "./circle_bgc.vue";
export default {
  name: "eventDetails",
  components: {
    circleBgc
  },
  props: {
    personalId: {
      type: String
    },
    event: {
      type: Object,
      required: true
    },
    removeMargin: {
      type: Boolean
    }
  },
  data() {
    return {
      inputInfo: {
        country: this.$props.event ? this.$props.event.country : "",
        description: this.$props.event ? this.$props.event.description : "",
        type: this.$props.event ? this.$props.event.type : "Regular event",
        color: {
          name: this.$props.event ? this.$props.event.color.name : "Navy",
          color: this.$props.event
            ? this.$props.event.color.color
            : "rgb(63, 81, 181)"
        },
        extraType: {
          text: this.$props.event ? this.$props.event.extraType.text : "",
          icon: this.$props.event ? this.$props.event.extraType.icon : ""
        },
        isBusy: this.$props.event ? this.$props.event.isBusy : ""
      },
      newEvent: {},
      openBusyOptions: false,
      openTypeOptions: false,
      openColorOptions: false,
      busyOptions: [
        {
          text: "Busy",
          active: true
        },
        {
          text: "Free",
          active: false
        }
      ],
      typeOptions: [
        {
          text: "None",
          active: true,
          icon: ""
        },
        {
          text: "Alarm",
          active: false,
          icon: "stopwatch"
        },
        {
          text: "Star",
          active: false,
          icon: "star"
        },
        {
          text: "Love",
          active: false,
          icon: "heart"
        },
        {
          text: "Action",
          active: false,
          icon: "bolt"
        },
        {
          text: "Assignment",
          active: false,
          icon: "list-alt"
        },
        {
          text: "Warning",
          active: false,
          icon: "exclamation-triangle"
        },
        {
          text: "Money",
          active: false,
          icon: "dollar-sign"
        },
        {
          text: "Charge",
          active: false,
          icon: "credit-card"
        }
      ],
      colorOptions: [
        {
          color: "rgb(244, 67, 54)",
          name: "Red",
          active: false
        },
        {
          color: "rgb(233, 30, 99)",
          name: "Pink",
          active: false
        },
        {
          color: "rgb(156, 39, 176)",
          name: "Purple",
          active: false
        },
        {
          color: "rgb(63, 81, 181)",
          name: "Indigo",
          active: false
        },
        {
          color: "rgb(33, 150, 243)",
          name: "Blue",
          active: false
        },
        {
          color: "rgb(25, 118, 210)",
          name: "Glue",
          active: false
        },
        {
          color: "rgb(0, 188, 212)",
          name: "Cyan",
          active: false
        },
        {
          color: "rgb(0, 150, 136)",
          name: "Teal",
          active: false
        },
        {
          color: "rgb(76, 175, 80)",
          name: "Green",
          active: false
        },
        {
          color: "rgb(205, 220, 57)",
          name: "Lime",
          active: false
        },
        {
          color: "rgb(255, 235, 59)",
          name: "Yellow",
          active: false
        },
        {
          color: "rgb(255, 193, 7)",
          name: "Amber",
          active: false
        },
        {
          color: "rgb(255, 152, 0)",
          name: "Orange",
          active: false
        },
        {
          color: "rgb(255, 87, 34)",
          name: "Deep orange",
          active: false
        },
        {
          color: "rgb(121, 85, 72)",
          name: "Brown",
          active: false
        },
        {
          color: "rgb(0,0,0)",
          name: "Black",
          active: false
        }
      ]
    };
  },
  computed: {
    getCurrentColorOptions() {
      return this.inputInfo.color.name;
    },
    getCurrentIsBusy() {
      return this.inputInfo.isBusy ? "Busy" : "Free";
    },
    getCurrentTypeOptions() {
      return this.inputInfo.extraType.text
        ? this.inputInfo.extraType.text
        : "None";
    }
  },
  methods: {
    createEvent(obj) {
      if (obj.day != this.event.day) return;
      this.newEvent = { ...this.event };
      for (let property in this.inputInfo) {
        this.newEvent[property] =
          typeof this.inputInfo[property] == "object"
            ? { ...this.inputInfo[property] }
            : this.inputInfo[property];
        this.newEvent.title = obj.title;
      }

      this.$store.commit("createEvent", this.newEvent);
    },
    saveChanges(obj) {
      for (let info in this.inputInfo) {
        this.$store.commit("addEventExtraInfo", {
          property: info,
          event: this.$props.event,
          value:
            typeof this.inputInfo[info] == "object"
              ? { ...this.inputInfo[info] }
              : this.inputInfo[info]
        });
      }
      for (let info in obj) {
        this.$store.commit("addEventExtraInfo", {
          property: info,
          event: this.$props.event,
          value: typeof obj[info] == "object" ? { ...obj[info] } : obj[info]
        });
      }
    },
    newBusyOption(opt) {
      this.busyOptions.forEach(option => {
        option.active = false;
      });
      opt.active = true;
      this.openBusyOptions = false;
      this.inputInfo.isBusy = opt.text;
    },
    newColorOption(opt) {
      this.colorOptions.forEach(option => {
        option.active = false;
      });
      opt.active = true;
      this.openColorOptions = false;
      this.inputInfo.color.name = opt.name;
      this.inputInfo.color.color = opt.color;
    },
    newTypeOption(opt) {
      this.typeOptions.forEach(option => {
        option.active = false;
      });
      opt.active = true;
      this.openTypeOptions = false;
      this.inputInfo.extraType.icon = opt.icon;
      this.inputInfo.extraType.text = opt.text;
    }
  },
  beforeDestroy() {
    this.inputInfo = {
      country: this.$props.event ? this.$props.event.country : "",
      description: this.$props.event ? this.$props.event.description : "",
      type: this.$props.event ? this.$props.event.type : "Regular event",
      color: {
        name: this.$props.event ? this.$props.event.color.name : "Navy",
        color: this.$props.event
          ? this.$props.event.color.color
          : "rgb(63, 81, 181)"
      },
      extraType: {
        text: this.$props.event ? this.$props.event.extraType.text : "",
        icon: this.$props.event ? this.$props.event.extraType.icon : ""
      },
      isBusy: this.$props.event ? this.$props.event.isBusy : ""
    };
  },
  created() {
    eventBus.$on("closeAllDialogs", () => {
      this.openTypeOptions = false;
      this.openBusyOptions = false;
      this.openColorOptions = false;
    });
    eventBus.$on("createEvent", obj => {
      if (obj.day != this.event.day) return;
      if (this.personalId) return;
      this.newEvent = { ...this.event };
      for (let property in this.inputInfo) {
        this.newEvent[property] =
          typeof this.inputInfo[property] == "object"
            ? { ...this.inputInfo[property] }
            : this.inputInfo[property];
        this.newEvent.title = obj.title;
      }

      this.$store.commit("createEvent", this.newEvent);
    });
    eventBus.$on("saveChanges", obj => {
      for (let info in this.inputInfo) {
        this.$store.commit("addEventExtraInfo", {
          property: info,
          event: this.$props.event,
          value:
            typeof this.inputInfo[info] == "object"
              ? { ...this.inputInfo[info] }
              : this.inputInfo[info]
        });
      }
      for (let info in obj) {
        this.$store.commit("addEventExtraInfo", {
          property: info,
          event: this.$props.event,
          value: typeof obj[info] == "object" ? { ...obj[info] } : obj[info]
        });
      }
    });
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
.fade-less-leave-active,
.fade-less-enter-active {
  transition: 0.1s opacity cubic-bezier(0.25, 0.8, 0.5, 1);
}
.fade-less-enter-to,
.fade-less-leave {
  opacity: 1;
}
.fade-less-leave-to,
.fade-less-enter {
  opacity: 0;
}
.lover__part .repeat__options {
  width: 100% !important;
  margin: 0 !important;
}
.color__options_extra {
  width: 100%;
  transform: translateY(-50%);
  overflow-x: hidden;
  padding: 10px;
}
.active {
  color: rgb(63, 81, 181) !important;
}
.type__options_extra {
  width: 100%;
  transform: translateY(-50%);
  overflow-x: hidden;
  padding: 10px;
}
.color__options_extra .option {
  margin: 5px 10px 5px 10px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  color: white;
}
.lover__part {
  padding: 25px;
  padding-top: 0;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  transition: 0.4s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}
.extra_text_area {
  border: none;
  padding: 10px 15px 10px 10px;
  outline: none;
  font-size: 1rem;
  width: 100%;
  font-weight: 500;
  color: rgba(66, 66, 66, 0.6);
  background-color: rgba(211, 211, 211, 0.25);
}
.input__container {
  width: 100%;
  height: 50px;
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
.lover__input__container {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  align-items: center;
}
.input__container {
  width: 100%;
  height: 50px;
}
p > svg {
  justify-self: flex-end !important;
}
.lover__input__container svg {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  color: gray;
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
.repeat__options {
  width: 60%;
  height: 50px;
  position: relative;
  margin-top: 20px;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: rgba(66, 66, 66, 0.9);
  background-color: rgba(211, 211, 211, 0.25);
}
.remove__margin .repeat__options {
  margin: 0 !important;
}
.remove__margin .lover__input__container {
  margin: 0 !important;
}
.repeat__options p {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}
.repeat__options p > svg {
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
  width: 100%;
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
@media only screen and (max-width: 600px) {
  .options__container {
    min-width: 0;
    width: 100%;
    top: -100%;
  }
}
</style>