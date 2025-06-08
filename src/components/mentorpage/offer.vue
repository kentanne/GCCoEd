<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";
import api from "@/axios.js"; // Adjust the path as necessary
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

const baseURL = api.defaults.baseURL;

const props = defineProps({
  info: {
    type: Array,
    required: true,
  },
  mentorId: {
    type: Number,
    required: true,
  },
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const emit = defineEmits(["close", "confirm"]);

// First, update the destructuring to match the order from viewUser.vue
const [
  learnerId, // userId
  learnerNo, // userId
  learnerName, // userName
  learnerYear, // userYear
  learnerCourse, // userCourse
  learnerDur, // sessionDur
  learnerModality, // modality
  learnerStyle, // learnStyle
  learnerAvail, // availability
  learnerMode, // modality again
  learnerPic, // profilePic
  learnerSubjects, // subjects
] = props.info || [];

// Parse subjects
const subjectOptions = computed(() => {
  try {
    return JSON.parse(learnerSubjects || "[]");
  } catch (e) {
    return [];
  }
});

const selectedDate = ref("");
const availableTimes = ref([
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
]);
const selectedTime = ref("");
const sessionType = ref("in-person");
const notes = ref("");
const meetingLocation = ref("");
const selectedSubject = ref(""); // Add this with other refs
const isSubmitting = ref(false);
const isButtonActive = ref(false);

// Calendar variables
const currentDate = ref(new Date());
const days = ref([]);
const showYearSelection = ref(false);

const confirmSchedule = async () => {
  if (!selectedDate.value || !selectedTime.value || !selectedSubject.value) {
    alert("Please select date, time and subject");
    return;
  }

  if (isInPersonModality.value && !meetingLocation.value) {
    alert("Please enter a meeting location for in-person session");
    return;
  }

  // Format date to match required format MM/DD/YYYY
  const formattedDate = new Date(selectedDate.value).toLocaleDateString(
    "en-US",
    {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }
  );

  // Extract hour and format time HH:MM
  const timeMatch = selectedTime.value.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hours = parseInt(timeMatch[1]);
  const minutes = timeMatch[2];
  const period = timeMatch[3].toUpperCase();

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const formattedTime = `${String(hours).padStart(2, "0")}:${minutes}`;

  // Update how modality is determined
  let selectedModality = learnerModality?.toLowerCase() || "";
  if (isHybridModality.value) {
    selectedModality = sessionType.value;
  }

  const scheduleData = {
    learner_id: learnerId,
    mentor_id: props.mentorId,
    date: formattedDate,
    time: formattedTime,
    modality: selectedModality,
    location: isInPersonModality.value ? meetingLocation.value : "online",
    subject: selectedSubject.value,
  };
  isSubmitting.value = true;
  isButtonActive.value = false;
  try {
    const response = await api
      .post("/api/mentor/send-offer", scheduleData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          createToast("Tutoring offer sent successfully!", {
            position: "bottom-right",
            type: "success",
            transition: "slide",
            timeout: 2000,
            showIcon: true,
            toastBackgroundColor: "#319cb0",
          });
          emit("confirm", scheduleData);
          emit("close");
        } else {
          createToast("Failed to send tutoring offer", {
            position: "bottom-right",
            type: "error",
            transition: "slide",
            timeout: 2000,
            showIcon: true,
          });
        }
      })
      .finally(() => {
        isSubmitting.value = false;
        isButtonActive.value = true;
      });

    // // Debug logs
  } catch (error) {
    alert(error.response?.data?.message || "Error sending tutoring offer");
  }
};

// Generate years for selection (±5 years from current)
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
});

// Add these computed properties after your existing computed properties
const isInPersonModality = computed(() => {
  const modality = learnerModality?.toLowerCase() || "";
  return modality === "in-person" || modality === "hybrid";
});

const isOnlineModality = computed(() => {
  const modality = learnerModality?.toLowerCase() || "";
  return modality === "online" || modality === "hybrid";
});

const isHybridModality = computed(() => {
  const modality = learnerModality?.toLowerCase() || "";
  return modality === "hybrid";
});

