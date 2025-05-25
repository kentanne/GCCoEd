<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import api from "@/axios.js";

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

const baseURL = api.defaults.baseURL;

const props = defineProps({
  info: {
    type: Array,
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
const selectedSubject = ref("");
const showConfirmationModal = ref(false); // Add this for modal control

// Calendar variables
const currentDate = ref(new Date());
const days = ref([]);
const showYearSelection = ref(false);

const prepareSchedule = () => {
  if (!selectedDate.value || !selectedTime.value || !selectedSubject.value) {
    alert("Please select date, time and subject");
    return;
  }
  showConfirmationModal.value = true;
};

const confirmSchedule = async () => {
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

  // Create the JSON structure with subject included
  const scheduleData = {
    participant_id: mentorNo,
    date: formattedDate,
    time: formattedTime,
    location:
      sessionType.value === "in-person" ? meetingLocation.value : "online",
    subject: selectedSubject.value,
  };

  try {
    const response = await api.post(
      "/api/learner/scheduleCreate",
      scheduleData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      }
    );

    console.log("Selected Subject:", selectedSubject.value);
    console.log("Schedule Data:", scheduleData);

    emit("confirm", scheduleData);
    emit("close");
  } catch (error) {
    console.error("Error in schedule confirmation:", error);
  } finally {
    showConfirmationModal.value = false;
  }
};

// Generate years for selection (±5 years from current)
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
});

// Format date as YYYY-MM-DD for the input
const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Add these computed properties and helpers
const availableDays = computed(() => {
  try {
    return JSON.parse(mentorAvailability || "[]").map((day) =>
      day.toLowerCase()
    );
  } catch (e) {
    console.error("Error parsing available days:", e);
    return [];
  }
});

const isDateAvailable = (date) => {
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

// Update the navigation functions
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

const goToToday = () => {
  currentDate.value = new Date();
  selectedDate.value = formatDateForInput(currentDate.value);
  generateDays();
};

const selectYear = (year) => {
  const newDate = new Date(currentDate.value);
  newDate.setFullYear(year);
  currentDate.value = newDate;
  showYearSelection.value = false;
  generateDays();
};

const currentMonthYear = computed(() => {
  return new Date(currentDate.value).toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });
});

// Initialize the calendar
onMounted(() => {
  selectedDate.value = formatDateForInput(new Date());
  generateDays();
});

// First, update the destructuring to match the order from viewUser.vue
const [
  mentorNo,
  mentorName,
  mentorYear,
  mentorCourse,
  mentorSessionDur,
  mentorModality,
  mentorTeachStyle,
  mentorAvailability,
  mentorLearnModality,
  mentorProfilePic,
  mentorSubjects,
] = props.info || [];

// Parse subjects from mentorTeachStyle string
const subjectOptions = computed(() => {
  try {
    return JSON.parse(mentorSubjects || "[]");
  } catch (e) {
    console.error("Error parsing subjects:", e);
    return [];
  }
});

// Add this helper function before generateDays
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};
</script>

<template>
  <div class="booking">
    <!-- Header -->
    <div class="header">
      <div class="flex items-center space-x-3">
        <h1>Book a Session</h1>
      </div>
      <button @click="emit('close')" aria-label="Close" type="button">×</button>
    </div>

    <!-- Profile info -->
    <div class="profile">
      <img
        alt="Profile image"
        :src="
          mentorProfilePic
            ? `${baseURL}/api/image/` + mentorProfilePic
            : 'https://placehold.co/400x400'
        "
        width="64"
        height="64"
      />
      <div>
        <p>
          <strong>{{ mentorName }}</strong>
        </p>
        <p>{{ mentorYear }} - {{ mentorCourse }}</p>
        <p>College of Computer Studies</p>
      </div>
    </div>

    <!-- Main content -->
    <div class="content">
      <!-- Left side -->
      <div class="left">
        <div class="time-header">
          <h2>Select Time Slots</h2>
          <p>({{ mentorSessionDur }} duration)</p>
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
            :disabled="!mentorModality?.toLowerCase().includes('in-person')"
            class="mode-btn"
          >
            <span aria-label="In Person"><i class="fas fa-user"></i></span>
            <span>In Person</span>
          </button>
          <button
            type="button"
            @click="sessionType = 'online'"
            :class="{ 'mode-active': sessionType === 'online' }"
            :disabled="!mentorModality?.toLowerCase().includes('online')"
            class="mode-btn"
          >
            <span aria-label="Online"><i class="fas fa-laptop"></i></span>
            <span>Online</span>
          </button>
        </div>

        <div v-if="sessionType === 'in-person'" class="location-input">
          <input
            type="text"
            v-model="meetingLocation"
            placeholder="Enter meeting location"
            class="location-field"
          />
        </div>
      </div>

      <!-- Right side - Calendar -->
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

        <div class="subject-select">
          <h3 class="subject-header">Select Subject</h3>
          <select v-model="selectedSubject" class="subject-dropdown" required>
            <option value="" disabled selected>Choose a subject</option>
            <option
              v-for="subject in subjectOptions"
              :key="subject"
              :value="subject"
              class="subject option"
            >
              {{ subject }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Footer buttons -->
    <div class="footer">
      <button @click="emit('close')" type="button" class="btn-cancel">
        CANCEL
      </button>
      <button @click="prepareSchedule" type="button" class="btn-proceed">
        PROCEED
      </button>
    </div>
  </div>
</template>

<style scoped>
.booking {
  border-bottom-width: 4px;
  width: 1000px;
  max-width: 1000px;
  margin-left: 10rem;
  margin-right: -10rem;
  top: 3rem;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background-color: #0b3b44;
  color: white;
  padding: 0.75rem 1.25rem;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
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
}
.profile {
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: #0b3b44;
}
.profile img {
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  border: 2px solid #0b3b44;
  object-fit: cover;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.5rem;
  background-color: white;
  overflow-y: auto; /* Make content scrollable */
  flex-grow: 1; /* Take up remaining space */
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
  color: #9ca3af;
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
  background-color: #e5e7eb;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  user-select: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.time-selected {
  background-color: #0b3b44;
  color: white;
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
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
  border: 1px solid #d1d5db;
  background-color: white;
  transition: all 0.2s;
}
.mode-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f3f4f6;
}

