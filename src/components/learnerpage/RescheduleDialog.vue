<script setup>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "vue";
import api from "@/axios.js"; // Adjust the path as necessary
import axios from "axios";

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const selectedDate = ref(null);

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
      console.error("No date selected");
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
        console.log("Reschedule response:", response.data);
      });
    // return response.data
  } catch (error) {
    console.error("Error rescheduling session:", error);
  }
};
</script>

<template>
  <div class="wrapper">
    <div class="upper-element">
      <font-awesome-icon
        icon="fa-solid fa-xmark"
        @click="$emit('close')"
        class="close-icon"
      />
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
        <button
          @click="rescheduleSession"
          class="confirm-button"
          :disabled="!selectedDate"
        >
          Reschedule
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Centered popup wrapper */
.wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px;
  padding: 20px;
}
</style>
