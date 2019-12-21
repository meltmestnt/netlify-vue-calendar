<template>
  <div class="calendar__container">
    <div class="date__controls">
      <p>{{`${month} ${year}`}}</p>
      <div class="arrows">
        <div
          class="arrow"
          @mouseover.stop="showPopup($event, arrowLeft)"
          @mouseleave.stop="clearPopups(arrowLeft)"
          @click="prevMonth()"
        >
          <font-awesome-icon icon="angle-left" />
          <circleBgc :round="true" />
          <popup :info="arrowLeft" />
        </div>
        <div
          class="arrow"
          @mouseover.stop="showPopup($event, arrowRight)"
          @mouseleave.stop="clearPopups(arrowRight)"
          @click="nextMonth()"
        >
          <font-awesome-icon icon="angle-right" />
          <circleBgc :round="true" />
          <popup :info="arrowRight" />
        </div>
      </div>
    </div>
    <div class="weekdays__container">
      <p
        v-for="day in weekdays"
        :key="day"
      >{{day.slice(0,1)}}</p>
    </div>
    <div class="calendar">
      <div
        class="weekdays__container"
        v-for="(dayinweek,index) in daysinweek"
        :key="index + Math.random() * 100"
      >
        <div
          class="day__container"
          :class="{day__container_hover: day != ''.trim(), day__container_cursor: day != ''.trim()}"
          v-for="(day,index) in dayinweek.days"
          :key="index + Math.random() * 100"
          @click="changeDateMainContainer($event,day.day)"
        >
          <p>{{day.day}}</p>
          <circleBgc
            v-show="day.day"
            :round="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import circleBgc from "./circle_bgc.vue";
import popup from "./popup.vue";
export default {
  name: "Calendar",
  components: {
    circleBgc,
    popup
  },
  props: {
    notMenu: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    weekdays() {
      return this.$store.getters.returnDays;
    },
    date() {
      return this.$store.getters.returnDate;
    }
  },
  data() {
    return {
      arrowLeft: {
        show: false,
        text: "Previous month"
      },
      arrowRight: {
        show: false,
        text: "Next month"
      },
      days: [],
      month: "",
      year: "",
      daysinweek: [],
      dateMonth: new Date().getMonth()
    };
  },
  methods: {
    clearPopups(show) {
      show.show = false;
    },
    showPopup(ev, show) {
      if (
        ev.target == ev.currentTarget ||
        ev.target.classList.contains("circle__container")
      ) {
        show.show = true;
      }
    },
    prevMonth() {
      if (this.dateMonth == 0) {
        this.dateMonth = 11;
        this.year -= 1;
      } else {
        this.dateMonth -= 1;
      }
      this.getWeekday(new Date(+this.year, this.dateMonth, 1));
    },
    nextMonth() {
      if (this.dateMonth == 11) {
        this.dateMonth = 0;
        this.year = parseInt(this.year) + 1;
      } else {
        this.dateMonth += 1;
      }
      this.getWeekday(new Date(+this.year, this.dateMonth, 1));
    },
    changeDateMainContainer(ev, dayinweek) {
      let month = this.month,
        year = this.year;
      if (this.notMenu) {
        this.$emit("closeWindow", ev, { dayinweek, ...this.date });
        return;
      }
      this.$store.commit("changeDate", {
        month,
        year
      });
      eventBus.$emit("changeDateMainContainer", this.dateMonth, this.year);
    },
    getWeekday(date) {
      let weekDay = date.getDay(),
        days = [],
        monthes = this.$store.getters.returnMonthes,
        dateMonth = "";
      for (let i = 0; i < monthes.length; i++) {
        if (date.getMonth() == i) {
          dateMonth = monthes[i];
        }
      }
      switch (dateMonth) {
        case "January":
          days = [...this.$store.getters.returnMonthesWithDays[0].days];
          this.month = "January";
          break;
        case "February":
          days = [...this.$store.getters.returnMonthesWithDays[1].days];
          this.month = "February";
          break;
        case "March":
          days = [...this.$store.getters.returnMonthesWithDays[2].days];
          this.month = "March";
          break;
        case "April":
          days = [...this.$store.getters.returnMonthesWithDays[3].days];
          this.month = "April";
          break;
        case "May":
          days = [...this.$store.getters.returnMonthesWithDays[4].days];
          this.month = "May";
          break;
        case "June":
          days = [...this.$store.getters.returnMonthesWithDays[5].days];
          this.month = "June";
          break;
        case "July":
          days = [...this.$store.getters.returnMonthesWithDays[6].days];
          this.month = "July";
          break;
        case "August":
          days = [...this.$store.getters.returnMonthesWithDays[7].days];
          this.month = "August";
          break;
        case "September":
          days = [...this.$store.getters.returnMonthesWithDays[8].days];
          this.month = "September";
          break;
        case "October":
          days = [...this.$store.getters.returnMonthesWithDays[9].days];
          this.month = "October";
          break;
        case "November":
          days = [...this.$store.getters.returnMonthesWithDays[10].days];
          this.month = "November";
          break;
        case "December":
          days = [...this.$store.getters.returnMonthesWithDays[11].days];
          this.month = "December";
          break;
      }
      switch (weekDay.toString()) {
        case "0":
          days = [...days];
          break;
        case "1":
          days = ["", ...days];
          break;
        case "2":
          days = ["", "", ...days];
          break;
        case "3":
          days = ["", "", "", ...days];
          break;
        case "4":
          days = ["", "", "", "", ...days];
          break;
        case "5":
          days = ["", "", "", "", "", ...days];
          break;
        case "6":
          days = ["", "", "", "", "", "", ...days];
          break;
      }
      for (let i = 1; i < 8; i++) {
        if (days.length + 1 <= 35) {
          days = [...days, ""];
        }
      }
      this.daysinweek = [
        {
          days: [...days.slice(0, 7)]
        },
        {
          days: [...days.slice(7, 14)]
        },
        {
          days: [...days.slice(14, 21)]
        },
        {
          days: [...days.slice(21, 28)]
        },
        {
          days: [...days.slice(28, 35)]
        },
        {
          days: [...days.slice(35, 42)]
        }
      ];
    }
  },
  created() {
    this.year = this.date.year;
    this.getWeekday(new Date(+this.date.year, new Date().getMonth(), 1));
  }
};
</script>

<style scoped>
.calendar__container {
  width: 100%;
  white-space: nowrap;
  cursor: auto;
  padding: 10px 10px 10px 10px;
}
.calendar {
  width: 100%;
  padding: 0px 0px 10px 0px;
}
.date__controls > p {
  margin-left: 10px;
}
.date__controls {
  display: flex;
  width: 100%;
  padding: 10px 0px 10px 0px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: grey;
}
.arrows {
  min-width: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: rgba(128, 128, 128, 0.5);
}
.arrow {
  cursor: pointer;
  width: 30px;
  margin-left: 3px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 1.3rem;
  transition: 0.3s;
  border-radius: 50px;
}
.arrow:hover {
  background-color: rgba(211, 211, 211, 0.6);
}
.day__container {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: black;
  font-weight: 500;
  transition: 0.3s;
  border-radius: 50%;
}
.day__container_hover:hover {
  background-color: rgba(211, 211, 211, 0.6);
}
.day__container_cursor {
  cursor: pointer;
}
.days__container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  color: black;
  font-size: 0.8rem;
}
.weekdays__container {
  display: flex;
  color: grey;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 0.8rem;
  margin-top: 5px;
}
.weekdays__container:last-child {
  justify-content: flex-start;
}
.weekdays__container p {
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
}
.calendar__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
  justify-content: flex-start;
}
</style>