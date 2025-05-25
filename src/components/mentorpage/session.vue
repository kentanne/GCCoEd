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

// Add these new refs for confirmation modals
const showRemindConfirmation = ref(false);
const showCancelConfirmation = ref(false);
const selectedItem = ref(null);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const sendReminder = async (item) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/send/session/reminder/" + item.id,
      {
        withCredentials: true,
        header: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      }
    );
    console.log(response.data);
    // Show success message or notification
  } catch (error) {
    console.error("Error sending reminder:", error);
  } finally {
    showRemindConfirmation.value = false;
  }
};

const cancelSession = async (item) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/send/session/cancel/" + item.id,
      {
        withCredentials: true,
        header: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      }
    );
    console.log(response.data);
    todaySchedule.value = todaySchedule.value.filter(
      (session) => session.id !== item.id
    );
    upcommingSchedule.value = upcommingSchedule.value.filter(
      (session) => session.id !== item.id
    );
    // Show success message or notification
  } catch (error) {
    console.error("Error cancelling session:", error);
  } finally {
    showCancelConfirmation.value = false;
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
  selectedItem.value = item;
  
  switch (option) {
    case "remind":
      showRemindConfirmation.value = true;
      break;
    case "reschedule":
      selectedSessionID.value = item.id;
      break;
    case "cancel":
      showCancelConfirmation.value = true;
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
  document.addEventListener("click", closePopups);
  todaySchedule.value = props.schedule;
  upcommingSchedule.value = props.upcomingSchedule;
});

onUnmounted(() => {
  document.removeEventListener("click", closePopups);
});
</script>

<template>
  <div class="session-wrapper">
    <!-- Header Section - Updated Design -->
    <div class="table-header">
      <h2 class="table-title">
        <i class="fas fa-calendar header-icon"></i>
        Session Schedule
      </h2>
    </div>
    
    <!-- Main Content Section - Updated Design -->
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
                    v-if="
                      activePopup.type === 'today' &&
                      activePopup.index === index
                    "
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
                      <p class="option-text" @click="reschedIsOpen = true">
                        Reschedule
                      </p>
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
              <h2>{{ item.learner.user.name }}</h2>
            </div>
            <div class="info">
              <font-awesome-icon
                icon="fa-calendar-alt"
                size="2x"
                color="#0084ce"
              />
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
                    v-if="
                      activePopup.type === 'upcoming' &&
                      activePopup.index === index
                    "
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
                      <p class="option-text" @click="reschedIsOpen = true">
                        Reschedule
                      </p>
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
              <h2>{{ item.learner.user.name }}</h2>
            </div>
            <div class="info">
              <font-awesome-icon
                icon="fa-calendar-alt"
                size="2x"
                color="#0084ce"
              />
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

    <!-- Remind Confirmation Modal -->
    <Transition name="fade" mode="out-in">
      <div v-if="showRemindConfirmation" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Send Reminder</h3>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to send a reminder for <strong>{{ selectedItem?.subject }}</strong> to <strong>{{ selectedItem?.learner.user.name }}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button class="modal-button cancel" @click="showRemindConfirmation = false">
              Cancel
            </button>
            <button class="modal-button confirm" @click="sendReminder(selectedItem)">
              Send Reminder
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Cancel Confirmation Modal -->
    <Transition name="fade" mode="out-in">
      <div v-if="showCancelConfirmation" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Cancel Session</h3>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to cancel <strong>{{ selectedItem?.subject }}</strong> with <strong>{{ selectedItem?.learner.user.name }}</strong>?</p>
            <p class="warning-text">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button class="modal-button cancel" @click="showCancelConfirmation = false">
              No, Keep It
            </button>
            <button class="modal-button confirm danger" @click="cancelSession(selectedItem)">
              Yes, Cancel Session
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="reschedIsOpen" class="message-pop-up">
      <RescheduleDialog
        :id="selectedSessionID"
        @close="reschedIsOpen = false"
        @reschedule="reschedule"
      />
    </div>
  </div>