// Add this function before generateDays
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Update onMounted to include error handling and null checks
onMounted(() => {
  try {
    if (currentDate.value) {
      selectedDate.value = formatDateForInput(currentDate.value);
      generateDays();
    }

    document.body.style.overflow = "hidden";
  } catch (error) {}
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

// Format date as YYYY-MM-DD for the input
const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Add these computed properties and helpers after the existing calendar variables
const availableDays = computed(() => {
  try {
    return JSON.parse(learnerAvail || "[]").map((day) => day.toLowerCase());
  } catch (e) {
    return [];
  }
});

// Add this new function to check if a date is in the past
const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  return compareDate < today;
};

// Update the isDateAvailable function to check for past dates first
const isDateAvailable = (date) => {
  // First check if it's a past date
  if (isPastDate(date)) {
    return false;
  }

  // Then check if it's on available days
  const dayName = date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  return availableDays.value.includes(dayName);
};

// Function to generate days of the current month with padding
const generateDays = () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevMonthDays = firstDay.getDay();
  const nextMonthDays = 6 - lastDay.getDay();

  days.value = [];

  // Previous month's days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (
    let i = prevMonthLastDay - prevMonthDays + 1;
    i <= prevMonthLastDay;
    i++
  ) {
    const date = new Date(year, month - 1, i);
    days.value.push({
      date,
      isCurrentMonth: false,
      isSelected: false,
      isToday: isToday(date),
      isAvailable: isDateAvailable(date),
    });
  }

  // Current month's days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    const dateString = formatDateForInput(date);
    days.value.push({
      date,
      isCurrentMonth: true,
      isSelected: selectedDate.value === dateString,
      isToday: isToday(date),
      isAvailable: isDateAvailable(date),
    });
  }

  // Next month's days
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i);
    days.value.push({
      date,
      isCurrentMonth: false,
      isSelected: false,
      isToday: isToday(date),
      isAvailable: isDateAvailable(date),
    });
  }
};

// Function to handle date selection
const selectDate = (day) => {
  if (!day.isAvailable) return; // Prevent selecting unavailable days

  if (!day.isCurrentMonth) {
    // Change month if clicking on a day from another month
    const newDate = new Date(day.date);
    currentDate.value = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    generateDays();
  }

  selectedDate.value = formatDateForInput(day.date);
  generateDays();
};

// Keep these month navigation functions
const prevMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
  generateDays();
};

const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
  generateDays();
};

// Update the goToToday function
const goToToday = () => {
  currentDate.value = new Date();
  selectedDate.value = formatDateForInput(currentDate.value);
  generateDays();
};

// Update the selectYear function
const selectYear = (year) => {
  const newDate = new Date(currentDate.value);
  newDate.setFullYear(year);
  currentDate.value = newDate;
  showYearSelection.value = false;
  generateDays();
};

// Update the currentMonthYear computed property
const currentMonthYear = computed(() => {
  return new Date(currentDate.value).toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });
});

const setButtonActive = (active) => {
  if (!this.isSubmitting) {
    this.isButtonActive = active;
  }
};
</script>

