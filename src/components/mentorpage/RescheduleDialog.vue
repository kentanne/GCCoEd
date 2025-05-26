<script setup>
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ref } from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const selectedDate = ref(null)

// Emit the selected date when rescheduling
const emit = defineEmits(['close', 'reschedule'])

const handleReschedule = () => {
  emit('reschedule', selectedDate.value)
}

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

const rescheduleSession = async () => {
  try {
    if (!selectedDate.value) {
      console.error('No date selected')
      return
    }

    // Extract date and time
    const date = new Date(selectedDate.value)
    const formattedDate = date.toLocaleDateString('en-US') // Format: MM/DD/YYYY
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) // Format: HH:mm

    const response = await axios.patch("http://localhost:8000/api/resched/" + props.id,
      {
        date: formattedDate,
        time: formattedTime,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
        },
      })
      .then((response) => {
        console.log('Reschedule response:', response.data)
      })
    // return response.data
  } catch (error) {
    console.error('Error rescheduling session:', error)
  }
}
</script>

<template>
  <div class="wrapper">
    <div class="upper-element">
      <font-awesome-icon icon="fa-solid fa-xmark" @click="$emit('close')" class="close-icon" />
      <h1>Reschedule Session</h1>
    </div>

    <div class="lower-element">
      <p>Are you sure you want to reschedule this session?</p>

      <div class="datepicker-wrapper" style="margin: 1rem 0;">
        <label for="reschedule-datetime">Pick new date & time:</label>
        <Datepicker
          id="reschedule-datetime"
          v-model="selectedDate"
          :enable-time-picker="true"
          :min-date="new Date()"
          :is-24="true"
          format="yyyy-MM-dd HH:mm"
        />
      </div>

      <div class="button-container">
        <button @click="$emit('close')" class="cancel-button">Cancel</button>
        <button @click="rescheduleSession" class="confirm-button" :disabled="!selectedDate">
          Reschedule
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: fixed;
  top: 50%;
  left: -4rem;
  transform: translateY(-50%);
  background: white;
  border-radius: 12px;
  width: 450px;
  padding: 0;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid #eaeaea;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  z-index: 1000;
}

.dp__menu {
  z-index: 1001 !important;
  position: fixed;
  transform: translateY(5px);
}

.upper-element {
  padding: 24px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
}

.upper-element h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 auto;
}

.close-icon {
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
}

.close-icon:hover {
  color: #333;
}

.lower-element {
  padding: 24px;
}

.lower-element p {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 24px;
  line-height: 1.5;
}

.datepicker-wrapper {
  margin: 24px 0;
  position: relative;
}

.datepicker-wrapper label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.button-container button {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cancel-button {
  background: transparent;
  color: #666;
}

.cancel-button:hover {
  background: #f7f7f7;
}

.confirm-button {
  background: #2c3e50;
  color: white;
}

.confirm-button:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
}

.confirm-button:not(:disabled):hover {
  background: #1a2634;
}

.dp__input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.dp__input:hover {
  border-color: #ccc;
}

.dp__input:focus {
  border-color: #2c3e50;
  outline: none;
  box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.1);
}
</style>

