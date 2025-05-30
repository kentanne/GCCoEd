<script setup>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "vue";
import axios from "axios";
import api from "@/axios.js"; // Adjust the path as necessary
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const selectedDate = ref(null);
const isSubmitting = ref(false);
const isButtonActive = ref(false);

// Emit the selected date when rescheduling
const emit = defineEmits(["close", "reschedule"]);

const handleReschedule = () => {
  emit("reschedule", selectedDate.value);
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const rescheduleSession = async () => {
  try {
    if (!selectedDate.value) {
      return;
    }

    // Extract date and time
    const date = new Date(selectedDate.value);
    const formattedDate = date.toLocaleDateString("en-US"); // Format: MM/DD/YYYY
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); // Format: HH:mm

    isSubmitting.value = true;

    const response = await api
      .patch(
        "/api/resched/" + props.id,
        {
          date: formattedDate,
          time: formattedTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
          },
        }
      )
      .then((response) => {
        createToast("Session rescheduled successfully!", {
          position: "bottom-right",
          type: "success",
          transition: "slide",
          timeout: 2000,
          showIcon: true,
          toastBackgroundColor: "#319cb0",
        });
        isButtonActive.value = true;
      })
      .catch((error) => {
        createToast("Failed to reschedule session", {
          position: "bottom-right",
          type: "error",
          transition: "slide",
          timeout: 2000,
          showIcon: true,
        });
      })
      .finally(() => {
        isSubmitting.value = false;
      });
    // return response.data
  } catch (error) {}
};
</script>

<template>
  <div class="wrapper">
    <div class="upper-element">

      <h1>Reschedule Session</h1>
    </div>

    <div class="lower-element">
      <p>Are you sure you want to reschedule this session?</p>

      <div class="datepicker-wrapper" style="margin: 1rem 0">
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
        <button @click="rescheduleSession" class="confirm-button">
          <span v-if="isSubmitting" class="loader"></span>
          <span v-else>Reschedule</span>
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
  position: relative;
}

.confirm-button:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
}

.confirm-button:not(:disabled):hover {
  background: #1a2634;
}

.loader {
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  border-top: 2px solid #fff;
  width: 16px;
  height: 16px;
  animation: spin 0.6s linear infinite;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* Loading spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Button states */
.your-button-class {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  min-height: 40px; /* Prevents height changes */
}

.your-button-class:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.your-button-class:active,
.your-button-class.active {
  transform: translateY(0);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.your-button-class:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.your-button-class.loading {
  pointer-events: none;
}

/* Disabled form elements */
input:disabled,
textarea:disabled,
select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f5f5;
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

.mosha__toast .mosha__toast__content {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
}

.mosha__toast .mosha__toast__content .mosha__toast__content__text {
  padding: 0.5rem;
}

@media (max-width: 600px) {
  .wrapper {
    width: calc(100vw - 40px);
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .dp__menu {
    width: calc(100vw - 60px) !important;
    left: 20px !important;
    right: 20px !important;
  }
}

@media (max-width: 400px) {
  .wrapper {
    width: calc(100vw - 30px);
  }
  
  .dp__menu {
    width: calc(100vw - 50px) !important;
    left: 15px !important;
    right: 15px !important;
  }
}


</style>