<template>
  <!-- Remove the modal-backdrop div from your template -->

  <div class="booking">
    <!-- Header -->
    <div class="header">
      <div class="flex items-center space-x-3">
        <h1>Send Offer</h1>
      </div>
      <button @click="emit('close')" aria-label="Close" type="button">×</button>
    </div>

    <!-- Profile info -->
    <div class="profile">
      <img
        :src="
          learnerPic
            ? `${baseURL}/api/image/${learnerPic}`
            : 'https://placehold.co/400x400'
        "
        alt="Profile image"
        width="64"
        height="64"
      />
      <div>
        <p>
          <strong>{{ learnerName }}</strong>
        </p>
        <p>{{ learnerYear }} - {{ learnerCourse }}</p>
        <p>College of Computer Studies</p>
      </div>
    </div>

    <!-- Main content -->
    <div class="content">
      <!-- Left side -->
      <div class="left">
        <div class="time-header">
          <h2>Select Time Slots</h2>
          <p>({{ learnerDur }} duration)</p>
        </div>
        <div class="time-slots">
          <button
            v-for="time in availableTimes"
            :key="time"
            @click="selectedTime = time"
            :class="{ 'time-selected': selectedTime === time }"
            class="time-btn"
          >
            {{ time }}
          </button>
        </div>

        <h3 class="mode-header">Select Mode of Session</h3>
        <div class="mode-buttons">
          <button
            type="button"
            @click="sessionType = 'in-person'"
            :class="{ 'mode-active': sessionType === 'in-person' }"
            :disabled="!isInPersonModality"
            class="mode-btn"
          >
            <span aria-label="In Person"><i class="fas fa-user"></i></span>
            <span>In Person</span>
          </button>
          <button
            type="button"
            @click="sessionType = 'online'"
            :class="{ 'mode-active': sessionType === 'online' }"
            :disabled="!isOnlineModality"
            class="mode-btn"
          >
            <span aria-label="Online"><i class="fas fa-laptop"></i></span>
            <span>Online</span>
          </button>
        </div>

        <!-- Add location input when in-person is selected -->
        <div v-if="sessionType === 'in-person'" class="location-input">
          <input
            v-model="meetingLocation"
            type="text"
            placeholder="Enter meeting location"
            class="location-field"
            required
          />
        </div>
      </div>

      <!-- Right side -->
      <div class="right" style="margin-left: -20px">
        <div class="calendar">
          <div class="calendar-header">
            <button class="arrow" @click="prevMonth">&lt;</button>
            <div class="month-container">
              <button
                class="month"
                @click="showYearSelection = !showYearSelection"
              >
                {{ currentMonthYear }}
              </button>
              <button class="today-btn" @click="goToToday">Today</button>
            </div>
            <button class="arrow" @click="nextMonth">&gt;</button>
          </div>

          <!-- Year selection dropdown -->
          <div v-if="showYearSelection" class="year-select">
            <div
              v-for="year in years"
              :key="year"
              @click="selectYear(year)"
              :class="{ 'year-active': currentDate.getFullYear() === year }"
              class="year-option"
            >
              {{ year }}
            </div>
          </div>

          <!-- Available days legend -->
          <div class="calendar-legend">
            <div class="legend-item">
              <span class="legend-dot available"></span>
              <span>Available</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot unavailable"></span>
              <span>Unavailable</span>
            </div>
          </div>

          <div class="weekdays">
            <div
              v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
              :key="day"
            >
              {{ day }}
            </div>
          </div>

          <div class="days">
            <div
              v-for="(day, index) in days"
              :key="index"
              @click="day.isAvailable ? selectDate(day) : null"
              :class="[
                'day',
                {
                  today: day.isToday,
                  selected: day.isSelected,
                  current: day.isCurrentMonth,
                  other: !day.isCurrentMonth,
                  available: day.isAvailable,
                  unavailable: !day.isAvailable,
                },
              ]"
            >
              {{ day.date.getDate() }}
            </div>
          </div>
        </div>

        <!-- Subject selection -->
        <div class="subject-select">
          <h3 class="subject-header">Select Subject</h3>
          <select v-model="selectedSubject" class="subject-dropdown" required>
            <option value="" disabled selected>Choose a subject</option>
            <option
              v-for="subject in subjectOptions"
              :key="subject"
              :value="subject"
            >
              {{ subject }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <button @click="emit('close')" type="button" class="btn-cancel">
        CANCEL
      </button>
      <button @click="confirmSchedule" type="button" class="btn-proceed">
        PROCEED
      </button>
    </div>
  </div>
</template>

<style scoped>
.booking {
  border-bottom-width: 4px;
  width: 1000px;
  max-width: 900px;
  margin-left: 10rem;
  margin-right: -10rem;
  top: 1rem; /* Changed from 3rem to 1rem to move it higher */
  max-height: 85vh; /* Increased from 85vh to 90vh */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(26, 79, 159, 0.5); /* Enhanced shadow */
  position: fixed;
  z-index: 999;
  background: white;
  border-radius: 1.5rem;
}

.header {
  background: linear-gradient(135deg, #0b2b31, #2b737e);
  color: white;
  padding: 0.75rem 1.25rem;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 30;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-weight: 800;
  font-size: 1.125rem;
  user-select: none;
}

.header button {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s;
}

.header button:hover {
  transform: scale(1.1);
}

.profile {
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: #0b3b44;
  border-bottom: 1px solid #e9ecef;
}

.profile img {
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  border: 2px solid #0b3b44;
  object-fit: cover;
}

.profile div p {
  margin: 0.25rem 0;
}

.profile div p:first-child {
  font-weight: 600;
  font-size: 1.1rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.5rem;
  background-color: white;
  overflow-y: auto;
  flex-grow: 1;
  height: calc(100% - 140px); /* Adjust based on header and footer height */
}

@media (min-width: 768px) {
  .content {
    flex-direction: row;
  }
}

.left,
.right {
  flex: 1;
}

.time-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.time-header h2 {
  font-weight: 600;
  color: #0b3b44;
  font-size: 0.875rem;
  user-select: none;
  margin: 0;
}

.time-header p {
  font-style: italic;
  font-size: 0.75rem;
  color: #6c757d;
  user-select: none;
  margin: 0;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 2rem;
  max-width: 20rem;
}

.time-btn {
  background-color: #e9ecef;
  color: #495057;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  user-select: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.time-btn:hover {
  background-color: #dee2e6;
}

.time-selected {
  background-color: #0b3b44;
  color: white;
}

.time-selected:hover {
  background-color: #0a2e34;
}

.mode-header {
  font-weight: 600;
  color: #0b3b44;
  font-size: 0.875rem;
  margin: 2rem 0 0.75rem 0;
  user-select: none;
}

.mode-buttons {
  display: flex;
  gap: 1.5rem;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
  border: 1px solid #ced4da;
  background-color: white;
  transition: all 0.2s;
}

.mode-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #e9ecef;
}

.mode-btn:disabled:hover {
  background-color: #e9ecef;
}

.mode-btn:hover {
  background-color: #f1f3f5;
}

.mode-active {
  background-color: #0b3b44;
  color: white;
  border-color: #0b3b44;
}

.mode-active:hover {
  background-color: #0a2e34;
}

.location-input {
  margin-top: 1rem;
}

.location-field {
  width: 100%;
  max-width: 300px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.location-field:focus {
  outline: none;
  border-color: #0b3b44;
  box-shadow: 0 0 0 2px rgba(11, 59, 68, 0.1);
}

.right {
  max-width: 22rem;
}

.calendar {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 0.75rem;
  font-family: Arial, sans-serif;
  font-size: 0.75rem;
  color: #495057;
  width: 100%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
  color: #6c757d;
}

.month-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.calendar-header .month {
  font-weight: 700;
  color: #212529;
  font-size: 0.8125rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.calendar-header .month:hover {
  background-color: #f1f3f5;
}

.calendar-header .today-btn {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: none;
  border: 1px solid #ced4da;
  cursor: pointer;
  transition: background-color 0.2s;
}

.calendar-header .today-btn:hover {
  background-color: #f1f3f5;
}

.calendar-header .arrow {
  display: flex;
  gap: 0.25rem;
  color: #495057;
  cursor: pointer;
  user-select: none;
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.calendar-header .arrow:hover {
  background-color: #f1f3f5;
}

.year-select {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
  border: 1px solid #e9ecef;
}

.year-option {
  padding: 0.25rem;
  text-align: center;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.year-option:hover {
  background-color: #e9ecef;
}

.year-active {
  background-color: #0b3b44;
  color: white;
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 0.5rem 0;
  font-size: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.available {
  background-color: #0b3b44;
}

.legend-dot.unavailable {
  background-color: #e9ecef;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem;
  text-align: center;
  font-size: 0.625rem;
  font-weight: 400;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem;
  text-align: center;
  font-size: 0.6875rem;
  font-weight: 400;
}

.day {
  padding: 0.5rem 0;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.day:hover {
  background-color: #f1f3f5;
}

.day.current {
  color: #212529;
  font-weight: 600;
}

.day.other {
  color: #adb5bd;
  font-weight: 400;
}

.day.today {
  background-color: #349eb1;
  color: white;
}

.day.selected {
  background-color: #0b3b44;
  color: white;
}

.day.available {
  color: #212529;
  cursor: pointer;
}

.day.unavailable {
  color: #ced4da;
  cursor: not-allowed;
  background-color: #f8f9fa;
}

.day.unavailable:hover {
  background-color: #f8f9fa;
}

.day.selected.available {
  background-color: #0b3b44;
  color: white;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  background-color: white;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  position: sticky;
  bottom: 0;
  z-index: 30;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.btn-cancel {
  color: #dc3545;
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid #dc3545;
  border-radius: 0.375rem;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  user-select: none;
  background: none;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background-color: #f8f9fa;
}

.btn-proceed {
  background: linear-gradient(135deg, #0b2b31, #2b737e);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  user-select: none;
  border: none;
  transition: all 0.2s;
}

.btn-proceed:hover {
  background: linear-gradient(135deg, #2b737e, #0b2b31);
}

.subject-select {
  margin-top: 1.5rem;
  width: 100%;
}

.subject-header {
  font-weight: 600;
  color: #0b3b44;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  user-select: none;
}

.subject-dropdown {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  color: #495057;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230b3b44' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  transition: all 0.2s;
}

.subject-dropdown:focus {
  outline: none;
  border-color: #0b3b44;
  box-shadow: 0 0 0 2px rgba(11, 59, 68, 0.1);
}

.subject-dropdown option {
  white-space: normal;
  word-wrap: break-word;
  padding: 8px 12px;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .booking {
    width: 100%;
    margin: 0;
    max-height: 100vh;
    border-radius: 0;
  }
}

@media (max-width: 992px) {
  .content {
    padding: 1.5rem;
  }

  .time-slots {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .content {
    height: calc(100% - 160px); /* Adjust for mobile header/footer sizes */
  }

  .header {
    position: sticky;
    top: 0;
  }

  .footer {
    position: sticky;
    bottom: 0;
  }
}

@media (max-width: 576px) {
  .booking {
    margin-top: 0;
    top: 0;
    border-radius: 0;
    max-height: 100vh;
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
