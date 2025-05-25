<template>
  <div class="wrapper">
    <!-- Sticky Modal Header -->
    <div class="upper-element sticky-header">
      <div class="header-content">
        <i class="fas fa-user-graduate modal-title-icon"></i>
        <h3 class="modal-title">Mentor Profile</h3>
      </div>
      <button class="close-btn" @click="emit('close')">
        <font-awesome-icon icon="fa-xmark" size="lg" />
      </button>
    </div>

    <!-- Scrollable Content -->
    <div class="scrollable-content">
      <!-- Modal Body -->
      <div class="lower-element">
        <!-- Applicant Profile Section -->
        <div class="lower-upper">
          <div class="profile-image-container">
            <img
              :src="'http://localhost:8000/api/image/' + profilePic || 'https://placehold.co/600x400'"
              alt="Profile Image"
              class="profile-image"
            />
          </div>

          <div class="profile-information">
            <h4 class="applicant-name">{{ name }}</h4>
            <hr class="divider" />
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label"><i class="fas fa-venus-mars"></i> Gender</span>
                <span class="info-value">{{ gender || "N/A" }}</span>
              </div>
              <div class="info-item">
                <span class="info-label"><i class="fas fa-calendar-alt"></i> Year</span>
                <span class="info-value">{{ year || "N/A" }}</span>
              </div>
              <div class="info-item">
                <span class="info-label"><i class="fas fa-graduation-cap"></i> Program</span>
                <span class="info-value">{{ course || "N/A" }}</span>
              </div>
              <div class="info-item">
                <span class="info-label"><i class="fas fa-university"></i> College</span>
                <span class="info-value">College of Computer Studies</span>
              </div>
              <div class="info-item">
                <span class="info-label"><i class="fas fa-map-marker-alt"></i> Location</span>
                <span class="info-value">{{ address || "N/A" }}</span>
              </div>
              <div class="info-item">
                <span class="info-label"><i class="fas fa-phone"></i> Contact</span>
                <span class="info-value">{{ contact || "N/A" }}</span>
              </div>
              <div class="info-item">
                <span class="info-label"><i class="fas fa-envelope"></i> Email</span>
                <span class="info-value">{{ email || "N/A" }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="lower-lower">
          <div class="details-section">
            <div class="details-card">
              <h4 class="section-title">
                <i class="fas fa-info-circle"></i> Teaching Details
              </h4>
              <hr class="divider2" />
              <div class="details-content">
                <div class="detail-item">
                  <span class="detail-label">Subjects Offered:</span>
                  <span class="detail-value right-align wrap-text">{{ subjects || "N/A" }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Teaching Modality:</span>
                  <span class="detail-value right-align">{{ modality || "N/A" }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Teaching Style:</span>
                  <span class="detail-value right-align">{{ learnStyle || "N/A" }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Availability:</span>
                  <span class="detail-value availability-text right-align">{{ availability || "N/A" }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Session Duration:</span>
                  <span class="detail-value right-align">{{ sessionDur || "N/A" }}</span>
                </div>
              </div>
            </div>

            <div class="bio-card">
              <h4 class="section-title">
                <i class="fas fa-user-edit"></i> Bio & Experience
              </h4>
              <hr class="divider2" />
              <div class="bio-content">
                <div class="detail-item2">
                  <span class="detail-label">Bio:</span>
                  <span class="detail-value2 wrap-text">{{ bio || "No bio provided" }}</span>
                </div>
                <div class="detail-item2">
                  <span class="detail-label">Experience:</span>
                  <span class="detail-value2 wrap-text">{{ goal || "No experience provided" }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Footer Button -->
    <div class="sticky-footer">
      <div class="action-button">
        <button @click="showConfirmationModal = true">
          <i class="fas fa-calendar-alt"></i> Schedule Session
        </button>
      </div>
    </div>
  </div>

  <!-- Schedule Confirmation Modal -->
  <div v-if="showConfirmationModal" class="confirmation-modal-overlay">
    <div class="confirmation-modal">
      <h3>Confirm Schedule</h3>
      <hr />
      <p>Are you sure you want to schedule a session with {{ name }}?</p>
      <div class="modal-actions">
        <button class="modal-btn cancel" @click="showConfirmationModal = false">
          Cancel
        </button>
        <button class="modal-btn confirm" @click="confirmSchedule">
          Confirm
        </button>
      </div>
    </div>
  </div>

  <!-- Schedule Popup -->
  <div v-if="showSchedule" class="popup-overlay">
    <Schedule @close="showSchedule = false" :info="userDeetsForSched" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Schedule from "@/components/learnerpage/schedule.vue";
import axios from "axios";
import api from "@/axios.js"; // Adjust the path as necessary

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const userId = ref(props.userId);

const showSchedule = ref(false);
const showConfirmationModal = ref(false);
const emit = defineEmits(["close"]);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const userInfo = async (id) => {
  try {
    const userDeets = await api
      .get(`/api/learner/users/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("user details:", response.data);
        mentor_no.value = response.data.user_info.mentor_no;
        name.value = response.data.user.name;
        year.value = response.data.user_info.year;
        course.value = response.data.user_info.course;
        gender.value = response.data.user_info.gender;
        contact.value = response.data.user_info.phoneNum;
        email.value = response.data.user.email;
        address.value = response.data.user_info.address;
        bio.value = response.data.user_info.bio;
        subjects.value = response.data.user_info.subjects; //response.data.user_info.subjects;
        modality.value = response.data.user_info.learn_modality;
        learnStyle.value = response.data.user_info.teach_sty;
        availability.value = response.data.user_info.availability;
        sessionDur.value = response.data.user_info.prefSessDur;
        goal.value = response.data.user_info.exp;
        profilePic.value = response.data.user_info.image;
        userDeetsForSched.value = [
          mentor_no.value, // mentorNo
          name.value, // mentorName
          year.value, // mentorYear
          course.value, // mentorCourse
          sessionDur.value, // mentorSessionDur
          modality.value, // mentorModality
          learnStyle.value, // mentorTeachStyle
          availability.value, // mentorAvailability
          modality.value, // mentorLearnModality
          profilePic.value, // mentorProfilePic
          subjects.value, // mentorSubjects
        ];
      });
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

const confirmSchedule = () => {
  showConfirmationModal.value = false;
  showSchedule.value = true;
};

const userDeetsForSched = ref();
const mentor_no = ref();
const name = ref();
const year = ref();
const course = ref();
const gender = ref();
const contact = ref();
const email = ref();
const address = ref();
const bio = ref();
const subjects = ref();
const modality = ref();
const learnStyle = ref();
const availability = ref();
const sessionDur = ref();
const goal = ref();
const profilePic = ref();

onMounted(() => {
  userInfo(props.userId);
});
</script>

<style scoped>
.wrapper {
  background: white;
  border-radius: 12px;
  width: 800px;
  max-height: 80vh;
  height: 80vh; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 100;
  margin-top: 3rem;
  left: 10rem;
  overflow: hidden; /* Added to contain the scrollable area */
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 150;
  background: linear-gradient(135deg, #0b3e8a, #3b9aa9);
}

.sticky-footer {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 1rem;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 120;
}

.scrollable-content {
  overflow-y: auto;
  flex: 1;
  padding: 0 1.5rem;
}

.wrap-text {
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: inline-block;
  max-width: 100%;
}

.right-align {
  text-align: right;
  display: block;
  width: 100%;
  white-space: normal;
}

.availability-text {
  white-space: pre-line;
  word-break: break-word;
  text-align: right;
  display: inline-block;
  width: 100%;
}

.upper-element {
  padding: 1.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
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

.lower-element {
  padding: 1.5rem 0;
}

.lower-upper {
  display: flex;
  gap: 2rem;
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

.profile-information {
  flex-grow: 1;
  min-width: 0;
}

.applicant-name {
  margin: 0.6rem 0 1.5rem 0;
  font-size: 1.5rem;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.info-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-label i {
  width: 16px;
  text-align: center;
}

.info-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0b234a;
  margin-left: 25px;
}

.lower-lower {
  margin-top: 1.5rem;
}

.details-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.details-card,
.bio-card {
  background: #f9fafb;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  min-width: 0;
}

.section-title {
  margin: 0 0 1rem 0;
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
  margin-bottom: 1rem;
  margin-top: -0.5rem;
}

.details-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.detail-label {
  font-weight: 500;
  color: #4b5563;
  font-size: 0.85rem;
  flex: 1;
  padding-right: 1rem;
}

.detail-value {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.85rem;
  flex: 1;
}

.bio-content {
  font-size: 0.85rem;
  line-height: 1.6;
  color: #4b5563;
  text-align: left;
}

.detail-item2 {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.detail-value2 {
  font-weight: 600;
  color: #1f2937;
  text-align: left;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Action Button */
.action-button {
  display: flex;
  justify-content: flex-end;
  padding: 0;
}

.action-button button {
  background: linear-gradient(135deg, #0b3e8a, #3b9aa9);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(11, 62, 138, 0.2);
  font-size: 0.9rem;
}

.action-button button:hover {
  background: linear-gradient(135deg, #0a367e, #328c9a);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(11, 62, 138, 0.3);
}

.action-button button i {
  font-size: 0.9rem;
}

.confirmation-modal-overlay {
  position: fixed;
  top: 3rem;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  left: 10rem;
  width: 100%;
}

.confirmation-modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 2001;
  margin-left: 3rem;
}

.confirmation-modal h3 {
  margin-top: 0;
  color: #0b3e8a;
  margin-bottom: 1rem;
}

.confirmation-modal hr {
  border: none;
  border-top: 1px solid #e1e4e8;
  margin: 1rem 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.modal-btn.cancel {
  background-color: #f0f0f0;
  color: #333;
}

.modal-btn.confirm {
  background-color: #0b3e8a;
  color: white;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Responsive Design */
@media (max-width: 850px) {
  .wrapper {
    width: 95%;
    max-width: 95vw;
  }

  .details-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .lower-upper {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-information {
    text-align: center;
  }

  .applicant-name,
  .info-item {
    text-align: center;
  }

  .info-value {
    margin-left: 0;
  }

  .action-button {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .details-card,
  .bio-card {
    padding: 1rem;
  }

  .profile-image {
    width: 100px;
    height: 100px;
  }
}
</style>
