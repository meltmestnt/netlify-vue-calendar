<template>
  <div
    class="event__container"
    v-if="$props.event"
    :id="id"
    :class="{continued__ev: event.continuedEv}"
  >
    <InfoEdit
      @closeeditinfo="closeEditInfo()"
      :editEvent="editEvent"
      :event="event"
      :day="day"
    />
    <div
      @click="openInfo($event)"
      class="event"
      :class="{disabled: computeDate || $props.event.canceled}"
      :style="{'background-color': $props.event.color.color}"
    >
      <p :class="{canceled: $props.event.canceled}">
        {{ event.continuedEv ? ' ' : event.title }}
      </p>
    </div>
    <EventInfo
      v-show="show"
      :target="target"
      :prevMonth="prevMonth"
      @closeinfo="closeInfo($event)"
      :show="show"
      @openEditInfo="editEvent = true"
      :event="$props.event"
    />
  </div>
</template>

<script>
import EventInfo from "./EventInfo.vue";
import InfoEdit from "./InfoEdit.vue";

export default {
  name: "Event",
  components: {
    EventInfo,
    InfoEdit
  },
  props: {
    day: {
      type: Object,
      required: true
    },
    prevMonth: {
      type: Boolean,
      default: false
    },
    event: {
      type: Object
    }
  },
  data() {
    return {
      show: false,
      closeHandler: null,
      target: {},
      id: Math.floor(Math.random() * 1000).toString(),
      editEvent: false
    };
  },
  beforeDestroy() {
    eventBus.$off("closeWindow", this.closeHandler);
  },
  created() {
    this.closeHandler = ev => {
      let target = document.getElementById(`${this.id}`);
      if (target == null) return;
      if (
        ev.target == target ||
        target.contains(ev.target) ||
        ev.target.contains(target)
      ) {
        return;
      } else if (!this.show) {
        return;
      } else {
        this.show = false;
      }
    };
    eventBus.$on("closeWindow", this.closeHandler);
  },

  methods: {
    closeEditInfo() {
      this.editEvent = false;
    },
    closeInfo(ev) {
      if (!ev.target.classList.contains("circle__container")) {
        return;
      }
      this.show = false;
    },
    openInfo(ev) {
      if (ev.target.classList.contains("circle__container")) {
        return;
      }
      this.target = ev.target;
      this.show = true;
    }
  },
  computed: {
    computeDate() {
      let year = +this.$store.getters.returnDate.year;
      if (this.event.month == "December" && this.prevMonth) {
        year -= 1;
      }
      if (year > new Date().getFullYear()) {
        return false;
      } else if (
        year < new Date().getFullYear() &&
        this.event.day < new Date().getDate() &&
        this.event.monthNumber == new Date().getMonth()
      ) {
        return true;
      } else if (
        this.event.monthNumber < new Date().getMonth() ||
        year < new Date().getFullYear()
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.disabled {
  position: relative;
  opacity: 0.4;
}
.canceled::after {
  content: "";
  width: 100%;
  height: 2px;
  background: black;
  z-index: 99999;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
.event p {
  position: relative;
}
/* .disabled::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 95%;
  height: 2px;
  opacity: 0.9;
  background-color: white;
  transform: translate(-50%, -50%);
} */
.event__container {
  width: 100%;
  min-height: 18px;
  position: relative;
  color: rgb(255, 255, 255);
  margin-top: 5px;
  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 3px;
  padding: 5px;
}
.continued__ev {
  padding: 0 !important;
  height: 20px !important;
  opacity: 0.5;
  border-radius: 0px !important;
}
.continued__ev .event {
  border-radius: 0px !important;
}
.event {
  width: 100%;
  height: 100%;
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 4px;
  border-radius: 3px;
}
</style>