</template>

<style scoped>
/* Base Styles */
:root {
  --primary: #3b9aa9;
  --primary-light: #6dd1e3;
  --primary-dark: #0b3e8a;
  --secondary: #ffc107;
  --danger: #f44336;
  --success: #4caf50;
  --warning: #ffa000;
  --text-dark: #0b2548;
  --text-light: #f5f7fa;
  --bg-light: #ffffff;
  --border: #e1e4e8;
}

.session-wrapper {
  background: var(--bg-light);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(26, 79, 159, 0.5);
  overflow: hidden;
  width: 90%;
  margin: 2rem auto;
  text-align: center;
}

/* Header Styles */
.table-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  gap: 1rem;
  flex-wrap: wrap;
  color: #0b2548;
}

.table-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  font-size: 1.2rem;
}

/* Main Content Styles */
.lower-element {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: #fff;
  overflow: hidden;
  height: 542px;
  padding: 1rem;
}

.session-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 50px;
  width: 100%;
  height: 100%;
}

.session-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 0 20px 0;
}

.session-card h1 {
  color: var(--primary-dark);
  font-size: 1.2rem;
  text-align: left;
  margin-bottom: 0.5rem;
}

.today-card,
.upcomming-card {
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 15px;
  transition: all 0.2s ease;
  border-left: 4px solid var(--primary);
}

.today-card:hover,
.upcomming-card:hover {
  background-color: rgba(59, 154, 169, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.today-card:nth-of-type(4n + 1) {
  border-left: 4px solid #ff3131;
}

.today-card:nth-of-type(4n + 2) {
  border-left: 4px solid #ff66c4;
}

.today-card:nth-of-type(4n + 3) {
  border-left: 4px solid #ffe063;
}

.today-card:nth-of-type(4n) {
  border-left: 4px solid #ff914d;
}

.upcomming-card {
  border-left: 4px solid #006981;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-header h1 {
  color: var(--text-dark);
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
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
  border: 1px solid var(--border);
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
  color: var(--text-dark);
  font-size: 0.9rem;
}

.info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin: 5px 0;
}

.info h2 {
  color: var(--text-dark);
  font-size: 1rem;
  font-weight: 600;
}

.info p {
  color: var(--text-dark);
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
  margin-top: 10px;
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
  transition: transform 0.2s;
}

.envelope:hover {
  transform: scale(1.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.message-pop-up {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  background-color: var(--primary);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.modal-body {
  padding: 20px;
  text-align: center;
}

.modal-body p {
  margin-bottom: 10px;
  color: var(--text-dark);
}

.warning-text {
  color: var(--danger);
  font-weight: bold;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-top: 1px solid var(--border);
}

.modal-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-left: 10px;
  transition: all 0.2s ease;
}

.modal-button.cancel {
  background-color: #f0f0f0;
  color: var(--text-dark);
  border: 1px solid #ddd;
}

.modal-button.cancel:hover {
  background-color: #e0e0e0;
}

.modal-button.confirm {
  background-color: var(--primary);
  color: white;
  border: 1px solid var(--primary-dark);
}

.modal-button.confirm:hover {
  background-color: var(--primary-dark);
}

.modal-button.confirm.danger {
  background-color: var(--danger);
  border-color: #c62828;
}

.modal-button.confirm.danger:hover {
  background-color: #c62828;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .session-grid {
    grid-template-columns: 1fr;
    grid-gap: 20px;
  }
  
  .lower-element {
    height: auto;
  }
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .modal-content {
    width: 95%;
  }
}

@media (max-width: 480px) {
  .session-wrapper {
    width: 95%;
  }
  
  .card-header h1 {
    font-size: 1rem;
  }

  .modal-footer {
    flex-direction: column;
    gap: 10px;
  }

  .modal-button {
    margin-left: 0;
    width: 100%;
  }
}
</style>