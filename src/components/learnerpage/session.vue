<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import Message from "./message.vue";
import RescheduleDialog from "./RescheduleDialog.vue";
import axios from "axios";
import api from "@/axios.js"; // Adjust the path as necessary
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

const props = defineProps({
  schedule: {
    type: Array,
    required: false,
  },
  upcomingSchedule: {
    type: Array,
    required: false,
  },
  mentFiles: {
    type: Array,
    default: () => ({
      message: "",
      files: [],
    }),
  },
});

const showCancelConfirmation = ref(false);
const selectedItem = ref(null);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const cancelSession = async (item) => {
  try {
    const response = await api.post("/api/send/session/cancel/" + item.id, {
      withCredentials: true,
      header: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    });
    console.log(response.data);
    todaySchedule.value = todaySchedule.value.filter(
      (session) => session.id !== item.id
    );
    upcommingSchedule.value = upcommingSchedule.value.filter(
      (session) => session.id !== item.id
    );
  } catch (error) {
    console.error("Error cancelling session:", error);
  } finally {
    showCancelConfirmation.value = false;
  }
};

const isMessage = ref(false);
const isFileModalOpen = ref(false);
const currentFiles = ref([]);
const activePopup = ref({
  type: null,
  index: null,
});
const todaySchedule = ref([]);
const upcommingSchedule = ref([]);
const selectedSessionID = ref(null);
const selectedMentorId = ref(null);
const reschedIsOpen = ref(false);

const filteredFiles = computed(() => {
  if (!selectedMentorId.value || !props.mentFiles?.files) {
    console.log("No mentor selected or no files available");
    return [];
  }

  console.log("Selected Mentor ID:", selectedMentorId.value);
  console.log("Available files:", props.mentFiles.files);

  const filtered = props.mentFiles.files.filter((file) => {
    const isMatch = String(file.owner_id) === String(selectedMentorId.value);
    console.log(
      `Comparing file owner ${file.owner_id} with mentor ${selectedMentorId.value}: ${isMatch}`
    );
    return isMatch;
  });

  console.log("Filtered files:", filtered);
  return filtered.map((file) => ({
    id: file.id,
    name: file.file_name,
    fileId: file.file_id,
  }));
});

const openFileModal = (files, event, mentorId) => {
  event.stopPropagation();
  console.log("Opening modal for mentor:", mentorId);
  selectedMentorId.value = mentorId;
  console.log("filteredFiles:", filteredFiles.value);
  isFileModalOpen.value = true;
};

const closeFileModal = () => {
  isFileModalOpen.value = false;
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
    case "reschedule":
      selectedSessionID.value = item.id;
      reschedIsOpen.value = true;
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

onMounted(() => {
  document.addEventListener("click", closePopups);
  todaySchedule.value = props.schedule;
  upcommingSchedule.value = props.upcomingSchedule;
});

onUnmounted(() => {
  document.removeEventListener("click", closePopups);
});

const previewFile = (fileId) => {
  const response = api
    .get("/api/preview/file/" + fileId, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    })
    .then((response) => {
      console.log("File URL:", response.data.url);
      window.open(response.data.webViewLink, "_blank");
    })
    .catch((error) => {
      console.error("Error fetching file URL:", error);
    });
};

const downloadFile = async (fileId, fileName) => {
  api
    .get("/api/download/file/" + fileId, {
      responseType: "blob",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    })
    .then((response) => {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      console.log("File downloaded successfully.");
    })
    .catch((error) => {
      console.error("Error downloading file:", error);
    });
};
</script>

