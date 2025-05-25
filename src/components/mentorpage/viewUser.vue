<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import Offer from "./offer.vue"; // Add this import

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

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
    const userDeets = await axios
      .get(`http://localhost:8000/api/mentor/users/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
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
        subjects.value = response.data.user_info.subjects; //response.data.user_info.subjects;
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

const userSchoolId = ref();
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
    <div class="upper-element">
      <font-awesome-icon
        @click="emit('close')"
        icon="fa-xmark"
        size="2x"
        color="white"
        style="cursor: pointer"
      />
    </div>
    <div class="lower-element">
      <div class="lower-upper">
        <div class="profile-image">
          <img
            :src="'http://localhost:8000/api/image/' + profilePic"
            alt="Profile Image"
          />
        </div>
        <div class="profile-information">
          <div>
            <h1>{{ name }}</h1>
            <p>{{ year }} - {{ course }}</p>
          </div>
          <div>
            <p>
              Gender: <strong>{{ gender }}</strong>
            </p>
            <p>
              Contact Information:
              <strong>{{ contact }}/{{ email }}</strong>
            </p>
            <p>
              Address:
              <strong>{{ address }}</strong>
            </p>
          </div>
        </div>
      </div>

      <div class="lower-lower">
        <div class="bio">
          <label>Bio</label>
          <p>{{ bio }}</p>
        </div>
        <div class="interest">
          <label>Subject of Interest</label>
          <p>{{ subjects }}</p>
        </div>
        <div class="mostyle">
          <label>Learning Modality</label>
          <p>{{ modality }}</p>
          <label>Learning Style</label>
          <p>{{ learnStyle }}</p>
        </div>
        <div class="avadura">
          <label>Days of Availability</label>
          <p>{{ availability }}</p>
          <label>Preferred Session Duration</label>
          <p>{{ sessionDur }}</p>
        </div>
        <div class="goal">
          <label>Academic Goal</label>
          <p>{{ goal }}</p>
        </div>
        <div class="action-button">
          <button @click="openOffer">Send Offer</button>
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
  display: flex;
  flex-direction: column;
  width: 775px;
  height: 600px;
  padding: 20px;
  overflow: hidden;
}

.upper-element {
  display: flex;
  justify-content: flex-end;
  background-color: #0c434d;
  padding: 20px;
  border-radius: 20px 20px 0 0;
}

.lower-element {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #edeceb;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  height: max-content;
  padding: 20px;
  border: 3px solid #0c434d;
}

.profile-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.lower-upper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 40px;
  position: relative;
  padding-bottom: 20px;
}

.lower-upper::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #066678;
  border-radius: 20px;
}

.lower-upper h1 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #0c434d;
  margin-bottom: 5px;
}

.lower-upper p {
  font-size: 0.9rem;
  color: #0c434d;
  margin-bottom: 5px;
}

.profile-image img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-information div:first-of-type {
  margin-bottom: 20px;
}

.lower-lower {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
  gap: 20px;
}

.mostyle,
.avadura {
  display: flex;
  width: 100%;
  gap: 20px;
}

label {
  color: #066678;
}

.action-button {
  display: flex;
  justify-content: flex-end;
}

.action-button button {
  background-color: #0c434d;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

/* Add these new styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}
</style>
