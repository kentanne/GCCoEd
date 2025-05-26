<script setup>
import { ref, onMounted, computed } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBook, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";
import api from "@/axios.js"; // Adjust the path as necessary

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

const baseURL = api.defaults.baseURL;

library.add(faBook, faXmark);

const props = defineProps({
  schedForReview: {
    type: Array,
    required: false,
  },
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const searchQuery = ref("");
const records = ref([]);

const filteredRecords = computed(() => {
  if (!searchQuery.value) return records.value;
  const query = searchQuery.value.toLowerCase();
  return records.value.filter((record) => {
    return (
      record.date.toLowerCase().includes(query) ||
      (record.subject && record.subject.toLowerCase().includes(query)) ||
      record.mentor.user.name.toLowerCase().includes(query) ||
      record.mentor.year.toLowerCase().includes(query) ||
      record.mentor.course.toLowerCase().includes(query)
    );
  });
});

const sendFeedback = async (record) => {
  try {
    const response = await api.post(
      "/api/learner/feedback/" + record.id,
      {
        feedback: record.feedback?.feedback || "",
        rating: tempRating.value,
      },
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log("Feedback sent successfully:", response.data);
    closeFeedback();
    const updatedRecord = {
      ...record,
      feedback: {
        feedback: record.feedback?.feedback || "",
        rating: tempRating.value,
      },
      has_feedback: true,
    };

    const index = records.value.findIndex((r) => r.id === record.id);
    if (index !== -1) {
      records.value[index] = updatedRecord;
    }

    if (recordView.value.id === record.id) {
      recordView.value = updatedRecord;
    }
  } catch (error) {
    console.error("Error sending feedback:", error);
  }
};

const recordView = ref({
  id: 0,
  date: "",
  course: "",
  name: "",
  year: "",
  status: "",
  feedback: {
    rating: 0,
    feedback: "",
  },
  has_feedback: false,
  mentor: {
    user: {
      name: "",
    },
    course: "",
    image: "",
  },
});

const isFeedback = ref(false);
const tempRating = ref(0);
const hoverRating = ref(0);

const viewFeedback = (record) => {
  isFeedback.value = true;
  recordView.value = {
    ...record,
    feedback: record.feedback || { rating: 0, feedback: "" },
  };
  tempRating.value = record.feedback?.rating || 0;
  hoverRating.value = 0;
};

const closeFeedback = () => {
  isFeedback.value = false;
};

const setRating = (rating) => {
  tempRating.value = rating;
};

onMounted(async () => {
  records.value = props.schedForReview || [];
});
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2 class="table-title">
        <FontAwesomeIcon :icon="['fas', 'book']" class="header-icon" />
        Session Records
      </h2>

      <div class="search-container">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search records..."
            class="search-input"
          />
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead class="table-head">
          <tr>
            <th>DATE / TIME</th>
            <th>COURSE</th>
            <th>MENTOR'S NAME</th>
            <th>YEAR</th>
            <th>PROGRAM</th>
            <th>RATING</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody class="table-body">
          <tr v-for="record in filteredRecords" :key="record.id">
            <td class="small-text">{{ record.date }}</td>
            <td class="small-text">{{ record.subject }}</td>
            <td class="small-text">{{ record.mentor.user.name }}</td>
            <td class="small-text">{{ record.mentor.year }}</td>
            <td class="small-text">
              {{ record.mentor.course.match(/\(([^)]+)\)/)?.[1] }}
            </td>
            <td>
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star">
                  <span
                    v-if="i <= (record.feedback?.rating || 0)"
                    class="filled"
                    >★</span
                  >
                  <span v-else>☆</span>
                </span>
              </div>
            </td>
            <td>
              <button
                @click="viewFeedback(record)"
                class="details-btn small-text"
                :class="{ sent: record.has_feedback }"
              >
                {{ record.has_feedback ? "View Feedback" : "Give Feedback" }}
              </button>
            </td>
          </tr>
          <tr v-if="filteredRecords.length === 0">
            <td colspan="7" class="no-users small-text">
              No records to display
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="isFeedback" class="modal-overlay" @click.self="closeFeedback">
        <div class="user-modal">
          <div class="modal-header">
            <div class="header-content">
              <i class="fas fa-comment-dots modal-title-icon"></i>
              <h3 class="modal-title small-text">Feedback Details</h3>
            </div>
            <button class="close-btn" @click="closeFeedback">
              <FontAwesomeIcon :icon="['fas', 'xmark']" />
            </button>
          </div>

          <div class="modal-body">
            <div class="user-profile">
              <div class="profile-image-container">
                <img
                  :src="
                    `${baseURL}/api/image/` + recordView.mentor.image ||
                    'https://placehold.co/600x400'
                  "
                  :alt="`Portrait of ${recordView.mentor.user.name}`"
                  class="profile-image"
                />
              </div>

              <div class="profile-info">
                <h4 class="user-name small-text">
                  {{ recordView.mentor.user.name }}
                </h4>
                <hr class="divider" />
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label small-text"
                      ><i class="fas fa-graduation-cap"></i> Course</span
                    >
                    <span class="info-value small-text">{{
                      recordView.mentor.course.match(/\(([^)]+)\)/)?.[1]
                    }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label small-text"
                      ><i class="fas fa-calendar-alt"></i> Year Level</span
                    >
                    <span class="info-value small-text">{{
                      recordView.mentor.year
                    }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label small-text"
                      ><i class="fas fa-star"></i> Session Date</span
                    >
                    <span class="info-value small-text">{{
                      recordView.date
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="details-section">
              <div class="bio-card">
                <h4 class="section-title small-text">
                  <i class="fas fa-star"></i> Rate This Session
                </h4>
                <hr class="divider2" />
                <div class="rating-stars">
                  <span
                    v-for="i in 5"
                    :key="i"
                    @click="!recordView.has_feedback && setRating(i)"
                    @mouseover="!recordView.has_feedback && (hoverRating = i)"
                    @mouseleave="hoverRating = 0"
                    class="star"
                    :class="{
                      filled: i <= (hoverRating || tempRating),
                      disabled: recordView.has_feedback,
                    }"
                  >
                    ★
                  </span>
                </div>
                <div
                  v-if="recordView.has_feedback"
                  class="current-rating small-text"
                >
                  Your rating: {{ recordView.feedback.rating }} stars
                </div>
              </div>

              <div class="bio-card">
                <h4 class="section-title small-text">
                  <i class="fas fa-comment"></i> Feedback
                </h4>
                <hr class="divider2" />
                <textarea
                  v-model="recordView.feedback.feedback"
                  :placeholder="
                    recordView.has_feedback ? '' : 'Enter your feedback here...'
                  "
                  class="feedback-input small-text"
                  :disabled="recordView.has_feedback"
                ></textarea>
              </div>
            </div>
          </div>

<div class="modal-footer">
  <div class="footer-actions">
    <button class="footer-btn back small-text" @click="closeFeedback">
      <i class="fas fa-arrow-left"></i> Back to Records
    </button>
    <button 
      v-if="!recordView.has_feedback" 
      @click="sendFeedback(recordView)" 
      class="footer-btn submit small-text"
      :disabled="tempRating === 0"
    >
      <i class="fas fa-paper-plane"></i> Submit Feedback
    </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
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

.small-text {
  font-size: 0.8rem;
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
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid rgb(17, 17, 95);
  border-radius: 8px;
  width: 250px;
  font-size: 0.7rem;
  height: 13px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 2px 8px rgba(54, 88, 141, 0.7);
}

.table-wrapper {
  overflow-y: auto;
  flex-grow: 1;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.table-head {
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th {
  background-color: #e5e5e5;
  color: var(--text-dark);
  font-weight: 600;
  padding: 0.5rem;
  border-bottom: 2px solid var(--primary);
  font-size: 0.8rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table td {
  padding: 0.5rem;
  vertical-align: middle;
  border-bottom: 1px solid #eee;
}

.data-table tr:hover {
  background-color: rgba(59, 154, 169, 0.05);
}

.data-table th:nth-child(2),  
.data-table td:nth-child(2) { 
  width: 250px; 
  max-width: 250px;
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
  font-size: 1rem;
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
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.details-btn:hover {
  background-color: rgba(59, 154, 169, 0.2);
}

.details-btn.sent {
  background-color: rgba(76, 175, 80, 0.1);
  border-color: var(--success);
  color: var(--success);
}

.no-users {
  text-align: center;
  padding: 1rem;
  color: var(--text-dark);
}

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
  background: linear-gradient(135deg, #0b3e8a, #3b9aa9);
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
  font-weight: 600;
}

.modal-title-icon {
  font-size: 1rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1rem;
}

.user-profile {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.profile-image-container {
  position: relative;
  flex-shrink: 0;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e1e4e8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-info {
  flex-grow: 1;
}

.user-name {
  margin: 0.3rem 0 1rem 0;
  font-weight: 700;
  text-align: left;
}

.divider {
  border: none;
  border-top: 3px solid #8a8a8f;
  margin-bottom: 0.8rem;
  margin-top: -0.5rem;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  text-align: left;
  min-width: 120px;
  flex: 1 0 auto;
}

.info-label {
  color: #6b7280;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-label i {
  width: 14px;
  text-align: center;
}

.info-value {
  font-weight: 600;
  color: #0b234a;
  margin-left: 20px;
}

.details-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.bio-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.section-title {
  margin: 0 0 1rem 0;
  color: #0b3e8a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.section-title i {
  font-size: 0.9rem;
}

.divider2 {
  border: none;
  border-top: 1px solid #8a8a8f;
  margin-bottom: 1rem;
  margin-top: -0.3rem;
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.8rem 0;
}

.rating-stars .star {
  font-size: 1.5rem;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
}

.rating-stars .star.filled {
  color: #ffd700;
}

.rating-stars .star.disabled {
  cursor: default;
}

.current-rating {
  text-align: center;
  margin-top: 0.5rem;
  color: var(--primary-dark);
  font-weight: 500;
}

.feedback-input {
  width: 90%;
  min-height: 80px;
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s;
}

.feedback-input:focus {
  outline: none;
  border-color: var(--primary);
}

.feedback-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.modal-footer {
  padding: 1rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.footer-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.footer-actions {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  justify-content: space-between;
}

.footer-btn.back {
  background-color: transparent;
  color: #6b7280;
}

.footer-btn.back:hover {
  background-color: #e5e7eb;
}

.footer-btn.submit {
  background: linear-gradient(135deg, #3b9aa9, #0b3e8a);
  color: rgb(225, 232, 235);
}

.footer-btn.submit:hover {
  background: linear-gradient(135deg, #0b3e8a, #3b9aa9);
}

.footer-btn.submit:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .table-container {
    height: auto;
    max-height: 80vh;
  }

  .table-header {
    position: relative;
    top: auto;
  }

  .table-head {
    position: relative;
    top: auto;
  }

  .table-wrapper {
    overflow-y: visible;
  }

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
    padding: 0.8rem;
  }

  .user-profile {
    gap: 1rem;
  }

  .profile-image {
    width: 70px;
    height: 70px;
  }

  .footer-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