<template>
  <div class="session-wrapper">
    <div class="table-header">
      <h2 class="table-title">
        <i class="fas fa-calendar header-icon"></i>
        Session Schedule
      </h2>
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
                    v-if="
                      activePopup.type === 'today' &&
                      activePopup.index === index
                    "
                    class="popup-menu"
                    @click.stop
                  >
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
                      <p class="option-text">Reschedule</p>
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
              <h2>{{ item.mentor.user.name }}</h2>
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
              <div class="location-container">
                <font-awesome-icon
                  icon="fa-map-marker-alt"
                  size="2x"
                  color="#f72197"
                />
                <p class="location-text">{{ item.location }}</p>
              </div>
              <div class="action-icons">
                <font-awesome-icon
                  icon="fa-file-alt"
                  size="2x"
                  color="#f72197"
                  class="file-icon"
                  @click="
                    openFileModal(item.files, $event, item.mentor.ment_inf_id)
                  "
                />
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
                      @click="handleOptionClick('reschedule', item, $event)"
                    >
                      <font-awesome-icon
                        icon="fa-calendar-alt"
                        size="1x"
                        color="#066678"
                        class="option-icon"
                      />
                      <p class="option-text">Reschedule</p>
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
              <h2>{{ item.mentor.user.name }}</h2>
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
              <div class="location-container">
                <font-awesome-icon
                  icon="fa-map-marker-alt"
                  size="2x"
                  color="#f72197"
                />
                <p class="location-text">{{ item.location }}</p>
              </div>
              <div class="action-icons">
                <font-awesome-icon
                  icon="fa-file-alt"
                  size="2x"
                  color="#f72197"
                  class="file-icon"
                  @click="
                    openFileModal(item.files, $event, item.mentor.ment_inf_id)
                  "
                />
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

    <Transition name="fade" mode="out-in">
      <div v-if="isFileModalOpen" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Mentor's Files</h3>
            <button @click="closeFileModal" class="close-button">
              <font-awesome-icon icon="fa-times" />
            </button>
          </div>
          <div class="modal-body">
            <div v-if="filteredFiles.length === 0" class="no-files">
              <p>No files available from this mentor</p>
            </div>
            <div v-for="file in filteredFiles" :key="file.id" class="file-item">
              <font-awesome-icon icon="file" class="file-icon" />
              <span class="file-name">{{ file.name }}</span>
              <div class="file-actions">
                <button
                  class="modal-button preview"
                  @click="previewFile(file.fileId)"
                  title="Preview"
                >
                  <font-awesome-icon icon="eye" />
                </button>
                <button
                  class="modal-button download"
                  @click="downloadFile(file.fileId, file.name)"
                  title="Download"
                >
                  <font-awesome-icon icon="download" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade" mode="out-in">
      <div v-if="showCancelConfirmation" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Cancel Session</h3>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to cancel
              <strong>{{ selectedItem?.subject }}</strong> with
              <strong>{{ selectedItem?.mentor.user.name }}</strong
              >?
            </p>
            <p class="warning-text">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button
              class="modal-button cancel"
              @click="showCancelConfirmation = false"
            >
              No, Keep It
            </button>
            <button
              class="modal-button confirm danger"
              @click="cancelSession(selectedItem)"
            >
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
  margin-top: 2rem;
  margin-left: 2.5rem;
  text-align: center;
  padding: 0.5rem;
  max-height: 36.4rem;
  overflow-y: scroll;
}

.table-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  padding-bottom: 2rem;
  background: rgb(255, 255, 255);
  gap: 1rem;
  flex-wrap: wrap;
  color: #0b2548;
  position: sticky;
  top: 0;
  z-index: 20;
}

.table-title {
  margin: 0;
  font-size: 1.6rem;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-icon {
  font-size: 1.4rem;
}

.lower-element {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 1.5rem;
  background-color: #fff;
  overflow: hidden;
  height: 542px;
  padding: 0.8rem;
}

.session-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1.5rem;
  width: 100%;
  height: 100%;
  padding: 0 0.5rem;
}

.session-card {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 0 0.5rem 0.8rem 0.5rem;
  max-width: 100%;
}

.session-card h1 {
  color: var(--primary-dark);
  font-size: 1.2rem;
  text-align: left;
  margin-bottom: 0.3rem;
  margin-top: 1rem;
  padding-left: 0.5rem;
}

.today-card,
.upcomming-card {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.8rem;
  background-color: #e4f3f5;
  border-radius: 8px;
  margin-bottom: 0.8rem;
  transition: all 0.3s ease;
  border-left: 3px solid var(--primary);
  max-width: 100%;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  transform: translateY(0);
}

.today-card:hover,
.upcomming-card:hover {
  transform: translateY(-5px);
  box-shadow: 4px 6px 12px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.today-card:nth-of-type(4n + 1) {
  border-left: 5px solid #ff3131;
}

.today-card:nth-of-type(4n + 2) {
  border-left: 5px solid #ff66c4;
}

.today-card:nth-of-type(4n + 3) {
  border-left: 5px solid #ffe063;
}

.today-card:nth-of-type(4n) {
  border-left: 5px solid #ff914d;
}

.upcomming-card {
  border-left: 5px solid #006981;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-header h1 {
  color: var(--text-dark);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
  text-decoration: underline;
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
  min-width: 140px;
  background-color: white;
  border: 1px solid var(--border);
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.popup-option {
  padding: 0.5rem 0.8rem;
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
  margin-right: 0.6rem;
  width: 14px;
  flex-shrink: 0;
}

.option-text {
  flex-grow: 1;
  text-align: left;
  white-space: nowrap;
  color: var(--text-dark);
  font-size: 0.85rem;
}

.info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;
  margin: 0.2rem 0;
}

.info h2 {
  color: var(--text-dark);
  font-size: 0.9rem;
  font-weight: 600;
}

.info p {
  color: var(--text-dark);
  font-size: 0.85rem;
}

.info svg {
  width: 14px;
}

.last {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 0.5rem;
  gap: 0.5rem;
}

.last > div:first-child {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.last > div:first-child p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.85rem;
  margin: 0;
}

.last > div:last-child {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  width: 40px;
}

.location-container {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  min-width: 0;
}

.location-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.85rem;
}

