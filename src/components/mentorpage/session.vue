<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Message from "./message.vue";
import RescheduleDialog from "./RescheduleDialog.vue";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const props = defineProps({
  schedule: {
    type: Array,
    required: false,
  },
  upcomingSchedule: {
    type: Array,
    required: false,
  },
});

const todaySchedule = ref([]);
const upcommingSchedule = ref([]);
const selectedSessionID = ref(null);

const isMessage = ref(false);
const activePopup = ref({
  type: null,
  index: null,
});

function getCookie(name){
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const sendReminder = async (item) => {
  try {
    const response = await axios.post("http://localhost:8000/api/send/session/reminder/" + item.id, {
      withCredentials: true,
      header: {
        'Content-Type': "application/json",
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error sending reminder:", error);
  }
};

const cancelSession = async (item) => {
  try {
    const response = await axios.post("http://localhost:8000/api/send/session/cancel/" + item.id, {
      withCredentials: true,
      header: {
        'Content-Type': "application/json",
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
      }
    })
    .then((response) => {
      console.log(response.data);
      todaySchedule.value = todaySchedule.value.filter((session) => session.id !== item.id);
      upcommingSchedule.value = upcommingSchedule.value.filter((session) => session.id !== item.id);
      alert("Session cancelled successfully!");
    });
  
  } catch (error) {
    console.error("Error cancelling session:", error);
  }
};

const togglePopup = (type, index, event) => {
  event.stopPropagation();
  if (activePopup.value.type === type && activePopup.value.index === index) {
    activePopup.value = { type: null, index: null };
  } else {
    activePopup.value = { type, index };
  }
};

const handleOptionClick = (option, item, event) => {
  event.stopPropagation();
  switch (option) {
    case "remind":
      alert(`Set reminder for ${item.subject}`);
      sendReminder(item);
      break;
    case "reschedule":
      selectedSessionID.value = item.id;
      break;
    case "cancel":
      alert(`Cancel ${item.subject}`);
      cancelSession(item);
      break;
  }
  activePopup.value = { type: null, index: null };
};

const toggleMessage = (event) => {
  event.stopPropagation();
  isMessage.value = !isMessage.value;
};

const handleMessageClose = () => {
  isMessage.value = false;
};

const closePopups = () => {
  activePopup.value = { type: null, index: null };
};

const reschedIsOpen = ref(false);

onMounted(() => {
  document.addEventListener('click', closePopups);
  todaySchedule.value = props.schedule;
  upcommingSchedule.value = props.upcomingSchedule;
});

onUnmounted(() => {
  document.removeEventListener('click', closePopups);
});
</script>

<template>
  <div class="session-wrapper">
    <div class="top-element">
      <font-awesome-icon icon="fa-calendar" size="3x" color="#fff" />
      <h1>SESSION SCHEDULE</h1>
    </div>
    <div class="lower-element">
      <div class="session-grid">
        <!-- Today Schedule -->
        <div class="session-card">
          <h1>TODAY</h1>
          <div
            v-for="(item, index) in todaySchedule"
            :key="index"
            class="today-card"
          >
            <div class="card-header">
              <h1>{{ item.subject }}</h1>
              <div class="ellipsis-container">
                <font-awesome-icon
                  icon="fa-ellipsis-h"
                  size="2x"
                  color="#066678"
                  style="cursor: pointer"
                  @click="togglePopup('today', index, $event)"
                />
                <transition name="fade" mode="out-in">
                  <div
                    v-if="activePopup.type === 'today' && activePopup.index === index"
                    class="popup-menu"
                    @click.stop
                  >
                    <div
                      class="popup-option"
                      @click="handleOptionClick('remind', item, $event)"
                    >
                      <font-awesome-icon
                        icon="fa-bell"
                        size="1x"
                        color="#066678"
                        class="option-icon"
                      />
                      <p class="option-text">Remind</p>
                    </div>
                    <div
                      class="popup-option"
                      @click="handleOptionClick('reschedule', item, $event)"
                    >
                      <font-awesome-icon
                        icon="fa-calendar-alt"
                        size="1x"
                        color="#066678"
                        class="option-icon"
                      />
                      <p class="option-text" @click="reschedIsOpen = true">Reschedule</p>
                    </div>
                    <div
                      class="popup-option"
                      @click="handleOptionClick('cancel', item, $event)"
                    >
                      <font-awesome-icon
                        icon="fa-times"
                        size="1x"
                        color="#066678"
                        class="option-icon"
                      />
                      <p class="option-text">Cancel Session</p>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="info name">
              <font-awesome-icon icon="fa-user" size="2x" color="#533566" />
              <h2>{{ item.learner.name }}</h2>
            </div>
            <div class="info">
              <font-awesome-icon icon="fa-calendar-alt" size="2x" color="#0084ce" />
              <p>{{ item.date }}</p>
            </div>
            <div class="info">
              <font-awesome-icon icon="fa-clock" size="2x" color="#f8312f" />
              <p>{{ item.time }}</p>
            </div>
            <div class="info last">
              <div>
                <font-awesome-icon
                  icon="fa-map-marker-alt"
                  size="2x"
                  color="#f72197"
                />
                <p>{{ item.location }}</p>
              </div>
              <div>
                <font-awesome-icon
                  icon="fa-envelope"
                  size="2x"
                  color="#f72197"
                  class="envelope"
                  @click="toggleMessage($event)"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Upcoming Schedule -->
        <div class="session-card">
          <h1>UPCOMING</h1>
          <div
            v-for="(item, index) in upcommingSchedule"
            :key="index"
            class="upcomming-card"
          >
            <div class="card-header">
              <h1>{{ item.subject }}</h1>
              <div class="ellipsis-container">
                <font-awesome-icon
                  icon="fa-ellipsis-h"
                  size="2x"
                  color="#066678"
                  style="cursor: pointer"
                  @click="togglePopup('upcoming', index, $event)"
                />
                <transition name="fade" mode="out-in">
                  <div
                    v-if="activePopup.type === 'upcoming' && activePopup.index === index"
                    class="popup-menu"
                    @click.stop
                  >
                    <div
                      class="popup-option"
                      @click="handleOptionClick('remind', item, $event)"
                    >
                      <font-awesome-icon
                        icon="fa-bell"
                        size="1x"
                        color="#066678"
                        class="option-icon"
                      />
                      <p class="option-text">Remind</p>
                    </div>
                    <div
                      class="popup-option"
                      @click="handleOptionClick('reschedule', item, $event)"
                    >
                      <font-awesome-icon
                        icon="fa-calendar-alt"
                        size="1x"
                        color="#066678"
                        class="option-icon"
                      />
                      <p class="option-text" @click="reschedIsOpen = true">Reschedule</p>
                    </div>
                    <div
                      class="popup-option"
                      @click="handleOptionClick('cancel', item, $event)"
                    >
                      <font-awesome-icon
                        icon="fa-times"
                        size="1x"
                        color="#066678"
                        class="option-icon"
                      />
                      <p class="option-text">Cancel</p>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="info name">
              <font-awesome-icon icon="fa-user" size="2x" color="#533566" />
              <h2>{{ item.learner.name }}</h2>
            </div>
            <div class="info">
              <font-awesome-icon icon="fa-calendar-alt" size="2x" color="#0084ce" />
              <p>{{ item.date }}</p>
            </div>
            <div class="info">
              <font-awesome-icon icon="fa-clock" size="2x" color="#f8312f" />
              <p>{{ item.time }}</p>
            </div>
            <div class="info last">
              <div>
                <font-awesome-icon
                  icon="fa-map-marker-alt"
                  size="2x"
                  color="#f72197"
                />
                <p>{{ item.location }}</p>
              </div>
              <div>
                <font-awesome-icon
                  icon="fa-envelope"
                  size="2x"
                  color="#f72197"
                  class="envelope"
                  @click="toggleMessage($event)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <div v-if="isMessage" class="message-pop-up">
        <Message @close="handleMessageClose" />
      </div>
    </Transition>
  </div>

  <div v-if="reschedIsOpen" class="message-pop-up">
    <RescheduleDialog 
    :id = "selectedSessionID"
    @close="reschedIsOpen = false" 
    @reschedule="reschedule"/>
  </div>

</template>

<style scoped>
.session-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.top-element {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 17px;
  background-color: #0c434d;
  padding: 18px 30px;
  border-radius: 20px 20px 0 0;
}

.top-element h1 {
  color: #fff;
  font-size: 1.8rem;
  font-weight: 600;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.ellipsis-container {
  position: relative;
}

.popup-menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 100%;
  right: 0;
  min-width: 160px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.popup-option {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.popup-option:hover {
  background-color: #f5f5f5;
}

.option-icon {
  margin-right: 12px;
  width: 16px;
  flex-shrink: 0;
}

.option-text {
  flex-grow: 1;
  text-align: left;
  white-space: nowrap;
}

.lower-element {
  background-color: #fff;
  border: 3px solid #0c434d;
  padding: 10px 30px;
  flex: 1;
  overflow-y: auto;
  border-radius: 0 0 20px 20px;
}

.session-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  margin-top: 20px;
  height: 502.5px;
}

.session-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 0 20px 0;
}

.session-card h1 {
  color: #066678;
}

.today-card,
.upcomming-card {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  background-color: #f0f0f0;
}

.today-card:nth-of-type(4n + 1) {
  border-left: 10px solid #ff3131;
}

.today-card:nth-of-type(4n + 2) {
  border-left: 10px solid #ff66c4;
}

.today-card:nth-of-type(4n + 3) {
  border-left: 10px solid #ffe063;
}

.today-card:nth-of-type(4n) {
  border-left: 10px solid #ff914d;
}

.upcomming-card {
  border-left: 10px solid #006981;
}

.today-card div:nth-of-type(1) h1,
.upcomming-card div:nth-of-type(1) h1 {
  color: #0c434d;
  font-size: 1.3rem;
  font-weight: 600;
  text-decoration: underline;
}

.info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.info h2 {
  color: #0c434d;
  font-size: 1rem;
  font-weight: 600;
}

.info p {
  color: #0c434d;
  font-size: 0.9rem;
}

.info svg {
  width: 15px;
}

.last {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.last div:first-of-type {
  display: flex;
  align-items: center;
  gap: 10px;
}

.envelope {
  width: 25px !important;
  cursor: pointer;
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.message-pop-up {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>