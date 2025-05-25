<script setup>
import { ref, computed } from "vue";
import viewUser from "@/components/mentorpage/viewUser.vue";

const isView = ref(false);
const selectedUserId = ref();

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

console.log("props:", props);
</script>

<template>
  <div class="main-wrapper">
    <div class="user-grid">
      <div
        v-for="user in props.userInformation"
        :key="user.id"
        class="user-card"
      >
        <div class="upper-element">
          <img
            :src="
              'http://localhost:8000/api/image/' + user.image_id ||
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
  justify-content: center;
  width: 100%;
  padding: 1.5rem;
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
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  border: 1px solid #e0dcd7;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
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

.lower-element button {
  background: #f5f3f0;
  color: #3a3631;
  border: 1px solid #c4c0ba;
  padding: 0.5rem 1.25rem;
  border-radius: 18px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.lower-element button:hover {
  background: #e0dcd7;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.view-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
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
