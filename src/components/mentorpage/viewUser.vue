<script setup>
import axios from "axios";
import api from "@/axios.js";
import { onMounted, ref } from "vue";
import Offer from "./offer.vue";
// Import loading overlay
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const baseURL = api.defaults.baseURL;

// Add loading state
const isLoading = ref(true);

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
  try {
    isLoading.value = true;

    const response = await api.get(`/api/mentor/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

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

    // Use the image_url from the API response
    imageUrl.value = response.data.image_url;

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
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  } finally {
    isLoading.value = false; // Stop loading
  }
};

// Add this function to handle offer confirmation
const confirmSendOffer = () => {
  showConfirmationModal.value = false; // Hide confirmation modal
  showOffer.value = true; // Show offer modal
};

const capitalizeFirstLetter = (str) => {
  if (!str) return "Not specified";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const parseArrayString = (str) => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed.join(", ") : str;
  } catch (e) {
    return str || "Not specified";
  }
};

const userSchoolId = ref(); // Add this to store the user school ID
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
const imageUrl = ref(); // Add this to store the Cloudinary image URL
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
    // Here you can add any additional logic needed after offer confirmation
    showOffer.value = false;
    emit("close");
  } catch (error) {}
};

onMounted(() => {
  userInfo(props.userId);
});
</script>

<template>
  <div class="wrapper" :class="{ 'no-scroll': isLoading }">
    <!-- Only render loading overlay when loading -->
    <template v-if="isLoading">
      <loading
        v-model:active="isLoading"
        :can-cancel="false"
        :is-full-page="false"
        :opacity="1"
        :color="'#006981'"
        loader="spinner"
        background-color="#ffffff"
      />
    </template>

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
            :src="imageUrl || 'https://placehold.co/600x400'"
            alt="Profile Image"
            class="profile-image"
            @error="$event.target.src = 'https://placehold.co/600x400'"
          />
        </div>

        <div class="profile-information">
          <h4 class="applicant-name">{{ name }}</h4>
          <hr class="divider" />
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label"
                ><i class="fas fa-venus-mars"></i> Sex at Birth</span
              >
              <span class="info-value">{{
                capitalizeFirstLetter(gender) || "N/A"
              }}</span>
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
                  parseArrayString(subjects) || "N/A"
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
                  parseArrayString(learnStyle) || "N/A"
                }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Availability:</span>
                <span class="detail-value availability-text right-align">{{
                  parseArrayString(availability) || "N/A"
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
/* Add this class to disable scrolling when loading */
.no-scroll {
  overflow: hidden !important;
}

/* Update your existing wrapper style */
.wrapper {
  background: white;
  border-radius: 12px;
  width: 800px;
  max-height: 80vh;
  overflow-y: auto; /* This will be disabled when .no-scroll is applied */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 100;
  margin-top: 3rem;
  left: 10rem;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Apply the same for any other scrollable elements */
.popup-overlay .offer-component {
  /* Keep existing styles */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.popup-overlay .offer-component::-webkit-scrollbar {
  display: none;
}

.no-scroll {
  overflow: hidden !important;
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
  position: sticky;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 25%
  );
  padding: 1.25rem;
  margin-top: 1rem;
  z-index: 150;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  box-sizing: border-box;
  left: 0;
  margin: 0;
  padding-right: 2rem;
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
  box-shadow: 0 2px 8px rgba(12, 67, 77, 0.3);
  font-size: 0.9rem;
}

.confirmation-modal-overlay {
  position: absolute; /* Change from fixed to absolute */
  top: 0; /* Adjust to cover the entire viewport */
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.confirmation-modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin: auto; /* Center the modal */
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

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.popup-overlay .offer-component {
  background: white;
  border-radius: 12px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.popup-overlay .offer-component::-webkit-scrollbar {
  display: none;
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

.loader-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
}

.vl-overlay {
  z-index: 1000 !important;
  pointer-events: auto !important; /* Only capture events when visible */
}

.vl-backdrop {
  pointer-events: auto !important;
  /* Rest of your styles */
}

/* When loading is complete, ensure no events are captured */
.vl-hidden {
  pointer-events: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

@media (max-width: 1400px) {
  .wrapper {
    left: 5rem;
    width: 900px;
    height: 75vh;
  }

  .confirmation-modal-overlay {
    left: 5rem;
  }
}

@media (max-width: 1200px) {
  .wrapper {
    left: 3rem;
    width: 850px;
    height: 70vh;
  }

  .confirmation-modal-overlay {
    left: 3rem;
  }

  .lower-upper {
    gap: 1.75rem;
  }
}

@media (max-width: 992px) {
  .wrapper {
    left: 1.5rem;
    width: 750px;
    height: 70vh;
    margin-top: 1.5rem;
  }

  .confirmation-modal-overlay {
    left: 1.5rem;
  }

  .profile-image {
    width: 110px;
    height: 110px;
  }
}

@media (max-width: 850px) {
  .wrapper {
    width: 90vw;
    max-width: 700px;
    height: 75vh;
    left: 50%;
    transform: translateX(-50%);
  }

  .confirmation-modal-overlay {
    left: 50%;
    transform: translateX(-50%);
    margin-left: 0;
    width: 90vw;
  }

  .details-section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .wrapper {
    width: 95%;
    max-width: 95vw;
    height: 80vh;
    margin: 1rem auto;
    left: 50%;
    transform: translateX(-50%);
  }

  .confirmation-modal-overlay {
    left: 50%;
    transform: translateX(-50%);
  }

  .lower-upper {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }

  .profile-information {
    text-align: center;
    width: 100%;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-item {
    align-items: center;
  }

  .info-value {
    margin-left: 0;
  }

  .action-button {
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .wrapper {
    height: 85vh;
    max-height: 85vh;
    border-radius: 15px;
    margin: 0;
    width: 100%;
    max-width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .profile-image {
    width: 90px;
    height: 90px;
  }

  .upper-element {
    padding: 1rem;
  }

  .modal-title {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .confirmation-modal {
    padding: 1.5rem;
    width: 85%;
  }

  .scrollable-content {
    padding: 0 1rem;
  }
}

@media (max-width: 400px) {
  .wrapper {
    height: 90vh;
    width: 43vh;
    border-radius: 15px;
  }

  .info-label,
  .info-value {
    font-size: 0.75rem;
  }

  .action-button button {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }

  .profile-image {
    width: 80px;
    height: 80px;
  }

  .details-card,
  .bio-card {
    padding: 0.75rem;
  }

  .confirmation-modal {
    width: 90%;
    padding: 1rem;
    margin-right: 2rem;
    margin-left: 2rem;
  }
  .confirmation-modal p {
    font-size: 13px;
    text-align: center;
  }
}
</style>
