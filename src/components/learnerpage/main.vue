<script setup>
import { ref, computed } from "vue";
import viewUser from "@/components/learnerpage/viewUser.vue";

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
    required: false,
    default: () => [],
  },
  schedule: {
    type: Object,
    required: false,
  },
  upcomingSchedule: {
    type: Object,
    required: false,
  },
});
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
              user.image_id
                ? `http://localhost:8000/api/image/${user.image_id}`
                : 'https://placehold.co/600x400'
            "
            alt="profile-pic"
          />
          <h1>{{ user.userName }}</h1>
          <div class="stars">
            <span class="filledStar" v-for="i in 5" :key="i">
              <span
                v-if="i <= Math.round(user.rating_ave || 0)"
                style="color: #ffd700"
                >★</span
              >
              <span v-else style="color: #e0e0e0">☆</span>
            </span>
          </div>
        </div>
        <div class="lower-element">
          <p>{{ user.yearLevel }}</p>
          <p>{{ user.course }}</p>
          <p class="proficiency">{{ user.proficiency }}</p>
          <button @click="openView(user.id)">See More</button>
        </div>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <div v-if="isView" class="view-popup">
        <viewUser :userId="selectedUserId" @close="closeView" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.main-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  width: 100%;
  padding: 10px;
}

.user-card {
  background-color: #006981;
  border: 3px solid #0c434d;
  border-radius: 25px;
  padding: 20px;
}

.user-card img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
}

.user-card h1 {
  color: #fff;
  font-size: 17px;
  text-align: center;
  margin: 10px 0;
}

.upper-element {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.lower-element {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.lower-element p {
  color: #fff;
  font-size: 14px;
  text-align: center;
  margin: 2px 0;
}

.proficiency {
  color: #349eb1 !important;
  font-weight: bold;
}

.lower-element button {
  background-color: #349eb1;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  width: 8rem;
  cursor: pointer;
  margin-top: 15px;
}

.view-popup {
  position: fixed;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  z-index: 2000;
}

.stars {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin: 5px 0;
}

.filledStar {
  font-size: 20px;
}

.rating-number {
  color: #fff;
  font-size: 14px;
  margin-left: 4px;
}
</style>
