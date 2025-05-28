<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import api from "@/axios.js"; // Adjust the path as necessary

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

const baseURL = api.defaults.baseURL;

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
  records.value = props.feedbacks;
});
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2 class="table-title">
        <i class="fas fa-book header-icon"></i>
        Session Records
      </h2>

      <div class="search-container">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search records..."
            class="search-input"
          />
        </div>
      </div>
    </div>

    <div class="table-scroll-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>LEARNER'S NAME</th>
            <th>COURSE</th>
            <th>YEAR</th>
            <th>RATING</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.reviewer.name }}</td>
            <td>{{ record.reviewer.course.match(/\(([^)]+)\)/)?.[1] }}</td>
            <td>{{ record.reviewer.year }}</td>
            <td>
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star">
                  <span v-if="i <= record.rating" class="filled">★</span>
                  <span v-else>☆</span>
                </span>
              </div>
            </td>
            <td>
              <button @click="viewFeedback(record)" class="details-btn">
                <i class="fas fa-eye"></i> <span>View Feedback</span>
              </button>
            </td>
          </tr>
          <tr v-if="records.length === 0">
            <td colspan="5" class="no-users">No records to display</td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="isFeedback" class="modal-overlay" @click.self="closeFeedback">
        <div class="user-modal">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="header-content">
              <i class="fas fa-comment-dots modal-title-icon"></i>
              <h3 class="modal-title">Feedback Details</h3>
            </div>
            <button class="close-btn" @click="closeFeedback">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <!-- User Profile Section -->
            <div class="user-profile">
              <div class="profile-image-container">
                <img
                  :src="
                    `${baseURL}/api/image/` + recordView.reviewer.image ||
                    'https://placehold.co/600x400'
                  "
                  :alt="`Portrait of ${recordView.reviewer.name}`"
                  class="profile-image"
                />
              </div>

              <div class="profile-info">
                <h4 class="user-name">{{ recordView.reviewer.name }}</h4>
                <hr class="divider" />
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label"
                      ><i class="fas fa-graduation-cap"></i> Course</span
                    >
                    <span class="info-value">{{
                      recordView.reviewer.course.match(/\(([^)]+)\)/)?.[1]
                    }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label"
                      ><i class="fas fa-calendar-alt"></i> Year Level</span
                    >
                    <span class="info-value">{{
                      recordView.reviewer.year
                    }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label"
                      ><i class="fas fa-star"></i> Rating</span
                    >
                    <span class="info-value">
                      <span v-for="i in 5" :key="i" class="star">
                        <span v-if="i <= recordView.rating" class="filled"
                          >★</span
                        >
                        <span v-else>☆</span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Feedback Section -->
            <div class="details-section">
              <div class="bio-card">
                <h4 class="section-title">
                  <i class="fas fa-comment"></i> Feedback
                </h4>
                <hr class="divider2" />
                <div class="bio-content">
                  <div class="detail-item2">
                    <span class="detail-value2">{{
                      recordView.feedback || "No feedback provided"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <div class="footer-actions">
              <button class="footer-btn back" @click="closeFeedback">
                <i class="fas fa-arrow-left"></i> Back to Records
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Base Styles */
:root {
  --primary: #3b9aa9;
  --primary-light: #6dd1e3;
  --primary-dark: #0b3e8a;
  --secondary: #ffc107;
  --danger: #f44336;
  --success: #4caf50;
  --warning: #ffa000;
  --text-dark: #0b2548;
  --text-light: #f5f7fa;
  --bg-light: #ffffff;
  --border: #e1e4e8;
}

.table-container {
  background: var(--bg-light);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(26, 79, 159, 0.5);
  width: 90%;
  margin-top: 2rem;
  margin-left: 2.5rem;
  padding: 0 1rem;
  text-align: center;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  height: 37.4rem;
  max-height: 37.5rem;
  overflow-y: scroll;
}

.table-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  gap: 1rem;
  flex-wrap: wrap;
  color: #0b2548;
  position: sticky;
  top: 0;
  z-index: 20;
}

.table-title {
  margin: 0;
  font-size: 1.6rem;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.header-icon {
  font-size: 1.4rem;
}

.search-container {
  margin-left: auto;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--primary);
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid rgb(17, 17, 95);
  border-radius: 8px;
  width: 250px;
  font-size: 0.8rem;
  height: 13px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 2px 8px rgba(54, 88, 141, 0.7);
}

.table-scroll-container {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.data-table th {
  position: sticky;
  top: 0;
  background-color: #e5e5e5;
  color: var(--text-dark);
  font-weight: 600;
  padding: 0.75rem;
  border-bottom: 2px solid var(--primary);
}

.data-table td {
  padding: 0.8rem;
  vertical-align: middle;
  border-bottom: 1px solid #eee;
}

.data-table tr:hover {
  background-color: rgba(59, 154, 169, 0.05);
}

.data-table th:nth-child(1),
.data-table td:nth-child(1) {
  width: 270px;
  max-width: 300px;
  min-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 0.2rem;
}

.star {
  font-size: 1.2rem;
  color: #ccc;
}

.filled {
  color: #ffd700;
}

.details-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--primary-dark);
  background-color: rgba(73, 152, 164, 0.103);
  color: var(--primary-dark);
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.details-btn:hover {
  background-color: rgba(59, 154, 169, 0.2);
}

.no-users {
  text-align: center;
  padding: 1rem;
  color: var(--text-dark);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.user-modal {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 30%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transform: translateX(30%);
}

.modal-header {
  padding: 1rem;
  background: linear-gradient(135deg, #0c434d, #3b9aa9);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-title-icon {
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
}

.user-profile {
  display: flex;
  gap: 3rem;
  margin-bottom: 2rem;
  align-items: flex-start;
}

.profile-image-container {
  position: relative;
  flex-shrink: 0;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e1e4e8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-info {
  flex-grow: 1;
}

.user-name {
  margin: 0.6rem 0 1.5rem 0;
  font-size: 1.6rem;
  color: #0b2548;
  font-weight: 700;
  text-align: left;
}

.divider {
  border: none;
  border-top: 4px solid #8a8a8f;
  margin-bottom: 1rem;
  margin-top: -1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.info-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-label i {
  width: 16px;
  text-align: center;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0b234a;
  margin-left: 25px;
}

/* Details Section */
.details-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.bio-card {
  background: #f9fafb;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.section-title {
  margin: 0 0 1.25rem 0;
  font-size: 1.1rem;
  color: #0b3e8a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.section-title i {
  font-size: 1rem;
}

.divider2 {
  border: none;
  border-top: 1px solid #8a8a8f;
  margin-bottom: 1.5rem;
  margin-top: -0.5rem;
}

.bio-content {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #4b5563;
  text-align: left;
}

.detail-item2 {
  margin-bottom: 1.5rem;
}

.detail-value2 {
  display: block;
  margin-top: 0.5rem;
  line-height: 1.5;
}

/* Modal Footer */
.modal-footer {
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.footer-btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.footer-actions {
  display: flex;
  gap: 0.75rem;
}

.footer-btn.back {
  background-color: transparent;
  color: #6b7280;
}

.footer-btn.back:hover {
  background-color: #e5e7eb;
}

/* Transition Effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .search-container {
    margin-left: 0;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .user-profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-value {
    margin-left: 0;
    text-align: left;
  }
}

@media (max-width: 480px) {
  .data-table {
    display: block;
    overflow-x: auto;
  }

  .modal-body {
    padding: 1rem;
  }

  .user-profile {
    gap: 1.5rem;
  }

  .profile-image {
    width: 100px;
    height: 100px;
  }
}
</style>
