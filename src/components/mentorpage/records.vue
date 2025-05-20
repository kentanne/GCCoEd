<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const props = defineProps({
  feedbacks: {
    type: Array,
    default: () => [],
  },
});

const records = ref([
  // {
  // 	id: 1,
  // 	date: "2023-10-01",
  // 	course: "1st Year / BSIT",
  // 	name: "John Doe",
  // 	year: "1st Year",
  // 	status: "Completed",
  // 	rating: 5,
  // 	feedback: "Great session! Learned a lot!",
  // },
  // {
  // 	id: 2,
  // 	date: "2023-10-02",
  // 	course: "2nd Year / BSIT",
  // 	name: "Jane Smith",
  // 	year: "2nd Year",
  // 	status: "Completed",
  // 	rating: 4,
  // 	feedback: "Very informative, but a bit fast-paced.",
  // },
  // {
  // 	id: 3,
  // 	date: "2023-10-03",
  // 	course: "1st Year / BSIT",
  // 	name: "Alice Johnson",
  // 	year: "1st Year",
  // 	status: "Completed",
  // 	rating: 5,
  // 	feedback: "Awesome instructor, clear explanations!",
  // },
]);

// const fetchRecordTable = () => {
//   // Ensure feedbacks is an array and map its data
//   records.value = props.feedbacks.map((feedback) => ({
//     id: feedback.id || 0,
//     course: feedback.reviewer?.course || "N/A", // Use optional chaining and default value
//     name: feedback.reviewer?.name || "N/A",
//     year: feedback.reviewer?.year || "N/A",
//     rating: feedback.rating || 0,
//     feedback: feedback.comment || "No feedback provided",
//   }));
// };

const recordView = ref({
  id: 0,
  // date: "",
  course: "",
  name: "",
  year: "",
  // status: "",
  rating: 0,
  feedback: "",
});

const isFeedback = ref(false);

const viewFeedback = (record) => {
  isFeedback.value = true;
  recordView.value = record;
};

const closeFeedback = () => {
  isFeedback.value = false;
  recordView.value = null;
};

onMounted(() => {
  // records.value = props.feedbacks;
  // fetchRecordTable();
  // console.log(records.value);
  records.value = props.feedbacks;
});
</script>

<template>
  <div class="records-wrapper">
    <div class="top-element">
      <font-awesome-icon icon="fa-book" size="3x" color="#fff" />
      <h1>Session Records</h1>
    </div>
    <div class="lower-element">
      <table>
        <thead>
          <tr>
            <!-- <th>DATE / TIME</th> -->
            <th>COURSE</th>
            <th>LEARNER'S NAME</th>
            <th>YEAR</th>
            <!-- <th>STATUS</th> -->
            <th>RATING</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <!-- Create a row for each record -->
          <tr v-for="record in records" :key="record.id">
            <!-- <td>{{ record.date }}</td> -->
            <td>{{ record.reviewer.course }}</td>
            <td>{{ record.reviewer.user.name }}</td>
            <td>{{ record.reviewer.year }}</td>
            <!-- <td>{{ record.status || 'blank'}}</td> -->
            <td>
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star">
                  <span v-if="i <= record.rating" class="filled">★</span>
                  <span v-else>☆</span>
                </span>
              </div>
            </td>
            <td>
              <button @click="viewFeedback(record)" class="view-feedback-btn">
                View Feedback
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="isFeedback" class="feedback-pop-up">
        <div class="feedback-upper">
          <img
            :src="
              'http://localhost:8000/api/image/' + recordView.reviewer.image ||
              'https://placehold.co/600x400' ||
              'https://placehold.co/600x400'
            "
            alt="profile-pic"
          />
          <h1>{{ recordView.reviewer.name }}</h1>
          <h2>{{ recordView.reviewer.course }}</h2>

          <font-awesome-icon
            @click="closeFeedback"
            icon="fa-xmark"
            size="2x"
            color="#fff"
            style="cursor: pointer"
            class="exit-feedback"
          />
        </div>
        <div class="feedback-lower">
          <h1>FEEDBACK</h1>
          <div class="feedback-content">
            <p>
              {{ recordView.feedback }}
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.records-wrapper {
  display: flex;
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
  flex-direction: column; /* Ensure proper alignment */
  justify-content: flex-start; /* Align content to the top */
  align-items: stretch; /* Stretch content to fill the width */
  background-color: #fff;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  border: 3px solid #0c434d;
  padding: 0; /* Remove padding to make the table snap */
  height: auto; /* Adjust height dynamically based on content */
}

table {
  width: 100%; /* Make the table take up the full width */
  border-collapse: collapse; /* Remove gaps between table cells */
  color: #066678;
  margin: 0; /* Remove all margins */
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
  max-height: 400px; /* Adjust height to fit within the container */
  width: 100%;
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

td button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  color: #066678;
}

/* pop-up */

.feedback-pop-up {
  position: fixed;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  width: 375px;
  height: 450px;
  background-color: #006981;
  padding: 15px 20px 30px 20px;
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
  gap: 10px;
  padding: 20px;
  position: relative;
}

.feedback-upper img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 50%;
}

.feedback-upper h1 {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 600;
}

.feedback-upper::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 3px;
  background-color: #a6a6a6;
}

.feedback-upper h2 {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 400;
}

.feedback-lower {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.feedback-lower h1 {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 400;
}

.feedback-content {
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 10px;
  width: 100%;
  height: 160px;
  max-height: 160px;
  overflow-y: auto;
  word-wrap: break-word;
}

.feedback-content p {
  color: #066678;
  font-size: 0.9rem;
  font-weight: 400;
  text-align: justify;
}

.feedback-content::-webkit-scrollbar {
  width: 8px;
}

.exit-feedback {
  position: fixed;
  top: 20px;
  right: 20px;
}
</style>
