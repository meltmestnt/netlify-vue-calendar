<template>
  <div class="header__container">

    <div class="header">
      <div class="left__container">
        <div
          class="burger"
          @click="showMenu($event)"
        >
          <span></span>
          <span></span>
          <span></span>
          <circleBgc :round="true" />
        </div>
        <p class="dayspan">DaySpan</p>
        <div class="todayDate">
          <p
            class="today"
            @mouseover.stop="showPopup($event, todayText)"
            @mouseleave.stop="clearPopups(todayText)"
            @click="toTodayDate()"
          >Today
            <circleBgc />
            <popup :info="todayText" />
          </p>
          <div
            class="todayIcon"
            @mouseover.stop="showPopup($event, todayText)"
            @mouseleave.stop="clearPopups(todayText)"
            @click="toTodayDate()"
          >
            <font-awesome-icon :icon="['far', 'calendar-alt']" />
            <popup :info="todayText" />
          </div>
          <div class="arrows">
            <div
              class="arrow"
              @mouseover.stop="showPopup($event, arrowLeft)"
              @mouseleave.stop="clearPopups(arrowLeft)"
              @click="prevMonthContainer()"
            >
              <font-awesome-icon icon="angle-left" />
              <circleBgc :round="true" />
              <popup :info="arrowLeft" />
            </div>
            <div
              class="arrow"
              @mouseover="showPopup($event, arrowRight)"
              @mouseleave="clearPopups(arrowRight)"
              @click="nextMonthContainer()"
            >
              <font-awesome-icon icon="angle-right" />
              <circleBgc :round="true" />
              <popup :info="arrowRight" />
            </div>
          </div>
          <p class="date">
            {{formatDate}}
          </p>

        </div>
      </div>
      <div class="right__container">
        <p
          class="pickLayout"
          @click="openLayout()"
        >
          {{ getLayout }}
          <font-awesome-icon icon="caret-down" />
          <circleBgc />
        </p>
        <transition name="fade">
          <div
            class="pickLayout__modal"
            v-show="layoutModal"
          >
            <div
              class="layout"
              v-for="layout in layouts"
              :key="layout.type"
              @click="chooseLayout(layout)"
            >
              <div class="layout__text__container">
                <p>{{layout.type}}</p>
                <p>{{layout.type.slice(0,1)}}</p>
              </div>

            </div>
          </div>
        </transition>

        <div class="logout__container">
          <p class="logOut">Log out</p>
          <font-awesome-icon icon="long-arrow-alt-right">

          </font-awesome-icon>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import circleBgc from "./extras/circle_bgc.vue";
import popup from "./extras/popup.vue";
export default {
  components: {
    circleBgc,
    popup
  },
  name: "Header",
  data() {
    return {
      layoutModal: false,
      layouts: [
        {
          type: "Day",
          active: false
        },
        {
          type: "Week",
          active: false
        },
        {
          type: "Month",
          active: true
        },
        {
          type: "Year",
          active: false
        },
        {
          type: "Schedule",
          active: false
        },
        {
          type: "4 days",
          active: false
        }
      ],
      todayText: {
        show: false,
        text: ""
      },
      arrowLeft: {
        show: false,
        text: "Previous month"
      },
      arrowRight: {
        show: false,
        text: "Next month"
      }
    };
  },
  methods: {
    clearPopups(show) {
      show.show = false;
    },
    showPopup(ev,show) {
      if (ev.target == ev.currentTarget || ev.target.classList.contains('circle__container')) {
        show.show = true;
      }
    },
    prevMonthContainer() {
      eventBus.$emit("prevMonthContainer");
    },
    toTodayDate() {
      eventBus.$emit("toTodayDate");
    },
    nextMonthContainer() {
      eventBus.$emit("nextMonthContainer");
    },
    chooseLayout(layoutActive) {
      this.layouts.forEach(layout => (layout.active = false));
      layoutActive.active = true;
      this.layoutModal = false;
    },
    showMenu(ev) {
      if (
        document.body.clientWidth <= 600 ||
        document.documentElement.clientWidth <= 600 ||
        document.clientWidth <= 600
      ) {
        eventBus.$emit("fadeBackground", ev);
      }
      eventBus.$emit("showMenu", ev);
    },
    openLayout() {
      setTimeout(() => (this.layoutModal = true), 100);
    },
    closeHandler() {
      this.layoutModal = false;
    }
  },
  created() {
    this.$store.commit("getDate");
    this.todayText.text = `${this.date.day}, ${this.date.month} ${
      this.date.year
    }`;
    eventBus.$on("closeWindow", this.closeHandler);
  },
  computed: {
    getLayout() {
      for (let i = 0; i < this.layouts.length; i++) {
        if (this.layouts[i].active) {
          return this.layouts[i].type;
        }
      }
    },
    date() {
      return this.$store.getters.returnDate;
    },
    formatDate() {
      if (
        document.body.clientWidth <= 600 ||
        document.documentElement.clientWidth <= 600 ||
        document.clientWidth <= 600
      ) {
        return this.date.month.slice(0, 3) + " " + this.date.year;
      } else {
        return this.date.month + " " + this.date.year;
      }
    }
  }
};
</script>

