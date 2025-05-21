<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['close', 'confirm']);

const selectedDate = ref('');
const availableTimes = ref([
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM'
]);
const selectedTime = ref('');
const sessionType = ref('in-person'); // 'online' or 'in-person'
const notes = ref('');

const confirmSchedule = () => {
  if (!selectedDate.value || !selectedTime.value) {
    alert('Please select both date and time');
    return;
  }
  
  const scheduleData = {
    date: selectedDate.value,
    time: selectedTime.value,
    type: sessionType.value,
    notes: notes.value
  };
  
  emit('confirm', scheduleData);
  emit('close');
};

// Calendar logic
const currentDate = ref(new Date());
const days = ref([]);

// Function to generate days of the current month
const generateDays = () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  days.value = [];
  
  for (let i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1)) {
    days.value.push({ date: new Date(i) });
  }
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

// Computed property for the current month display
const currentMonth = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' });
});

// Function to check if a date is today
const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// Initialize the days when the component is created
generateDays();
</script>

<template>
  <div class="booking-session max-w-4xl mx-auto rounded-tl-3xl rounded-tr-3xl overflow-hidden border-2 border-blue-900">
    <!-- Header -->
    <div class="booking-session__header">
      <div class="flex items-center space-x-3">
        <i class="fas fa-calendar-check"></i>
        <h1>Book a Session</h1>
      </div>
      <button @click="emit('close')" aria-label="Close" type="button">×</button>
    </div>
    
    <!-- Profile info -->
    <div class="booking-session__profile">
      <img
        alt="Profile image"
        src="https://storage.googleapis.com/a1aa/image/63566d83-05ec-418d-7234-c22ea7a13985.jpg"
        width="64"
        height="64"
      />
      <div>
        <p>Barry D. Allen</p>
        <p>3rd Year - Bachelor of Science in Computer Science</p>
        <p>College of Computer Studies</p>
      </div>
    </div>
    
    <!-- Main content -->
    <div class="booking-session__content">
      <!-- Left side -->
      <div class="booking-session__left">
        <div class="booking-session__time-slots-header">
          <h2>Select Time Slots</h2>
          <p>(2 hours duration)</p>
        </div>
        <div class="booking-session__time-slots">
          <button
            v-for="time in availableTimes"
            :key="time"
            @click="selectedTime = time"
            :class="{ 'bg-blue-700': selectedTime === time }"
            class="booking-session__time-slot-btn"
          >
            {{ time }}
          </button>
        </div>
        
        <h3 class="booking-session__mode-header">Select Mode of Session</h3>
        <div class="booking-session__mode-buttons">
          <button 
            type="button" 
            @click="sessionType = 'in-person'"
            :class="{
              'booking-session__mode-btn--active': sessionType === 'in-person',
              'booking-session__mode-btn--inperson': true
            }"
            class="booking-session__mode-btn"
          >
            <span aria-label="In Person"><i class="fas fa-user"></i></span>
            <span>In Person</span>
          </button>
          <button 
            type="button" 
            @click="sessionType = 'online'"
            :class="{
              'booking-session__mode-btn--active': sessionType === 'online',
              'booking-session__mode-btn--online': true
            }"
            class="booking-session__mode-btn"
          >
            <span aria-label="Online"><i class="fas fa-laptop"></i></span>
            <span>Online</span>
          </button>
        </div>
      </div>
      
      <!-- Right side -->
      <div class="booking-session__right">
        <h2 class="booking-session__date-header">Select Date</h2>
        <input 
          type="date" 
          v-model="selectedDate" 
          class="booking-session__calendar form-control"
          style="padding: 0.75rem; width: 100%;"
        >
        
        <!-- Full Calendar -->
        <div class="booking-session__calendar">
          <div class="booking-session__calendar-header">
            <div class="arrows" @click="prevMonth">&lt;</div>
            <div class="month-year">{{ currentMonth }}</div>
            <div class="arrows" @click="nextMonth">&gt;</div>
          </div>
          <div class="booking-session__calendar-weekdays">
            <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">{{ day }}</div>
          </div>
          <div class="booking-session__calendar-days">
            <div v-for="day in days" :key="day.date" :class="['day', { 'today': isToday(day.date) }]">
              {{ day.date.getDate() }}
            </div>
          </div>
        </div> 
      </div>
    </div>
    
    <!-- Footer buttons -->
    <div class="booking-session__footer">
      <button @click="emit('close')" type="button" class="booking-session__btn-cancel">CANCEL</button>
      <button @click="confirmSchedule" type="button" class="booking-session__btn-proceed">PROCEED</button>
    </div>
  </div>