.action-icons {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  flex-shrink: 0;
}

.envelope {
  width: 25px !important;
  height: 25px !important;
  cursor: pointer;
  transition: transform 0.2s;
  flex-shrink: 0;
  color: rgb(51, 76, 103);
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
  max-width: 480px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border: 2px solid #e0e0e0;
  transform: translateX(170px);
  height: 35rem;
  overflow-y: auto;
  max-height: calc(70vh - 60px);
  padding: 0;
}

.modal-content.files-modal {
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.modal-content.files-modal .modal-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--primary);
}

.modal-content.files-modal .modal-body {
  overflow-y: auto;
  max-height: calc(70vh - 60px);
  padding: 0;
}

.modal-content.files-modal .file-item {
  padding: 0.75rem 1.5rem;
}

.modal-content.files-modal .file-icon {
  font-size: 1rem;
}

.modal-content.files-modal .file-name {
  font-size: 0.9rem;
  padding-right: 0.5rem;
}

.modal-content.files-modal .file-actions {
  gap: 0.5rem;
}

.modal-content.files-modal .file-actions .modal-button {
  padding: 0.35rem 0.5rem;
  min-width: auto;
}

.modal-content.files-modal .file-actions .modal-button svg {
  font-size: 0.8rem;
}

.modal-content.files-modal .no-files {
  font-size: 0.9rem;
}

.modal-header {
  padding: 1.2rem 1.5rem;
  background-color: var(--primary);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  color: rgb(36, 56, 92);
}

.close-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: rgb(30, 50, 73);
  font-size: 1.2rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 1.5rem;
  text-align: center;
  background-color: #fff;
}

.modal-body p {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
}

.warning-text {
  color: var(--danger);
  font-weight: bold;
  font-size: 1rem;
  background-color: rgba(244, 67, 54, 0.1);
  padding: 8px;
  border-radius: 4px;
  display: inline-block;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  background-color: #f5f5f5;
  border-top: 2px solid #e0e0e0;
  gap: 12px;
}

.modal-button {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  border: 2px solid transparent;
}

.modal-button.cancel {
  background-color: #f5f5f5;
  color: #555;
  border-color: #ccc;
}

.modal-button.cancel:hover {
  background-color: #e0e0e0;
}

.modal-button.confirm {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary-dark);
}

.modal-button.confirm:hover {
  background-color: var(--primary-dark);
}

.modal-button.confirm.danger {
  background-color: red;
}

.modal-button.confirm.danger:hover {
  background-color: #f55050;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  transition: all 0.2s;
  background-color: #fff;
}

.file-item:hover {
  background-color: #f5f5f5;
}

.file-icon {
  margin-right: 1rem;
  color: rgb(52, 72, 99);
  font-size: 2.5rem;
}

.file-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  color: #2b3544;
  font-size: 1rem;
  font-weight: 500;
}

.file-actions {
  display: flex;
  gap: 0.8rem;
}

.no-files {
  padding: 1.5rem;
  color: #304453;
  font-size: 1rem;
  background-color: #fafafa;
  border-radius: 4px;
  margin: 1rem;
}

.file-actions .modal-button.preview {
  background-color: #2196f3;
  color: white;
}

.file-actions .modal-button.preview:hover {
  background-color: #0d8bf2;
}

.file-actions .modal-button.download {
  background-color: #4caf50;
  color: white;
}

.file-actions .modal-button.download:hover {
  background-color: #3e8e41;
}

.file-actions .modal-button.preview:hover .fa-eye {
  animation: pulse 0.5s ease;
}

.file-actions .modal-button.download:hover .fa-download {
  animation: bounce 0.5s ease;
}

@media (max-width: 1024px) {
  .session-grid {
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  .lower-element {
    height: auto;
    padding: 0.5rem;
  }

  .session-card {
    padding: 0 0.3rem 0.5rem 0.3rem;
  }
}

@media (max-width: 768px) {
  .session-wrapper {
    width: 95%;
    margin: 1rem auto;
    padding: 0.3rem;
  }

  .table-header {
    padding: 1rem;
  }

  .table-title {
    font-size: 1.1rem;
  }

  .modal-content {
    width: 95%;
    max-width: 400px;
  }

  .today-card,
  .upcomming-card {
    padding: 0.7rem 0.9rem;
  }

  .card-header h1 {
    font-size: 0.9rem;
  }

  .info h2 {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .modal-footer {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-button {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }

  .session-card h1 {
    font-size: 1rem;
  }

  .info p {
    font-size: 0.8rem;
  }

  .action-icons {
    gap: 0.6rem;
  }

  .envelope,
  .file-icon {
    width: 16px !important;
  }
}
</style>
