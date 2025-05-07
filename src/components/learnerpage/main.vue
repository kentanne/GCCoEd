<script setup>
import { ref } from "vue";
import viewUser from "@/components/mentorpage/viewUser.vue";

const isView = ref(false);

const openView = () => {
  isView.value = true;
};

const closeView = () => {
  isView.value = false;
};

const props = defineProps({
  userInformation: {
    type: Array,
    required: false,
  },
});

const updateRating = (user, newRating) => {
  user.starFilled.value = newRating;
};
</script>

<template>
  <div class="main-wrapper">
    <div class="user-grid">
      <div v-for="user in props.userInformation" :key="user.id" class="user-card">
        <div class="upper-element">
          <img src="https://placehold.co/600x400" alt="profile-pic" />
          <h1>{{ user.userName }}</h1>
        </div>
        <div class="lower-element">
          <p class="year-level">{{ user.yearLevel }}</p>
          <div class="star-rating">
            <span 
              v-for="n in 5" 
              :key="n" 
              @click.stop="updateRating(user, n)"
              :class="{ filled: n <= user.starFilled.value }"
            >
              ★
            </span>
          </div>
          <button @click="openView">See More</button>
        </div>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <div v-if="isView" class="view-popup">
        <viewUser @close="closeView" />
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
  padding: 15px;
}

.user-card img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}

.user-card h1 {
  color: #fff;
  font-size: 16px;
  text-align: center;
  margin: 8px 0 4px;
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
  gap: 6px;
}

.year-level {
  color: #fff;
  font-size: 14px;
  text-align: center;
  margin: 0;
}

.star-rating {
  display: flex;
  gap: 2px;
  margin: 2px 0;
}

.star-rating span {
  font-size: 1.1rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s;
}

.star-rating span.filled {
  color: gold;
}

.star-rating span:hover {
  color: orange;
}

.lower-element button {
  background-color: #349eb1;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  width: 7rem;
  cursor: pointer;
  margin-top: 12px;
  font-size: 13px;
}

.view-popup {
  position: fixed;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  z-index: 2000;
}
</style>