<script setup>
import { ref } from "vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBook, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faBook, faXmark);

const records = ref([
	{
		id: 1,
		date: "2023-10-01",
		course: "1st Year / BSIT",
		name: "John Doe",
		year: "1st Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 2,
		date: "2023-10-02",
		course: "2nd Year / BSIT",
		name: "Jane Smith",
		year: "2nd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 3,
		date: "2023-10-03",
		course: "1st Year / BSIT",
		name: "Alice Johnson",
		year: "1st Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 4,
		date: "2023-10-04",
		course: "3rd Year / BSIT",
		name: "Bob Lee",
		year: "3rd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 5,
		date: "2023-10-05",
		course: "2nd Year / BSIT",
		name: "Ella Cruz",
		year: "2nd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 6,
		date: "2023-10-06",
		course: "4th Year / BSIT",
		name: "Charlie Kim",
		year: "4th Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 7,
		date: "2023-10-07",
		course: "3rd Year / BSIT",
		name: "Diana Park",
		year: "3rd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 8,
		date: "2023-10-08",
		course: "2nd Year / BSIT",
		name: "Edward Blake",
		year: "2nd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 9,
		date: "2023-10-09",
		course: "1st Year / BSIT",
		name: "Fiona Lane",
		year: "1st Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 10,
		date: "2023-10-10",
		course: "4th Year / BSIT",
		name: "George Finn",
		year: "4th Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 11,
		date: "2023-10-11",
		course: "2nd Year / BSIT",
		name: "Hannah Wells",
		year: "2nd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 12,
		date: "2023-10-12",
		course: "3rd Year / BSIT",
		name: "Isaac Nash",
		year: "3rd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 13,
		date: "2023-10-13",
		course: "1st Year / BSIT",
		name: "Julia Kim",
		year: "1st Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 14,
		date: "2023-10-14",
		course: "2nd Year / BSIT",
		name: "Kevin Hart",
		year: "2nd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 15,
		date: "2023-10-15",
		course: "1st Year / BSIT",
		name: "Lana Rhodes",
		year: "1st Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 16,
		date: "2023-10-16",
		course: "2nd Year / BSIT",
		name: "Mike Taylor",
		year: "2nd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 17,
		date: "2023-10-17",
		course: "4th Year / BSIT",
		name: "Nina Gold",
		year: "4th Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 18,
		date: "2023-10-18",
		course: "4th Year / BSIT",
		name: "Oscar Knight",
		year: "4th Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 19,
		date: "2023-10-19",
		course: "3rd Year / BSIT",
		name: "Paula Rivera",
		year: "3rd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 20,
		date: "2023-10-20",
		course: "2nd Year / BSIT",
		name: "Quentin Blaze",
		year: "2nd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 21,
		date: "2023-10-21",
		course: "1st Year / BSIT",
		name: "Rachel Green",
		year: "1st Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 22,
		date: "2023-10-22",
		course: "3rd Year / BSIT",
		name: "Steve Jobs",
		year: "3rd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 23,
		date: "2023-10-23",
		course: "2nd Year / BSIT",
		name: "Tina Moon",
		year: "2nd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 24,
		date: "2023-10-24",
		course: "4th Year / BSIT",
		name: "Ulysses Grant",
		year: "4th Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 25,
		date: "2023-10-25",
		course: "3rd Year / BSIT",
		name: "Vera Stone",
		year: "3rd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 26,
		date: "2023-10-26",
		course: "4th Year / BSIT",
		name: "William Kent",
		year: "4th Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 27,
		date: "2023-10-27",
		course: "2nd Year / BSIT",
		name: "Xander Fox",
		year: "2nd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 28,
		date: "2023-10-28",
		course: "3rd Year / BSIT",
		name: "Yasmine Grey",
		year: "3rd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 29,
		date: "2023-10-29",
		course: "4th Year / BSIT",
		name: "Zane Carter",
		year: "4th Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 30,
		date: "2023-10-30",
		course: "3rd Year / BSIT",
		name: "Ava Morgan",
		year: "3rd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 31,
		date: "2023-10-31",
		course: "1st Year / BSIT",
		name: "Ben Oliver",
		year: "1st Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
	{
		id: 32,
		date: "2023-11-01",
		course: "2nd Year / BSIT",
		name: "Cleo Davis",
		year: "2nd Year",
		status: "Completed",
		rating: 0,
		feedback: "",
		feedbackSent: false
	},
]);

const recordView = ref({
  id: 0,
  date: "",
  course: "",
  name: "",
  year: "",
  status: "",
  rating: 0,
  feedback: "",
  feedbackSent: false
});

const isFeedback = ref(false);
const tempRating = ref(0);
const hoverRating = ref(0);

const viewFeedback = (record) => {
  isFeedback.value = true;
  recordView.value = {...record};
  tempRating.value = record.rating;
  hoverRating.value = 0;
};

const closeFeedback = () => {
  isFeedback.value = false;
};

const setRating = (rating) => {
  tempRating.value = rating;
};

const submitFeedback = () => {
  const record = records.value.find(r => r.id === recordView.value.id);
  if (record) {
    record.rating = tempRating.value;
    record.feedback = recordView.value.feedback;
    record.feedbackSent = true;
  }
  closeFeedback();
};
</script>

<template>
  <div class="records-wrapper">
    <div class="top-element">
      <FontAwesomeIcon :icon="['fas', 'book']" size="3x" color="#fff" />
      <h1>Session Records</h1>
    </div>
    <div class="lower-element">
      <table>
        <thead>
          <tr>
            <th>DATE / TIME</th>
            <th>COURSE</th>
            <th>MENTORS'S NAME</th>
            <th>YEAR / PROGRAM</th>
            <th>STATUS</th>
            <th>RATING</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.date }}</td>
            <td>{{ record.course }}</td>
            <td>{{ record.name }}</td>
            <td>{{ record.year }}</td>
            <td>{{ record.status }}</td>
            <td>
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star">
                  <span v-if="i <= record.rating" class="filled">★</span>
                  <span v-else>☆</span>
                </span>
              </div>
            </td>
            <td>
              <button
                @click="viewFeedback(record)"
                class="view-feedback-btn"
                :disabled="record.status !== 'Completed'"
              >
                {{ record.feedbackSent ? 'Feedback Sent' : 'Give Feedback' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="isFeedback" class="feedback-pop-up">
        <div class="feedback-upper">
          <img src="https://placehold.co/600x400" alt="profile-pic" />
          <h1>{{ recordView.name }}</h1>
          <h2>{{ recordView.course }}</h2>

          <FontAwesomeIcon
            @click="closeFeedback"
            :icon="['fas', 'xmark']"
            size="2x"
            color="#fff"
            style="cursor: pointer"
            class="exit-feedback"
          />
        </div>
		<hr>
        <div class="feedback-lower">
          <h1>RATE THIS SESSION</h1>
          <div class="rating-stars">
            <span 
              v-for="i in 5" 
              :key="i"
              @click="setRating(i)"
              @mouseover="hoverRating = i"
              @mouseleave="hoverRating = 0"
              class="star"
              :class="{ 'filled': i <= (hoverRating || tempRating) }"
            >
              ★
            </span>
          </div>
          
          <h1>FEEDBACK</h1>
          <textarea 
            v-model="recordView.feedback" 
            placeholder="Enter your feedback here..."
            class="feedback-input"
          ></textarea>
          
          <button @click="submitFeedback" class="submit-btn">
            Submit Feedback
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.records-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.top-element {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 17px;
  background-color: #0c434d;
  padding: 18px 30px;
  border-radius: 20px 20px 0 0;
}

.top-element h1 {
  color: #fff;
  font-size: 2rem;
  font-weight: 600;
}

.lower-element {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: #fff;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  border: 3px solid #0c434d;
  height: 542px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  color: #066678;
}

thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

th {
  padding: 10px;
  text-align: center;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  background-color: #f5f5f5;
}

tbody {
  display: block;
  overflow-y: auto;
  max-height: 660px;
}

thead,
tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

td {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.stars {
  display: flex;
  justify-content: center;
  align-items: center;
}

.star {
  font-size: 1.2rem;
  color: #ccc;
}

.filled {
  color: #ffd700;
}

.view-feedback-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  color: #066678;
}

.view-feedback-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
  text-decoration: none;
}

.feedback-pop-up {
  position: fixed;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
  width: 300px; 
  height: 400px; 
  background-color: #006981;
  padding: 10px 15px 20px 15px; 
  overflow: hidden;
  z-index: 1000;
  border-radius: 20px;
}

.feedback-upper,
.feedback-lower {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px; 
  padding: 10px;
  position: relative;
}

.feedback-upper img {
  width: 80px; 
  height: 80px; 
  object-fit: cover;
  border-radius: 50%;
}

.feedback-upper h1 {
  color: #fff;
  font-size: 1.2rem; 
  font-weight: 600;
}

.feedback-upper h2 {
  color: #fff;
  font-size: 1rem; 
  font-weight: 400;
}

.feedback-lower {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.feedback-lower h1 {
  color: #fff;
  font-size: 1rem; 
  font-weight: 400;
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 7px 0; 
}

.rating-stars .star {
  font-size: 1.4rem; 
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s;
}

.rating-stars .star.filled {
  color: #ffd700;
}

.feedback-input {
 width: 100%;
  height: 80px; 
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  resize: none;
  margin-bottom: 10px; 
}

.submit-btn {
  background-color: #0c434d;
  color: white;
  border: none;
  padding: 8px 15px; 
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #3f8f9d;
}

.exit-feedback {
  position: fixed;
  top: 15px;
  right: 15px; 
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>