.mode-btn:disabled:hover {
  background-color: #f3f4f6;
}
.mode-btn:hover {
  background-color: #f3f4f6;
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
  width: 70%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}
.right {
  max-width: 22rem;
}
.calendar {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
  padding: 0.75rem;
  font-family: Arial, sans-serif;
  font-size: 0.75rem;
  color: #4b5563;
  width: 100%;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
  color: #9ca3af;
}
.month-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.calendar-header .month {
  font-weight: 700;
  color: #000000;
  font-size: 0.8125rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}
.calendar-header .month:hover {
  background-color: #f0f0f0;
}
.calendar-header .today-btn {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: none;
  border: 1px solid #d1d5db;
  cursor: pointer;
}
.calendar-header .today-btn:hover {
  background-color: #f0f0f0;
}
.calendar-header .arrow {
  display: flex;
  gap: 0.25rem;
  color: #4b5563;
  cursor: pointer;
  user-select: none;
  background: none;
  border: none;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}
.calendar-header .arrow:hover {
  background-color: #f0f0f0;
}
.year-select {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f9f9f9;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
}
.year-option {
  padding: 0.25rem;
  text-align: center;
  cursor: pointer;
  border-radius: 0.25rem;
}
.year-option:hover {
  background-color: #e5e7eb;
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
  background-color: #e5e7eb;
}
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem;
  text-align: center;
  font-size: 0.625rem;
  font-weight: 400;
  color: #9ca3af;
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
  background-color: #f0f0f0;
}
.day.current {
  color: #000000;
  font-weight: 600;
}
.day.other {
  color: #9ca3af;
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
  color: #000000;
  cursor: pointer;
}
.day.unavailable {
  color: #d1d5db;
  cursor: not-allowed;
  background-color: #f3f4f6;
}
.day.unavailable:hover {
  background-color: #f3f4f6;
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
  border-top: 1px solid #d1d5db;
  background-color: white;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  position: sticky;
  bottom: 0;
  z-index: 10;
}
.btn-cancel {
  color: #e11d1d;
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid #e11d1d;
  border-radius: 0.375rem;
  padding: 0.25rem 1.25rem;
  cursor: pointer;
  user-select: none;
  background: none;
}
.btn-proceed {
  background-color: #2b8a9e;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  padding: 0.25rem 1.25rem;
  cursor: pointer;
  user-select: none;
  border: none;
}
.btn-proceed:hover {
  background-color: #1f6d7e;
}
.subject-select {
  margin-top: 1.5rem;
  width: 100%;
  position: relative;
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
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  color: #4b5563;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230b3b44' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  transition: all 0.2s ease;
}

/* Allow options to wrap text */
.subject-dropdown option {
  white-space: normal;
  word-wrap: break-word;
  padding: 8px 12px;
}

/* Firefox specific styling */
@-moz-document url-prefix() {
  .subject-dropdown {
    text-indent: 0.01px;
    text-overflow: "";
  }
  .subject-dropdown option {
    padding-left: 1rem;
  }
}

/* IE10+ specific fix */
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .subject-dropdown {
    padding-right: 0;
  }
  .subject-dropdown::-ms-expand {
    display: none;
  }
  .subject-dropdown:focus::-ms-value {
    background: transparent;
    color: #4b5563;
  }
}

.subject-dropdown:hover {
  border-color: #9ca3af;
}

.subject-dropdown:focus {
  outline: none;
  border-color: #0b3b44;
  box-shadow: 0 0 0 2px rgba(11, 59, 68, 0.1);
}

.subject-dropdown option:disabled {
  color: #9ca3af;
}

.subject-dropdown option:checked {
  background-color: #f0f7f9;
  color: #0b3b44;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: -1.7rem;
  left: 10rem;
  right: -10rem;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  height: 109%;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  color: #0b3b44;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  text-align: center;
}

.modal-details {
  margin-bottom: 2rem;
}

.modal-details p {
  margin: 0.75rem 0;
  font-size: 1rem;
}

.modal-details strong {
  color: #0b3b44;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-btn-cancel {
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;
}

.modal-btn-confirm {
  background-color: #0b3b44;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;
}

.modal-btn-confirm:hover {
  background-color: #1f6d7e;
}
</style>