</template>

<style scoped>
.booking-session {
  border-bottom-width: 4px;
  width: 900px;
}
.booking-session__header {
  background-color: #0b3b44;
  color: white;
  padding: 0.75rem 1.25rem;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.booking-session__header h1 {
  font-weight: 800;
  font-size: 1.125rem;
  user-select: none;
}
.booking-session__header button {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  user-select: none;
}
.booking-session__profile {
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: #0b3b44;
}
.booking-session__profile img {
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  border: 2px solid #0b3b44;
  object-fit: cover;
}
.booking-session__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: white;
}
@media (min-width: 768px) {
  .booking-session__content {
    flex-direction: row;
  }
}
.booking-session__left,
.booking-session__right {
  flex: 1;
}
.booking-session__time-slots-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.booking-session__time-slots-header h2 {
  font-weight: 600;
  color: #0b3b44;
  font-size: 0.875rem;
  user-select: none;
  margin: 0;
}
.booking-session__time-slots-header p {
  font-style: italic;
  font-size: 0.75rem;
  color: #9ca3af;
  user-select: none;
  margin: 0;
}
.booking-session__time-slots {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 2rem;
  max-width: 20rem;
}
.booking-session__time-slot-btn {
  background-color: #0b3b44;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  user-select: none;
  border: none;
  cursor: pointer;
}
.booking-session__time-slot-btn:hover {
  background-color: #0a2e34;
}
.booking-session__mode-header {
  font-weight: 600;
  color: #0b3b44;
  font-size: 0.875rem;
  margin: 2rem 0 0.75rem 0;
  user-select: none;
}
.booking-session__mode-buttons {
  display: flex;
  gap: 1.5rem;
}
.booking-session__mode-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
  border: none;
}
.booking-session__mode-btn--active {
  background-color: #d1d5db;
}
.booking-session__mode-btn--inperson {
  background-color: #d1d5db;
  color: #0b3b44;
}
.booking-session__mode-btn--inperson span:first-child {
  background-color: #0b3b44;
  color: white;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.booking-session__mode-btn--online {
  background-color: #e5e7eb;
  color: #6b7280;
}
.booking-session__mode-btn--online span:first-child {
  background-color: #d1d5db;
  color: #6b7280;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.booking-session__right {
  max-width: 22rem;
}
.booking-session__date-header {
  font-weight: 600;
  color: #0b3b44;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  user-select: none;
}
.booking-session__calendar {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
  padding: 0.75rem;
  font-family: Arial, sans-serif;
  font-size: 0.75rem;
  color: #4b5563;
}
.booking-session__calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.8125rem;
  color: #9ca3af;
}
.booking-session__calendar-header .month-year {
  font-weight: 700;
  color: #000000;
  font-size: 0.8125rem;
}
.booking-session__calendar-header .arrows {
  display: flex;
  gap: 0.25rem;
  color: #4b5563;
  cursor: pointer;
  user-select: none;
}
.booking-session__calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem;
  text-align: center;
  font-size: 0.625rem;
  font-weight: 400;
  color: #9ca3af;
  margin-bottom: 0.25rem;
}
.booking-session__calendar-days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.25rem;
  text-align: center;
  font-size: 0.6875rem;
  font-weight: 400;
  color: #9ca3af;
}
.booking-session__calendar-days .day {
  color: #000000;
  font-weight: 600;
}
.booking-session__calendar-days .day.today {
  background-color: #349eb1;
  color: white;
}
.booking-session__footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #d1d5db;
  background-color: white;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
}
.booking-session__btn-cancel {
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
.booking-session__btn-proceed {
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
.booking-session__btn-proceed:hover {
  background-color: #1f6d7e;
}
</style>