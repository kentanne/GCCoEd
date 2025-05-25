<script setup>
import axios from "axios";
import api from "@/axios.js"; // Adjust the path as necessary
import { onMounted, ref } from "vue";
import Offer from "./offer.vue"; // Add this import

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

const baseURL = api.defaults.baseURL;

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  mentorData: {
    type: Object,
    required: true,
  },
});

const userId = ref(props.userId);
const showConfirmationModal = ref(false); // Add this line for modal control

const emit = defineEmits(["close"]);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const userInfo = async (id) => {
  console.log(id);
  try {
    const userDeets = await api
      .get(`/api/mentor/users/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("user details:", response.data);
        name.value = response.data.user.name;
        year.value = response.data.user_info.year;
        course.value = response.data.user_info.course;
        gender.value = response.data.user_info.gender;
        contact.value = response.data.user_info.phoneNum;
        email.value = response.data.user.email;
        address.value = response.data.user_info.address;
        bio.value = response.data.user_info.bio;
        subjects.value = response.data.user_info.subjects;
        modality.value = response.data.user_info.learn_modality;
        learnStyle.value = response.data.user_info.learn_sty;
        availability.value = response.data.user_info.availability;
        sessionDur.value = response.data.user_info.prefSessDur;
        goal.value = response.data.user_info.goals;
        profilePic.value = response.data.user_info.image;
        userSchoolId.value = response.data.user.id;

        // Prepare data for offer component
        userDeetsForOffer.value = [
          userSchoolId.value, // userSchoolId
          userId.value, // userId
          name.value, // userName
          year.value, // userYear
          course.value, // userCourse
          sessionDur.value, // userSessionDur
          modality.value, // userModality
          learnStyle.value, // userLearnStyle
          availability.value, // userAvailability
          modality.value, // userLearnModality
          profilePic.value, // userProfilePic
          subjects.value, // userSubjects
        ];
      });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

// Add this function to handle offer confirmation
const confirmSendOffer = () => {
  showConfirmationModal.value = false;
  // Here you would add your actual offer sending logic
  console.log("Offer sent to", name.value);
  // You might want to add a success notification here
};

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
const showOfferModal = ref(false); // Add this with your other refs
const showOffer = ref(false);
const userDeetsForOffer = ref();

// Add this function to handle opening/closing the offer modal
const toggleOfferModal = () => {
  showOfferModal.value = !showOfferModal.value;
};

// Add this function to handle opening the offer modal
const openOffer = () => {
  showOffer.value = true;
};

// Add the handleOfferConfirm function
const handleOfferConfirm = async (offerData) => {
  try {
    console.log("Offer confirmed:", offerData);
    // Here you can add any additional logic needed after offer confirmation
    showOffer.value = false;
    emit("close");
  } catch (error) {
    console.error("Error handling offer confirmation:", error);
  }
};

onMounted(() => {
  console.log("test mount");
  userInfo(props.userId);
});
</script>

<template>
  <div class="wrapper">
    <!-- Sticky Modal Header -->
    <div class="upper-element sticky-header">
      <div class="header-content">
        <i class="fas fa-user-graduate modal-title-icon"></i>
        <h3 class="modal-title">Learner Profile</h3>
      </div>
      <button class="close-btn" @click="emit('close')">
        <font-awesome-icon icon="fa-xmark" size="lg" />
      </button>
    </div>

    <!-- Modal Body -->
    <div class="lower-element">
      <!-- Learner Profile Section -->
      <div class="lower-upper">
        <div class="profile-image-container">
          <img
            :src="
              `${baseURL}/api/image/` + profilePic ||
              'https://placehold.co/600x400'
            "
            alt="Profile Image"
            class="profile-image"
          />
        </div>

        <div class="profile-information">
          <h4 class="applicant-name">{{ name }}</h4>
          <hr class="divider" />
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label"
                ><i class="fas fa-venus-mars"></i> Gender</span
              >
              <span class="info-value">{{ gender || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label"
                ><i class="fas fa-calendar-alt"></i> Year</span
              >
              <span class="info-value">{{ year || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label"
                ><i class="fas fa-graduation-cap"></i> Program</span
              >
              <span class="info-value">{{ course || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label"
                ><i class="fas fa-phone"></i> Contact</span
              >
              <span class="info-value">{{ contact || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label"
                ><i class="fas fa-envelope"></i> Email</span
              >
              <span class="info-value">{{ email || "N/A" }}</span>
            </div>
            <div class="info-item">
              <span class="info-label"
                ><i class="fas fa-map-marker-alt"></i> Address</span
              >
              <span class="info-value">{{ address || "N/A" }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Section -->
      <div class="lower-lower">
        <div class="details-section">
          <div class="details-card">
            <h4 class="section-title">
              <i class="fas fa-book-open"></i> Learning Preferences
            </h4>
            <hr class="divider2" />
            <div class="details-content">
              <div class="detail-item">
                <span class="detail-label">Subjects of Interest:</span>
                <span class="detail-value right-align wrap-text">{{
                  subjects || "N/A"
                }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Learning Modality:</span>
                <span class="detail-value right-align">{{
                  modality || "N/A"
                }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Learning Style:</span>
                <span class="detail-value right-align">{{
                  learnStyle || "N/A"
                }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Availability:</span>
                <span class="detail-value availability-text right-align">{{
                  availability || "N/A"
                }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Preferred Session Duration:</span>
                <span class="detail-value right-align">{{
                  sessionDur || "N/A"
                }}</span>
              </div>
            </div>
          </div>

          <div class="bio-card">
            <h4 class="section-title">
              <i class="fas fa-user-edit"></i> Bio & Goals
            </h4>
            <hr class="divider2" />
            <div class="bio-content">
              <div class="detail-item2">
                <span class="detail-label">Bio:</span>
                <span class="detail-value2 wrap-text">{{
                  bio || "No bio provided"
                }}</span>
              </div>
              <div class="detail-item2">
                <span class="detail-label">Academic Goals:</span>
                <span class="detail-value2 wrap-text">{{
                  goal || "No goals provided"
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="action-button">
          <button @click="showConfirmationModal = true">
            <i class="fas fa-paper-plane"></i> Send Offer
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="confirmation-modal-overlay">
      <div class="confirmation-modal">
        <h3>Confirm Offer</h3>
        <hr class="divider2" />
        <p>Are you sure you want to send a mentoring offer to {{ name }}?</p>
        <div class="modal-actions">
          <button
            class="modal-btn cancel"
            @click="showConfirmationModal = false"
          >
            Cancel
          </button>
          <button class="modal-btn confirm" @click="confirmSendOffer">
            Confirm
          </button>
        </div>
      </div>
    </div>
    <!-- Offer Modal -->
    <div v-if="showOffer" class="popup-overlay">
      <Offer
        :info="userDeetsForOffer"
        :mentorId="props.mentorData.user.id"
        @close="showOffer = false"
        @confirm="handleOfferConfirm"
      />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  background: white;
  border-radius: 12px;
  width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 100;
  margin-top: 3rem;
  left: 10rem;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 150;
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
  background: linear-gradient(135deg, #0c434d, #3b9aa9);
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
  padding: 1.5rem;
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
  color: #0c434d;
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
  color: #0c434d;
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
  color: #0c434d;
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
  padding: 1.25rem 0;
  margin-top: 1rem;
}

.action-button button {
  background: linear-gradient(135deg, #0c434d, #3b9aa9);
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
  box-shadow: 0 2px 8px rgba(12, 67, 77, 0.2);
  font-size: 0.9rem;
}

.action-button button:hover {
  background: linear-gradient(135deg, #0a3b44, #328c9a);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(12, 67, 77, 0.3);
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
  color: #0c434d;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.confirmation-modal p {
  margin: 1rem 0;
  color: #4b5563;
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
  transition: all 0.2s;
}

.modal-btn.cancel {
  background-color: #f0f0f0;
  color: #333;
}

.modal-btn.cancel:hover {
  background-color: #e0e0e0;
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #0c434d, #3b9aa9);
  color: white;
}

.modal-btn.confirm:hover {
  background: linear-gradient(135deg, #0a3b44, #328c9a);
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
