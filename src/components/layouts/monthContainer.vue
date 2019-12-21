<template>
  <div
    class="main__section"
    :class="{reduced: reduceMainSection}"
  >
    <newEventCircle @createEvent="toCreateEvent" />
    <createEvent
      ref="createEv"
      :clientRect="createEvent"
      :nextMonthCreate="nextMonthCreate"
      :prevMonthCreate="prevMonthCreate"
      v-show="showCreateEventForm"
      :day="tempEvent"
      :event="creatingEvent"
      @changeTitle="changeNewEventTitle"
      @closeNewEventDialog="closeNewEventDialog()"
      @openEditInfo="openEditInfo()"
      @changeEv="changeEv"
    />
    <InfoEdit
      @closeeditinfo="closeEditInfo()"
      :editEvent="editEvent"
      :event="creatingEvent"
      :day="tempEvent"
      :creating="true"
      @closeNewEventDialog="closeNewEventDialog()"
    />
    <confirmation
      @cancelConfirmation="showConfirmationWindow = false"
      :showConfirmationWindow="showConfirmationWindow"
      :info="confirmationObj"
    />
    <div class="monthes__section">
      <div class="weekday__container">
        <div
          class="weekday"
          v-for="weekday in $store.getters.returnDays"
          :key="weekday"
          :class="{active_weekday: date.day == weekday}"
        >
          {{weekday.slice(0,3)}}
        </div>
      </div>
      <div
        class="seven_month__container"
        v-for="(dayinweek,index) in daysinweek"
        :key="dayinweek.id"
      >
        <div
          class="month__container"
          v-for="(day,index) in dayinweek.days"
          :key="day.day"
          :data-day="day.day"
          @click.self="toCreateEvent($event, day)"
        >
          <p :class="{disabled: day.prevMonth || day.tempEvent, margin_top: daysinweek[0] == dayinweek
          , active: day.day == new Date().getDate()
           && new Date().getMonth() == dateMonth
            && !day.prevMonth && date.year == new Date().getFullYear() }">{{day.day}}</p>

          <Event
            v-for="(event,i) in day.events"
            :key="i"
            :event="event"
            :day="day"
            :prevMonth="day.prevMonth"
            v-show="event"
          />
          <div
            class="temp__event__container"
            v-show="day.tempMonth"
          >
            <div class="temp__event">
              <p>{{tempEventTitle || '(no title)'}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Event from "./../Event.vue";
import createEvent from "./../createEvent.vue";
import circleBgc from "./../extras/circle_bgc.vue";
import confirmation from "./../extras/confirmation.vue";
import newEventCircle from "./../extras/newEventCircle.vue";
import InfoEdit from "./../InfoEdit";
export default {
  name: "monthContainer",
  components: {
    Event,
    circleBgc,
    InfoEdit,
    newEventCircle,
    confirmation,
    createEvent
  },
  data() {
    return {
      editEvent: false,
      month: "",
      confirmationObj: {},
      reduceMainSection: false,
      tempEvent: {},
      tempEventTitle: "",
      targetCreate: null,
      days: [],
      createEvent: {
        top: "",
        left: ""
      },
      creatingEvent: {
        month: "January",
        monthNumber: "0",
        day: "1",
        title: "",
        color: {
          name: "Navy",
          color: "rgb(63, 81, 181)"
        },
        country: "",
        description: "",
        type: "Regular event",
        extraType: {
          icon: "",
          text: "None"
        },
        isBusy: "Busy"
      },
      prevMonthCreate: false,
      nextMonthCreate: false,
      confirmationText: "",
      showConfirmationWindow: false,
      daysinweek: [],
      dateMonth: new Date().getMonth(),
      activeWeekday: "",
      prevMonthDays: [],
      nextMonthDays: [],
      showCreateEventForm: false
    };
  },
  computed: {
    date() {
      return this.$store.getters.returnDate;
    },
    returnFirstDay() {
      let day = this.daysinweek
        .filter((week, i) => i == 0)[0]
        .days.filter(day => day.day == 1);
      return day[0];
    }
  },
  created() {
    eventBus.$on("confirmationWindow", info => {
      this.confirmationObj = info;
      this.showConfirmationWindow = true;
    });
    eventBus.$on("showMenu", () => {
      this.reduceMainSection = !this.reduceMainSection;
    });
    this.getWeekday(new Date(+this.date.year, new Date().getMonth(), 1));
    eventBus.$on("toTodayDate", () => {
      this.$store.commit("getDate");
      this.dateMonth = new Date().getMonth();
      this.getWeekday(new Date(+this.date.year, new Date().getMonth(), 1));
    });
    eventBus.$on("closeWindow", ev => {
      if (!this.targetCreate) return;
      if (
        !ev.target.classList.contains("month__container") &&
        this.targetCreate != ev.target &&
        !this.targetCreate.contains(ev.target) &&
        !document.querySelector(".new__event__container").contains(ev.target)
      ) {
        this.showCreateEventForm = false;
        this.tempEvent.tempMonth = false;
      }
    });
    eventBus.$on("changeDateMainContainer", (month, year) => {
      this.dateMonth = month;
      this.getWeekday(new Date(+year, this.dateMonth, 1));
    });
    eventBus.$on("prevMonthContainer", () => {
      if (this.dateMonth == 0) {
        this.dateMonth = 11;
        this.$store.dispatch("reduceYear");
        this.$store.commit("changeEvents");
      } else {
        this.dateMonth -= 1;
      }
      this.getWeekday(new Date(+this.date.year, this.dateMonth, 1));
    });
    eventBus.$on("nextMonthContainer", () => {
      if (this.dateMonth == 11) {
        this.dateMonth = 0;
        this.$store.dispatch("increaseYear");
        this.$store.commit("changeEvents");
      } else {
        this.dateMonth += 1;
      }
      this.getWeekday(new Date(+this.date.year, this.dateMonth, 1));
    });
  },
  methods: {
    changeEv(newEv) {
      for (let i in newEv) {
        this.creatingEvent[i] = newEv[i];
      }
    },
    openEditInfo() {
      this.editEvent = true;
    },
    closeEditInfo() {
      this.creatingEvent = {};
      this.editEvent = false;
    },
    closeNewEventDialog() {
      this.showCreateEventForm = false;
      this.tempEvent.tempMonth = false;
    },
    changeNewEventTitle(title) {
      this.tempEventTitle = title;
    },
    toCreateEvent(ev, day) {
      ev = ev.target || ev;
      if (!day) {
        day = this.returnFirstDay;
      }

      let rect = ev.getBoundingClientRect();
      this.targetCreate = document.querySelector(".create__event__container");
      this.daysinweek.forEach(dayinweek => {
        dayinweek.days.forEach(day => {
          if (day.tempMonth) {
            day.tempMonth = false;
          }
        });
      });
      this.prevMonthCreate = false;
      this.nextMonthCreate = false;
      this.prevMonthDays.forEach(dayz => {
        if (dayz == day) {
          this.prevMonthCreate = true;
        }
      });
      this.nextMonthDays.forEach(dayz => {
        if (dayz == day) {
          this.nextMonthCreate = true;
        }
      });
      day.tempMonth = true;
      this.tempEvent = day;
      this.creatingEvent = {
        month: this.date.month,
        monthNumber: this.$refs.createEv.getMonthNumber(this.date.month),
        day: this.tempEvent.day,
        title: "",
        color: {
          name: "Navy",
          color: "rgb(63, 81, 181)"
        },
        country: "",
        description: "",
        type: "Regular event",
        extraType: {},
        isBusy: "Busy",
        canceled: false
      };
      this.createEvent = {
        top: rect.top,
        left: rect.left + ev.clientWidth,
        leftOffsetMenu: parseInt(
          document.querySelector(".main__section").offsetLeft
        )
      };
      this.showCreateEventForm = true;
    },
    getWeekday(date) {
      let weekDay = date.getDay(),
        days = [],
        monthes = this.$store.getters.returnMonthes,
        dateMonth = "",
        daysCopy = [],
        extraSpace = [];
      for (let i = 0; i < monthes.length; i++) {
        if (date.getMonth() == i) {
          dateMonth = monthes[i];
        }
      }
      switch (dateMonth) {
        case "January":
          days = [...this.$store.getters.returnMonthesWithDays[0].days];
          this.month = "January";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[11].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[1].days
          ];
          break;
        case "February":
          days = [...this.$store.getters.returnMonthesWithDays[1].days];
          this.month = "February";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[0].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[2].days
          ];
          break;
        case "March":
          days = [...this.$store.getters.returnMonthesWithDays[2].days];
          this.month = "March";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[1].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[3].days
          ];
          break;
        case "April":
          days = [...this.$store.getters.returnMonthesWithDays[3].days];
          this.month = "April";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[2].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[4].days
          ];
          break;
        case "May":
          days = [...this.$store.getters.returnMonthesWithDays[4].days];
          this.month = "May";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[3].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[5].days
          ];
          break;
        case "June":
          days = [...this.$store.getters.returnMonthesWithDays[5].days];
          this.month = "June";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[4].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[6].days
          ];
          break;
        case "July":
          days = [...this.$store.getters.returnMonthesWithDays[6].days];
          this.month = "July";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[5].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[7].days
          ];
          break;
        case "August":
          days = [...this.$store.getters.returnMonthesWithDays[7].days];
          this.month = "August";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[6].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[8].days
          ];
          break;
        case "September":
          days = [...this.$store.getters.returnMonthesWithDays[8].days];
          this.month = "September";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[7].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[9].days
          ];
          break;
        case "October":
          days = [...this.$store.getters.returnMonthesWithDays[9].days];
          this.month = "October";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[8].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[10].days
          ];
          break;
        case "November":
          days = [...this.$store.getters.returnMonthesWithDays[10].days];
          this.month = "November";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[9].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[11].days
          ];
          break;
        case "December":
          days = [...this.$store.getters.returnMonthesWithDays[11].days];
          this.month = "December";
          this.prevMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[10].days
          ];
          this.nextMonthDays = [
            ...this.$store.getters.returnMonthesWithDays[0].days
          ];
          break;
      }
      daysCopy = [...days];
      this.$store.commit("changeMonth", this.month);
      for (let i = 0; i < this.prevMonthDays.length; i++) {
        this.prevMonthDays[i] = {
          ...this.prevMonthDays[i],
          prevMonth: true
        };
      }
      for (let i = 0; i < this.nextMonthDays.length; i++) {
        this.nextMonthDays[i] = {
          ...this.nextMonthDays[i],
          prevMonth: true
        };
      }
      switch (weekDay.toString()) {
        case "0":
          days = [...days];
          break;
        case "1":
          days = [this.prevMonthDays[this.prevMonthDays.length - 1], ...days];
          break;
        case "2":
          days = [
            this.prevMonthDays[this.prevMonthDays.length - 2],
            this.prevMonthDays[this.prevMonthDays.length - 1],
            ...days
          ];
          break;
        case "3":
          days = [
            this.prevMonthDays[this.prevMonthDays.length - 3],
            this.prevMonthDays[this.prevMonthDays.length - 2],
            this.prevMonthDays[this.prevMonthDays.length - 1],
            ...days
          ];
          break;
        case "4":
          days = [
            this.prevMonthDays[this.prevMonthDays.length - 4],
            this.prevMonthDays[this.prevMonthDays.length - 3],
            this.prevMonthDays[this.prevMonthDays.length - 2],
            this.prevMonthDays[this.prevMonthDays.length - 1],
            ...days
          ];
          break;
        case "5":
          days = [
            this.prevMonthDays[this.prevMonthDays.length - 5],
            this.prevMonthDays[this.prevMonthDays.length - 4],
            this.prevMonthDays[this.prevMonthDays.length - 3],
            this.prevMonthDays[this.prevMonthDays.length - 2],
            this.prevMonthDays[this.prevMonthDays.length - 1],
            ...days
          ];
          break;
        case "6":
          days = [
            this.prevMonthDays[this.prevMonthDays.length - 6],
            this.prevMonthDays[this.prevMonthDays.length - 5],
            this.prevMonthDays[this.prevMonthDays.length - 4],
            this.prevMonthDays[this.prevMonthDays.length - 3],
            this.prevMonthDays[this.prevMonthDays.length - 2],
            this.prevMonthDays[this.prevMonthDays.length - 1],
            ...days
          ];
          break;
      }
      for (let i = 1; i < 8; i++) {
        if (days.length + 1 <= 35) {
          days = [...days, this.nextMonthDays[i - 1]];
        }
      }
      this.daysinweek = [
        {
          days: [...days.slice(0, 7)],
          id: 0
        },
        {
          days: [...days.slice(7, 14)],
          id: 1
        },
        {
          days: [...days.slice(14, 21)],
          id: 2
        },
        {
          days: [...days.slice(21, 28)],
          id: 3
        },
        {
          days: [...days.slice(28, 35)],
          id: 4
        }
      ];
      if (daysCopy.length >= 29 && weekDay > 3) {
        let j = -1;
        for (
          let i = daysCopy.length;
          days.length + extraSpace.length < 42;
          i++
        ) {
          extraSpace.push(this.nextMonthDays[++j]);
        }
        this.daysinweek = [
          ...this.daysinweek,
          {
            days: [...days.slice(35, days.length), ...extraSpace]
          }
        ];
      }
    }
  }
};
</script>

