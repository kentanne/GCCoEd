<script setup>
import { ref, computed, onMounted } from 'vue';

const emit = defineEmits(['close', 'confirm']);

const selectedDate = ref('');
const availableTimes = ref([
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM'
]);
const selectedTime = ref('');
const sessionType = ref('in-person');
const notes = ref('');
const meetingLocation = ref('');

// Calendar variables
const currentDate = ref(new Date());
const days = ref([]);
const showYearSelection = ref(false);

const confirmSchedule = () => {
  if (!selectedDate.value || !selectedTime.value) {
    alert('Please select both date and time');
    return;
  }
  
  const scheduleData = {
    date: selectedDate.value,
    time: selectedTime.value,
    type: sessionType.value,
    location: meetingLocation.value,
    notes: notes.value
  };
  
  emit('confirm', scheduleData);
  emit('close');
};

// Generate years for selection (±5 years from current)
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({length: 11}, (_, i) => currentYear - 5 + i);
});

// Format date as YYYY-MM-DD for the input
const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Function to generate days of the current month with padding
const generateDays = () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Days from previous month to show
  const prevMonthDays = firstDay.getDay();
  
  // Days from next month to show
  const nextMonthDays = 6 - lastDay.getDay();
  
  days.value = [];
  
  // Add previous month's days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
    const date = new Date(year, month - 1, i);
    days.value.push({ 
      date,
      isCurrentMonth: false,
      isSelected: false,
      isToday: isToday(date)
    });
  }
  
  // Add current month's days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    const dateString = formatDateForInput(date);
    days.value.push({ 
      date,
      isCurrentMonth: true,
      isSelected: selectedDate.value === dateString,
      isToday: isToday(date)
    });
  }
  
  // Add next month's days
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i);
    days.value.push({ 
      date,
      isCurrentMonth: false,
      isSelected: false,
      isToday: isToday(date)
    });
  }
};

// Function to handle date selection
const selectDate = (day) => {
  if (!day.isCurrentMonth) {
    // Change month if clicking on a day from another month
    const newDate = new Date(day.date);
    currentDate.value = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
    generateDays();
  }
  
  selectedDate.value = formatDateForInput(day.date);
  generateDays();
};

// Function to go to the previous month
const prevMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1);
  generateDays();
};

// Function to go to the next month
const nextMonth = () => {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1);
  generateDays();
};

// Function to go to today
const goToToday = () => {
  currentDate.value = new Date();
  selectedDate.value = formatDateForInput(currentDate.value);
  generateDays();
};

const selectYear = (year) => {
  currentDate.value.setFullYear(year);
  showYearSelection.value = false;
  generateDays();
};

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

// Function to check if a date is today
const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// Initialize the calendar
onMounted(() => {
  selectedDate.value = formatDateForInput(new Date());
  generateDays();
});
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
        src="https://storage.googleapis.com/a1aa/image/63566d83-05ec-418d-7234-c22ea7a13985.jpg"
        width="64"
        height="64"
      />
      <div>
        <p><strong>Barry D. Allen</strong></p>
        <p>3rd Year - Bachelor of Science in Computer Science</p>
        <p>College of Computer Studies</p>
      </div>
    </div>
    
    <!-- Main content -->
    <div class="content">
      <!-- Left side -->
      <div class="left">
        <div class="time-header">
          <h2>Select Time Slots</h2>
          <p>(2 hours duration)</p>
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
            class="mode-btn"
          >
            <span aria-label="In Person"><i class="fas fa-user"></i></span>
            <span>In Person</span>
          </button>
          <button 
            type="button" 
            @click="sessionType = 'online'"
            :class="{ 'mode-active': sessionType === 'online' }"
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
      <div class="right" style="margin-left: -20px;">
        <div class="calendar">
          <div class="calendar-header">
            <button class="arrow" @click="prevMonth">&lt;</button>
            <div class="month-container">
              <button class="month" @click="showYearSelection = !showYearSelection">
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
          
          <div class="weekdays">
            <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">{{ day }}</div>
          </div>
          <div class="days">
            <div 
              v-for="(day, index) in days" 
              :key="index" 
              @click="selectDate(day)"
              :class="[
                'day', 
                { 
                  'today': day.isToday,
                  'selected': day.isSelected,
                  'current': day.isCurrentMonth,
                  'other': !day.isCurrentMonth
                }
              ]"
            >
              {{ day.date.getDate() }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer buttons -->
    <div class="footer">
      <button @click="emit('close')" type="button" class="btn-cancel">CANCEL</button>
      <button @click="confirmSchedule" type="button" class="btn-proceed">PROCEED</button>
    </div>
  </div>
</template>

<style scoped>
.booking {
  border-bottom-width: 4px;
  width: 1000px;
  max-width: 1000px;
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
.footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #d1d5db;
  background-color: white;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
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
</style>