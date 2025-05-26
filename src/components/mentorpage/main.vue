<script setup>
import { ref, computed } from "vue";
import viewUser from "@/components/mentorpage/viewUser.vue";
import api from "@/axios.js";
import axios from "axios";

const isView = ref(false);
const selectedUserId = ref();
const searchQuery = ref("");

const baseURL = api.defaults.baseURL;

const openView = (id) => {
  console.log("Selected user ID:", id);
  selectedUserId.value = id;
  isView.value = true;
};

const closeView = () => {
  isView.value = false;
};

const props = defineProps({
  userInformation: {
    type: Array,
    required: true,
  },
  schedule: {
    type: Object,
    required: true,
  },
  upcomingSchedule: {
    type: Object,
    required: true,
  },
  mentorData: {
    type: Object,
    required: true,
  },
});

// Computed property to filter users based on search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) return props.userInformation;

  const query = searchQuery.value.toLowerCase();
  return props.userInformation.filter((user) => {
    return (
      user.userName.toLowerCase().includes(query) ||
      user.course.toLowerCase().includes(query) ||
      user.yearLevel.toLowerCase().includes(query)
    );
  });
});
</script>

<template>
  <div class="main-wrapper">
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name, course, or year..."
        class="search-input"
      />
      <button class="search-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
    <div class="user-grid">
      <div
        v-for="user in props.userInformation"
        :key="user.id"
        class="user-card"
      >
        <div class="upper-element">
          <img
            :src="
              `${baseURL}/api/image/` + user.image_id ||
              'https://placehold.co/600x400'
            "
            alt="profile-pic"
          />
          <h1>{{ user.userName }}</h1>
        </div>
        <div class="lower-element">
          <p>{{ user.yearLevel }}</p>
          <p>{{ user.course.match(/\(([^)]+)\)/)?.[1] }}</p>
          <button @click="openView(user.id)">See More</button>
        </div>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <div v-if="isView" class="view-popup">
        <viewUser
          :userId="selectedUserId"
          :mentorData="props.mentorData"
          @close="closeView"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.main-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1.5rem;
  position: relative;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 1100px;
  justify-content: flex-end;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #d8d5d0;
  border-radius: 20px;
  font-size: 0.9rem;
  width: 250px;
  transition: all 0.3s ease;
  margin-right: 0.5rem;
}

.search-input:focus {
  outline: none;
  border-color: #349eb1;
  box-shadow: 0 0 0 2px rgba(52, 158, 177, 0.2);
  width: 300px;
}

.search-button {
  background: linear-gradient(135deg, #0c434d, #3b9aa9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-button:hover {
  background: #2d8a9d;
  transform: scale(1.05);
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  width: 100%;
  max-width: 1100px;
}

.user-card {
  background: #e3e6e7;
  background: #e3e6e7;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e0dcd7;
  position: relative;
  z-index: 1;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
}

.user-card:hover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(138, 43, 226, 0.2) 0%,
    rgba(75, 0, 130, 0.3) 100%
  );
  z-index: -1;
  border-radius: 10px;
}

.upper-element {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eaeef1;
  position: relative;
}

.upper-element::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d8d5d0, transparent);
}

.user-card img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #f5f3f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-card h1 {
  color: #3a3631;
  font-size: 1rem;
  font-weight: 600;
  margin: 0.75rem 0 0.4rem;
  text-align: center;
}

.lower-element {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eaeef1;
}

.lower-element p {
  color: #5a5651;
  font-size: 0.8rem;
  text-align: center;
  margin: 0.15rem 0;
  line-height: 1.4;
}

.proficiency {
  color: #349eb1 !important;
  font-weight: bold;
  margin-top: 0.5rem !important;
}

.lower-element button {
  background: linear-gradient(135deg, #0c434d, #3b9aa9);
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 18px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: auto;
}

.lower-element button:hover {
  background: linear-gradient(135deg, #3b9aa9, #0c434d);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.view-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
}

.stars {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  margin: 0.5rem 0;
}

.filledStar {
  font-size: 1.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