<style scoped>
.reduced {
  width: calc(100% - 350px) !important;
}

.event p {
  width: 100%;
  padding: 5px;
}
.main__section {
  width: 100%;
  transition: 0.3s all cubic-bezier(0.19, 1, 0.22, 1);
  height: 94vh;
  position: absolute;
  top: 0;
  right: 0;
  background-color: white;
}
.disabled {
  color: grey !important;
  font-weight: 300;
}
.active {
  color: white;
  background-color: #4285f4;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  text-align: center;
}
.active_weekday {
  font-weight: 500;
  color: #4285f4;
}
.margin_top {
  margin-top: 20px;
}
.weekday__container {
  width: 100%;
  transition: 0.3s all cubic-bezier(0.19, 1, 0.22, 1);
  position: absolute;
  height: 2%;
  min-height: 20px;
  font-size: 0.8rem;
  top: 0;
  left: 0;
  color: grey;
  display: flex;
  flex-direction: row;
}
.weekday {
  width: 14.25%;
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.monthes__section {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  transition: 0.3s all cubic-bezier(0.19, 1, 0.22, 1);
}
.seven_month__container {
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  color: black;
  border-bottom: 1px solid #e0e0e0;
}
.month__container {
  transition: 0.3s all cubic-bezier(0.19, 1, 0.22, 1);
  width: 14.25%;
  font-size: 0.9rem;
  background-color: #fff;
  height: 100%;
  border-right: 1px solid #e0e0e0;
  font-weight: 500;
}
.month__container > p {
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.temp__event__container {
  width: 100%;
  min-height: 18px;
  position: relative;
  color: rgb(255, 255, 255);
  margin-top: 5px;
  white-space: nowrap;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 3px;
  background: lightgrey;
}
.temp__event {
  width: 100%;
  height: 100%;
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 4px;
  border-radius: 3px;
}
@media only screen and (max-width: 600px) {
  .main__section {
    width: 100% !important;
  }
  .reduced {
    width: 100% !important;
  }
}
</style>