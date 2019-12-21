import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const dayFiller = (daysofmonth, month, monthNumber) => {
  let days = [],
    randomEvents = [],
    random = Math.floor(Math.random() * 2),
    endMonthEventRandom = Math.floor(Math.random() * 2);
  for (let i = 0; i < random; i++) {
    randomEvents.push(Math.floor(Math.random() * daysofmonth));
  }
  for (let i = 1; i <= daysofmonth; i++) {
    let events = [];
    for (let j = 0; j < randomEvents.length; j++) {
      if (randomEvents[j] == i) {
        events.push({
          month: month,
          monthNumber: monthNumber,
          day: i,
          title: "9am Weekly Meeting",
          color: {
            name: "Navy",
            color: "rgb(63, 81, 181)"
          },
          country: "",
          description: "",
          type: "Regular event",
          extraType: {},
          isBusy: true,
          canceled: false
        });
      }
    }
    if (i == daysofmonth && endMonthEventRandom > 0) {
      events.push({
        month: month,
        monthNumber: monthNumber,
        day: i,
        title: "End of month",
        color: {
          name: "Black",
          color: "rgb(0,0,0)"
        },
        country: "",
        description: "",
        type: "Month ending",
        extraType: {},
        isBusy: true,
        canceled: false
      });
    }
    let day = {
      day: i,
      events: events
    };
    days.push(day);
  }
  return days;
};
const store = new Vuex.Store({
  state: {
    date: {
      month: "",
      year: new Date().getFullYear().toString(),
      day: ""
    },
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    years: {},
    monthes: [
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
    ]
  },
  mutations: {
    initialiseMonthes(state) {
      let localEvents = JSON.parse(localStorage.getItem("years")) || {};
      if (localEvents[state.date.year]) {
        state.years = JSON.parse(localStorage.getItem("years"));
      } else {
        let tempMonthes = [
          {
            name: "January",
            days: dayFiller(31, "January", 0)
          },
          {
            name: "February",
            days: dayFiller(28, "February", 1)
          },
          {
            name: "March",
            days: dayFiller(31, "March", 2)
          },
          {
            name: "April",
            days: dayFiller(30, "April", 3)
          },
          {
            name: "May",
            days: dayFiller(31, "May", 4)
          },
          {
            name: "June",
            days: dayFiller(30, "June", 5)
          },
          {
            name: "July",
            days: dayFiller(31, "July", 6)
          },
          {
            name: "August",
            days: dayFiller(31, "August", 7)
          },
          {
            name: "September",
            days: dayFiller(30, "September", 8)
          },
          {
            name: "October",
            days: dayFiller(31, "October", 9)
          },
          {
            name: "November",
            days: dayFiller(30, "November", 10)
          },
          {
            name: "December",
            days: dayFiller(31, "December", 11)
          }
        ];
        if (!state.years[state.date.year]) {
          Vue.set(state.years, state.date.year, {});
          Vue.set(state.years[state.date.year], "monthesWithDays", tempMonthes);
        }
        localStorage.setItem("years", JSON.stringify(state.years));
      }
    },
    getDate(state) {
      let date = new Date();
      for (let key in state.monthes) {
        if (key == date.getMonth()) {
          state.date.month = state.monthes[key];
        }
      }
      for (let key in state.days) {
        if (key == date.getDay()) {
          state.date.day = state.days[key];
        }
      }
      state.date.year = date.getFullYear().toString();
    },
    changeMonth(state, payload) {
      state.date.month = payload;
    },
    changeDate(state, payload) {
      state.date.month = payload.month;
      state.date.year = payload.year;
    },
    addEventExtraInfo(state, payload) {
      Vue.set(payload.event, payload.property, payload.value);
      saveLocalStore(state);
    },
    cancelOccasion(state, payload) {
      payload.canceled = true;
      saveLocalStore(state);
    },
    howOftenRepeatExpand(state, payload) {
      for (let year in state.years) {
        if (year == state.date.year) {
          state.years[year].monthesWithDays[
            payload.event.monthNumber
          ].days.forEach(day => {
            if (payload.day.day < day.day && day.day < payload.day.day + 7) {
              let ev = {};
              for (let key in payload.event) {
                ev[key] =
                  typeof payload.event[key] == "object"
                    ? { ...payload.event[key] }
                    : payload.event[key];
              }
              ev.continuedEv = true;
              day.events.push(ev);
            }
          });
        }
      }
    },
    removeEvent(state, payload) {
      for (let year in state.years) {
        if (year == state.date.year) {
          state.years[year].monthesWithDays.forEach((month, i) => {
            if (i == payload.monthNumber) {
              month.days.forEach(day => {
                if (day.day == payload.day) {
                  day.events.forEach((ev, i) => {
                    if (ev == payload) {
                      day.events.splice(i, 1);
                    }
                  });
                }
              });
            }
          });
        }
      }
      saveLocalStore(state);
    },
    createEvent(state, payload) {
      for (let year in state.years) {
        if (year == state.date.year) {
          state.years[year].monthesWithDays.forEach((month, i) => {
            if (i == payload.monthNumber) {
              month.days.forEach(day => {
                if (day.day == payload.day) {
                  day.events.push(payload);
                }
              });
            }
          });
        }
      }
      localStorage.setItem("years", JSON.stringify(state.years));
    }
  },
  actions: {
    reduceYear(context) {
      context.state.date.year = context.state.date.year - 1;
      context.commit("initialiseMonthes");
    },
    increaseYear(context) {
      context.state.date.year = parseInt(context.state.date.year) + 1;
      context.commit("initialiseMonthes");
    }
  },
  getters: {
    returnDate(state) {
      return state.date;
    },
    returnDays(state) {
      return state.days;
    },
    returnMonthesWithDays(state) {
      return state.years[state.date.year].monthesWithDays;
    },
    returnMonthes(state) {
      return state.monthes;
    }
  }
});

const saveLocalStore = state =>
  localStorage.setItem("years", JSON.stringify(state.years));

export default store;