<style scoped>
* {
  white-space: nowrap;
}
.fade-enter-active,
.fade-leave-active {
  transition: 0.3s all;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.pickLayout__modal {
  background-color: white;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
  color: grey;
  width: 170px;
  position: absolute;
  font-size: 1.1rem;
  top: 20%;
  right: 50%;
  transform: translateX(30%);
  z-index: 99;
  display: flex;
  flex-direction: column;
}
.layout__text__container {
  width: 100%;
  padding: 15px;
  transition: 0.3s;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.layout__text__container:hover {
  background-color: rgba(211, 211, 211, 0.3);
}
.todayIcon {
  display: none;
  margin: 5px;
  font-size: 1.2rem;
}
.header__container {
  width: 100%;
  height: 6vh;
  min-height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}
.header {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1%;
}
.left__container {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 70%;
}
.dayspan {
  font-weight: 500;
  font-size: 1.3rem;
  margin-left: 1%;
}
.burger {
  display: flex;
  width: 50px;
  height: 50px;
  cursor: pointer;
  flex-direction: column;
  border-radius: 50px;
  overflow: hidden;
  align-items: center;
  padding: 10px;
  justify-content: center;
  transition: 0.3s;
  position: relative;
}
.burger:hover {
  background-color: rgba(211, 211, 211, 0.6);
}
.burger > span {
  width: 80%;
  height: 2px;
  display: block;
  background-color: black;
  border-radius: 25px;
  margin: 2px;
}
.todayDate {
  width: 35%;
  height: 100%;
  margin-left: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.today {
  font-weight: 500;
  color: black;
  text-transform: uppercase;
  border-radius: 3px;
  position: relative;
  text-align: center;
  background-color: rgba(211, 211, 211, 0.35);
  padding: 8px 25px 8px 25px;
  margin-right: 20px;
  transition: 0.3s;
  font-size: 0.9rem;
  cursor: pointer;
}
.today:hover {
  background-color: rgba(211, 211, 211, 0.7);
}
.arrows {
  min-width: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: grey;
}
.arrow {
  margin: 0px;
  cursor: pointer;
  width: 35px;
  height: 35px;
  min-width: 35px;
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
.date {
  font-size: 1.1rem;
  color: grey;
  font-weight: 500;
  margin-left: 20px;
}
.right__container {
  width: 30%;
  display: flex;
  height: 100%;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  position: relative;
}
.pickLayout {
  font-weight: 500;
  color: black;
  text-transform: uppercase;
  border-radius: 3px;
  text-align: left;
  background-color: rgba(211, 211, 211, 0.35);
  padding: 8px 25px 8px 25px;
  position: relative;
  cursor: pointer;
  margin-right: 10px;
  transition: 0.3s;
  color: black;
  font-size: 0.9rem;
}
.pickLayout:hover {
  background-color: rgba(211, 211, 211, 0.7);
}
.logout__container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
  margin-left: 20px;
  padding: 16px;
  position: relative;
}
.logout__container > svg {
  margin-left: 10px;
  display: block;
}
.logout__container:hover {
  animation: slideLeft 0.5s infinite;
}
.logout__container > svg:hover {
  animation: slideLeft 0.3s infinite;
}
.pickLayout svg {
  margin-left: 5px;
}
.logOut {
  margin-right: 5px;
  font-size: 1.1rem;
  font-weight: 500;
  color: grey;
}
.right__container > svg {
  width: 45px;
  height: 45px;
  padding: 10px;
  border-radius: 35px;
  cursor: pointer;
  color: grey;
}
@keyframes slideLeft {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(3px, 0);
  }
}
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .today {
    display: none;
  }
  .dayspan {
    display: none;
  }
  .logOut {
    display: none;
  }
  .logout__container {
    padding: 5px;
    margin: 0;
  }
  .arrows {
    margin-left: 10px;
  }
  .arrow {
    margin: 0;
  }
  .todayIcon {
    display: block;
    position: relative;
  }
  .date {
    margin-left: 20px;
  }
  .logout__container > svg {
    margin-left: 5px;
  }
  .todayDate {
    margin: 0;
  }
  .right__container {
    min-width: 30%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .left__container {
    max-width: 70%;
  }
  .pickLayout {
    padding: 10px;
    margin: 0;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
</style>