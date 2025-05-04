<script setup>
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ref } from 'vue'

const selectedDate = ref(null)

// Emit the selected date when rescheduling
const emit = defineEmits(['close', 'reschedule'])

const handleReschedule = () => {
  emit('reschedule', selectedDate.value)
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
          format="YYYY-MM-DD HH:mm"
        />
      </div>

      <div class="button-container">
        <button @click="$emit('close')" class="cancel-button">Cancel</button>
        <button @click="handleReschedule" class="confirm-button" :disabled="!selectedDate">
          Reschedule
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* Optional: adjust styling if needed */
.datepicker-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
