<template>
  <div class="mentorinfo-container">
    <button @click="scrollToGetStarted" class="back-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
          clip-rule="evenodd"
        />
      </svg>
      Back
    </button>

    <header class="page-header">
      <h1>MENTOR INFO</h1>
      <p>Complete your profile to start mentoring.</p>
    </header>

    <div class="form-container scrollable-content">
      <!-- Step 1 Content -->
      <div v-if="currentStep === 1">
        <h2 class="title">I. PERSONAL INFORMATION</h2>

        <div class="personal-field">
          <!-- For Address -->
          <label class="personal-label required" for="address">ADDRESS</label>
          <input
            type="text"
            id="address"
            v-model="address"
            @input="validateField('address', address)"
            @blur="validateField('address', address)"
            :disabled="isSubmitting"
            placeholder="Enter your address"
            class="personal-input"
            :class="{ error: validationErrors.address }"
          />
          <span v-if="validationErrors.address" class="validation-message">
            {{ validationErrors.address }}
          </span>
        </div>

        <div class="personal-field">
          <!-- For Contact Number -->
          <label class="personal-label required" for="contact-number"
            >CONTACT NUMBER</label
          >
          <input
            type="text"
            id="contact-number"
            v-model="contactNumber"
            @input="validateField('contactNumber', contactNumber)"
            @blur="validateField('contactNumber', contactNumber)"
            placeholder="Enter your contact number (11 digits)"
            :disabled="isSubmitting"
            class="personal-input"
            :class="{ error: validationErrors.contactNumber }"
            maxlength="11"
          />
          <span
            v-if="validationErrors.contactNumber"
            class="validation-message"
          >
            {{ validationErrors.contactNumber }}
          </span>
        </div>

        <div class="personal-field">
          <!-- For Gender -->
          <label class="personal-label required" for="gender"
            >SEX AT BIRTH</label
          >
          <div class="gender-dropdown">
            <div class="dropdown-container" @click="toggleDropdown('gender')">
              <input
                type="text"
                v-model="gender"
                placeholder="Select your sex"
                class="personal-input"
                :disabled="isSubmitting"
                readonly
              />
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div v-if="dropdownOpen.gender" class="dropdown-options">
              <div class="dropdown-option" @click="selectGender('Female')">
                Female
              </div>
              <div class="dropdown-option" @click="selectGender('Male')">
                Male
              </div>
            </div>
            <span v-if="validationErrors.gender" class="validation-message">
              {{ validationErrors.gender }}
            </span>
          </div>
        </div>

        <div class="personal-field">
          <label class="personal-label" for="year-level">YEAR LEVEL </label>
          <div class="year-dropdown">
            <div
              class="dropdown-container"
              @click="toggleDropdown('yearLevel')"
            >
              <input
                type="text"
                v-model="yearLevel"
                :disabled="isSubmitting"
                placeholder="Select your year level"
                class="personal-input"
                readonly
              />
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div v-if="dropdownOpen.yearLevel" class="dropdown-options">
              <div class="dropdown-option" @click="selectYearLevel('1st Year')">
                1st Year
              </div>
              <div class="dropdown-option" @click="selectYearLevel('2nd Year')">
                2nd Year
              </div>
              <div class="dropdown-option" @click="selectYearLevel('3rd Year')">
                3rd Year
              </div>
              <div class="dropdown-option" @click="selectYearLevel('4th Year')">
                4th Year
              </div>
            </div>
          </div>
        </div>
        <div class="personal-field">
          <label class="personal-label" for="program">PROGRAM </label>
          <div class="program-dropdown">
            <div class="dropdown-container" @click="toggleDropdown('program')">
              <input
                type="text"
                v-model="program"
                placeholder="Select your program"
                :disabled="isSubmitting"
                class="personal-input"
                readonly
              />
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div v-if="dropdownOpen.program" class="dropdown-options">
              <div
                class="dropdown-option"
                @click="
                  selectProgram(
                    'Bachelor of Science in Information Technology (BSIT)'
                  )
                "
              >
                Bachelor of Science in Information Technology (BSIT)
              </div>
              <div
                class="dropdown-option"
                @click="
                  selectProgram(
                    'Bachelor of Science in Computer Science (BSCS)'
                  )
                "
              >
                Bachelor of Science in Computer Science (BSCS)
              </div>
              <div
                class="dropdown-option"
                @click="
                  selectProgram(
                    'Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)'
                  )
                "
              >
                Bachelor of Science in Entertainment and Multimedia Computing
                (BSEMC)
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2 Content -->
      <div v-if="currentStep === 2">
        <h2 class="title">II. PROFILE INFORMATION</h2>

        <!-- Profile Picture and Credentials Upload -->
        <div class="upload-container">
          <div class="profile-picture-upload">
            <label class="profile-label">PROFILE PICTURE</label>
            <div class="upload-controls" @click="uploadProfilePicture">
              <div class="profile-preview-container">
                <img
                  v-if="profileImage"
                  :src="profileImage"
                  alt="Profile Preview"
                  class="profile-preview"
                />
                <i v-else class="fas fa-user-circle default-icon"></i>
              </div>
              <div class="upload-text">
                <div class="choose-file-container">
                  <i class="fas fa-upload"></i>
                  <span>Choose File</span>
                </div>
                <input
                  type="file"
                  ref="profileInput"
                  accept="image/*"
                  style="display: none"
                  :disabled="isSubmitting"
                  @change="handleProfileUpload"
                />
                <span
                  class="file-name"
                  style="
                    max-width: 150px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                  >{{ profilePictureName || "No file chosen" }}</span
                >
              </div>
            </div>
          </div>

          <div class="credentials-upload">
            <label class="profile-label">CREDENTIALS</label>
            <div class="upload-controls">
              <i class="fas fa-file-upload upload-icon"></i>
              <div class="choose-file-container" @click="uploadCredentials">
                <span>Upload Credentials</span>
              </div>
              <input
                type="file"
                ref="credentialInput"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                :disabled="isSubmitting"
                style="display: none"
                @change="handleCredentialUpload"
              />
              <a href="#" @click.prevent="toggleFileList" class="file-link"
                >View Uploaded Files ({{ credentials.length }})</a
              >
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="profile-field">
          <label class="profile-label" for="availability-days"
            >DAYS OF AVAILABILITY</label
          >
          <div class="availability-dropdown">
            <div
              class="dropdown-container"
              @click="toggleDropdown('availability')"
            >
              <input
                type="text"
                id="availability-days"
                v-model="availabilityDaysDisplay"
                :disabled="isSubmitting"
                placeholder="Select available days"
                class="profile-input"
                readonly
              />
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div
              v-if="dropdownOpen.availability"
              class="dropdown-options availability-options"
            >
              <div
                v-for="day in daysOfWeek"
                :key="day"
                class="dropdown-option availability-option"
              >
                <input
                  type="checkbox"
                  :id="'day-' + day"
                  :value="day"
                  :disabled="isSubmitting"
                  v-model="selectedDays"
                  @click.stop
                />
                <label :for="'day-' + day">{{ day }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-field">
          <!-- For Subjects Offered -->
          <label class="profile-label required">SUBJECTS OFFERED</label>
          <div class="dropdown-wrapper">
            <div class="dropdown-trigger" @click="toggleSubjectDropdown">
              <input
                type="text"
                :placeholder="
                  selectedSubjects.length
                    ? `${selectedSubjects.length} subjects selected`
                    : 'Select subjects'
                "
                readonly
                class="profile-input"
                :disabled="isSubmitting"
                :class="{ error: validationErrors.selectedSubjects }"
              />
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>

            <div v-if="showCategories" class="dropdown-menu categories">
              <div
                v-for="category in categories"
                :key="category.type"
                class="dropdown-item"
                @click="selectCategory(category)"
              >
                {{ category.name }}
                <span
                  v-if="selectedSubjectsCount[category.type]"
                  class="count-badge"
                >
                  {{ selectedSubjectsCount[category.type] }}
                </span>
              </div>
            </div>

            <div v-if="showSubjectsDropdown" class="dropdown-menu subjects">
              <div
                v-for="subject in currentSubjects"
                :key="subject"
                class="dropdown-item subject-item"
              >
                <input
                  type="checkbox"
                  :id="subject"
                  :disabled="isSubmitting"
                  :value="subject"
                  v-model="selectedSubjects"
                  @change="updateSelectedCounts"
                />
                <label :for="subject">{{ subject }}</label>
              </div>
              <div
                v-if="currentSubjects.length === 0"
                class="dropdown-item no-subjects"
              >
                No subjects available
              </div>
            </div>
          </div>
          <span
            v-if="validationErrors.selectedSubjects"
            class="validation-message"
          >
            {{ validationErrors.selectedSubjects }}
          </span>
        </div>

        <div class="profile-field">
          <label class="profile-label" for="teaching-style"
            >TEACHING STYLE
          </label>
          <div class="teaching-style-dropdown">
            <div
              class="dropdown-container"
              @click="toggleDropdown('learningStyle')"
            >
              <input
                type="text"
                id="teaching-style"
                :disabled="isSubmitting"
                v-model="learningStyleDisplay"
                placeholder="Select teaching style(s)"
                class="profile-input"
                readonly
              />
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div
              v-if="dropdownOpen.learningStyle"
              class="dropdown-options teaching-style-options"
            >
              <div
                v-for="style in sessionStyles"
                :key="style"
                class="dropdown-option teaching-style-option"
              >
                <input
                  type="checkbox"
                  :id="'style-' + style"
                  :value="style"
                  :disabled="isSubmitting"
                  v-model="selectedsessionStyles"
                  @click.stop
                />
                <label :for="'style-' + style">{{ style }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-field">
          <!-- For Teaching Modality -->
          <label class="profile-label required" for="modality"
            >TEACHING MODALITY</label
          >
          <div class="subjmodality-dropdown">
            <div class="dropdown-container" @click="toggleDropdown('modality')">
              <input
                type="text"
                v-model="modality"
                placeholder="Select teaching modality"
                class="profile-input"
                :disabled="isSubmitting"
                readonly
              />
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div v-if="dropdownOpen.modality" class="dropdown-options">
              <div class="dropdown-option" @click="selectModality('Online')">
                Online
              </div>
              <div class="dropdown-option" @click="selectModality('In-person')">
                In-person
              </div>
              <div class="dropdown-option" @click="selectModality('Hybrid')">
                Hybrid
              </div>
            </div>
          </div>
        </div>

        <div class="profile-field">
          <label class="profile-label" for="session-duration"
            >PREFERRED SESSION DURATION
          </label>
          <div class="session-duration-dropdown">
            <div
              class="dropdown-container"
              @click="toggleDropdown('sessionDuration')"
            >
              <input
                type="text"
                v-model="sessionDuration"
                placeholder="Select duration"
                :disabled="isSubmitting"
                class="profile-input"
                readonly
              />
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div v-if="dropdownOpen.sessionDuration" class="dropdown-options">
              <div
                class="dropdown-option"
                @click="selectSessionDuration('1 hour')"
              >
                1 hour
              </div>
              <div
                class="dropdown-option"
                @click="selectSessionDuration('2 hours')"
              >
                2 hours
              </div>
              <div
                class="dropdown-option"
                @click="selectSessionDuration('3 hours')"
              >
                3 hours
              </div>
            </div>
          </div>
        </div>

        <div class="profile-field">
          <label class="profile-label" for="proficiency"
            >PROFICIENCY LEVEL
          </label>
          <div class="proficiency-dropdown">
            <div
              class="dropdown-container"
              @click="toggleDropdown('proficiency')"
            >
              <input
                type="text"
                v-model="proficiency"
                placeholder="Select proficiency level"
                class="profile-input"
                :disabled="isSubmitting"
                readonly
              />
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div v-if="dropdownOpen.proficiency" class="dropdown-options">
              <div
                class="dropdown-option"
                @click="selectProficiency('Beginner')"
              >
                Beginner
              </div>
              <div
                class="dropdown-option"
                @click="selectProficiency('Intermediate')"
              >
                Intermediate
              </div>
              <div
                class="dropdown-option"
                @click="selectProficiency('Advanced')"
              >
                Advanced
              </div>
            </div>
          </div>
        </div>

        <div class="profile-field">
          <!-- For Bio -->
          <label class="profile-label required" for="bio">SHORT BIO</label>
          <textarea
            id="bio"
            v-model="bio"
            @input="validateField('bio', bio)"
            @blur="validateField('bio', bio)"
            placeholder="Tell us about yourself (50-500 characters)"
            :disabled="isSubmitting"
            rows="4"
            class="profile-textarea"
            :class="{ error: validationErrors.bio }"
          ></textarea>
          <span v-if="validationErrors.bio" class="validation-message">
            {{ validationErrors.bio }}
          </span>
        </div>

        <div class="profile-field">
          <!-- For Experience -->
          <label class="profile-label required" for="experience"
            >TUTORING EXPERIENCE</label
          >
          <textarea
            id="goals"
            v-model="experience"
            @input="validateField('experience', experience)"
            @blur="validateField('experience', experience)"
            :disabled="isSubmitting"
            placeholder="Describe your tutoring experience (50-500 characters)"
            rows="4"
            class="profile-textarea"
            :class="{ error: validationErrors.goals }"
          ></textarea>
          <span v-if="validationErrors.goals" class="validation-message">
            {{ validationErrors.goals }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Step Indicator -->
  <div class="step-indicator-container">
    <div class="step-indicator">
      <div
        v-for="step in totalSteps"
        :key="step"
        :class="[
          'step',
          { active: step === currentStep, completed: step < currentStep },
        ]"
        @click="goToStep(step)"
      ></div>
    </div>

    <button
      class="next-button"
      @click="nextStep"
      :class="{ loading: isSubmitting, active: isButtonActive }"
      @mousedown="setButtonActive(true)"
      @mouseup="setButtonActive(false)"
      @mouseleave="setButtonActive(false)"
    >
      <span v-if="isSubmitting" class="loading-spinner"></span>
      {{
        isSubmitting
          ? "Submitting..."
          : currentStep === totalSteps
          ? "SUBMIT"
          : "NEXT"
      }}
    </button>
  </div>

  <!-- File List Modal -->
  <div v-if="showFileList" class="Credmodal-overlay" @click="closeFileList">
    <div class="Credmodal-content" @click.stop>
      <h3>Uploaded Files</h3>
      <ul class="file-list">
        <li v-for="(file, index) in credentials" :key="index">
          <span class="file-info">
            <i class="fas fa-file-alt"></i>
            {{ file.name }}
          </span>
          <button @click.stop="deleteCredential(index)">
            <i class="fas fa-trash-alt"></i>
          </button>
        </li>
      </ul>
      <div style="display: flex; justify-content: center; width: 100%">
        <button class="close-button" @click="closeFileList">Close</button>
      </div>
    </div>
  </div>

  <!-- Application Status Popup -->
  <div v-if="showStatusPopup" class="status-popup-overlay">
    <div class="status-popup-content">
      <h3>APPLICATION STATUS</h3>
      <p class="status-text">
        Your mentor application is under review. You will receive an email once
        it's approved. Thank you!
      </p>
      <button class="proceed-button" @click="proceedToHome">
        PROCEED TO HOME
      </button>
    </div>
  </div>
</template>

<script>
import { registrationStore } from "@/stores/registrationStore.js"; // Adjust the import path as necessary
import api from "@/axios.js";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

// axios.default.withCredentials = true; // Enable sending cookies with requests
// axios.default.withXSRFToken = true; // Enable CSRF token handling

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default {
  data() {
    return {
      currentStep: 1,
      totalSteps: 2,
      //fullName: "",
      gender: "",
      otherGender: "",
      yearLevel: "",
      program: "",
      contactNumber: "",
      address: "",
      selectedSubjects: [],
      availableSubjects: {
        coreSubjects: [],
        gecSubjects: [],
        peNstpSubjects: [],
      },
      modality: "",
      selectedDays: [],
      daysOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      bio: "",
      proficiency: "",
      selectedsessionStyles: [],
      sessionStyles: [
        "Lecture-Based",
        "Interactive Discussion (hands-on)",
        "Q&A Session",
        "Demonstration",
        "Project-based",
        "Step-by-step process",
      ],
      sessionDuration: "",
      experience: "",
      profileImage: null,
      profilePictureName: "",
      credentials: [],
      showFileList: false,

      categories: [
        { type: "core", name: "Core Subjects" },
        { type: "gec", name: "General Education Course" },
        { type: "peNstp", name: "Physical Education & NSTP" },
      ],
      showCategories: false,
      showSubjectsDropdown: false,
      currentSubjects: [],
      selectedSubjectCategory: "",
      selectedSubjectsCount: {
        core: 0,
        gec: 0,
        peNstp: 0,
      },

      dropdownOpen: {
        gender: false,
        yearLevel: false,
        program: false,
        modality: false,
        proficiency: false,
        availability: false,
        learningStyle: false,
        sessionDuration: false,
      },
      programs: [
        "Bachelor of Science in Information Technology (BSIT)",
        "Bachelor of Science in Computer Science (BSCS)",
        "Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)",
      ],
      showStatusPopup: false,
      isSubmitted: false,
      isSubmitting: false,
      isButtonActive: false,
      validationErrors: {
        fullName: "",
        address: "",
        gender: "",
        yearLevel: "",
        program: "",
        contactNumber: "",
        selectedSubjects: "",
        modality: "",
        selectedDays: "",
        selectedsessionStyles: "",
        sessionDuration: "",
        bio: "",
        goals: "",
        profileImage: "",
      },
      validationRules: {
        fullName: {
          pattern: /^[a-zA-Z\s.]{5,50}$/,
          message:
            "Full name should contain only letters, spaces, and periods (5-50 characters)",
        },
        address: {
          minLength: 10,
          message: "Address should be at least 10 characters long",
        },
        contactNumber: {
          pattern: /^09\d{9}$/,
          message: "Contact number should start with 09 and have 11 digits",
        },
        bio: {
          minLength: 50,
          maxLength: 500,
          message: "Bio should be between 50-500 characters",
        },
        goals: {
          minLength: 50,
          maxLength: 500,
          message: "Goals should be between 50-500 characters",
        },
      },
    };
  },

  computed: {
    availabilityDaysDisplay() {
      return this.selectedDays.join(", ") || "Select available days";
    },
    learningStyleDisplay() {
      return (
        this.selectedsessionStyles.join(", ") || "Select teaching style(s)"
      );
    },
    isFormComplete() {
      if (this.currentStep === 1) {
        return (
          this.fullName.trim() &&
          this.gender &&
          (this.gender !== "Other" || this.otherGender.trim()) &&
          this.yearLevel &&
          this.program &&
          this.contactNumber?.length === 11 &&
          this.address.trim()
        );
      }
      return (
        this.selectedSubjects.length > 0 &&
        this.modality &&
        this.selectedDays.length > 0 &&
        this.selectedsessionStyles.length > 0 &&
        this.proficiency &&
        this.sessionDuration &&
        this.bio.trim() &&
        this.experience.trim() &&
        this.profileImage &&
        this.credentials.length > 0
      );
    },
  },

  methods: {
    setButtonActive(active) {
      if (!this.isSubmitting) {
        this.isButtonActive = active;
      }
    },
    async csrf() {
      await axios
        .get("/sanctum/csrf-cookie")
        .then((response) => {})
        .catch((error) => {});
    },
    toggleSubjectDropdown() {
      this.showCategories = !this.showCategories;
      this.showSubjectsDropdown = false;
    },

    selectCategory(category) {
      this.selectedSubjectCategory = category.name;
      this.showCategories = false;
      this.showSubjects(category.type);
      this.updateSelectedCounts();
    },

    showSubjects(categoryType) {
      switch (categoryType) {
        case "core":
          this.currentSubjects = this.availableSubjects.coreSubjects;
          break;
        case "gec":
          this.currentSubjects = this.availableSubjects.gecSubjects;
          break;
        case "peNstp":
          this.currentSubjects = this.availableSubjects.peNstpSubjects;
          break;
      }
      this.showSubjectsDropdown = true;
    },

    updateSelectedCounts() {
      this.selectedSubjectsCount.core = this.selectedSubjects.filter((sub) =>
        this.availableSubjects.coreSubjects.includes(sub)
      ).length;

      this.selectedSubjectsCount.gec = this.selectedSubjects.filter((sub) =>
        this.availableSubjects.gecSubjects.includes(sub)
      ).length;

      this.selectedSubjectsCount.peNstp = this.selectedSubjects.filter((sub) =>
        this.availableSubjects.peNstpSubjects.includes(sub)
      ).length;
    },

    validateForm() {
      const errors = [];

      if (this.currentStep === 1) {
        // if (!this.fullName.trim()) errors.push("Full Name is required");
        if (!this.gender) errors.push("Gender is required");
        if (this.gender === "Other" && !this.otherGender.trim())
          errors.push("Please specify your gender");
        if (!this.yearLevel) errors.push("Year Level is required");
        if (!this.program) errors.push("Program is required");
        if (!this.contactNumber || this.contactNumber.length !== 11)
          errors.push("Valid Contact Number is required (11 digits)");
        if (!this.address.trim()) errors.push("Address is required");
      }

      if (this.currentStep === 2) {
        if (this.selectedSubjects.length === 0)
          errors.push("At least one subject is required");
        if (!this.modality) errors.push("Teaching Modality is required");
        if (this.selectedDays.length === 0)
          errors.push("At least one day of availability is required");
        if (this.selectedsessionStyles.length === 0)
          errors.push("At least one teaching style is required");
        if (!this.proficiency) errors.push("Proficiency level is required");
        if (!this.sessionDuration)
          errors.push("Preferred Session Duration is required");
        if (!this.bio.trim()) errors.push("Short Bio is required");
        if (!this.experience.trim())
          errors.push("Tutoring experience is required");
        if (!this.profileImage) errors.push("Profile Picture is required");
        if (this.credentials.length === 0)
          errors.push("At least one credential is required");
      }

      return errors;
    },

    toggleDropdown(type) {
      for (const key in this.dropdownOpen) {
        this.dropdownOpen[key] = key === type ? !this.dropdownOpen[key] : false;
      }
    },

    selectGender(selectedGender) {
      this.gender = selectedGender;
      this.dropdownOpen.gender = false;
    },

    selectYearLevel(selectedYear) {
      this.yearLevel = selectedYear;
      this.dropdownOpen.yearLevel = false;
    },

    selectProgram(selectedProgram) {
      this.program = selectedProgram;
      this.dropdownOpen.program = false;
      this.updateAvailableSubjects();
    },

    selectModality(selectedModality) {
      this.modality = selectedModality;
      this.dropdownOpen.modality = false;
    },

    selectProficiency(selectedProficiency) {
      this.proficiency = selectedProficiency;
      this.dropdownOpen.proficiency = false;
    },

    selectSessionDuration(duration) {
      this.sessionDuration = duration;
      this.dropdownOpen.sessionDuration = false;
    },

    nextStep() {
      if (this.isSubmitting) return;
      const validationErrors = this.validateForm();

      if (validationErrors.length > 0) {
        alert(
          "Please complete all required fields before proceeding:\n\n" +
            validationErrors.join("\n")
        );
        return;
      }

      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      } else {
        this.submitApplication();
      }
    },

    goToStep(step) {
      if (step <= this.currentStep) {
        this.currentStep = step;
      }
    },

    uploadProfilePicture() {
      this.$refs.profileInput.click();
    },

    handleProfileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.match("image.*")) {
          alert("Please select an image file");
          return;
        }

        if (file.size > 2000000) {
          alert("File size should be less than 2MB");
          return;
        }

        this.profilePictureName = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    uploadCredentials() {
      this.$refs.credentialInput.click();
    },

    handleCredentialUpload(event) {
      const files = Array.from(event.target.files);
      this.credentials.push(...files);
    },

    deleteCredential(index) {
      this.credentials.splice(index, 1);
    },

    toggleFileList() {
      this.showFileList = !this.showFileList;
    },

    closeFileList() {
      this.showFileList = false;
    },

    updateAvailableSubjects() {
      switch (this.program) {
        case "Bachelor of Science in Information Technology (BSIT)":
          this.availableSubjects = {
            coreSubjects: [
              "Application Development and Emerging Technologies",
              "Business Analytics",
              "Computer Programming 1",
              "Computer Programming 2",
              "Data Structures and Algorithms",
              "Digital Design with Multimedia Systems",
              "Discrete Structures 1",
              "Event Driven Programming",
              "Fundamentals of Database Systems",
              "Information Assurance and Security 1",
              "Information Assurance and Security 2",
              "Information Management 1",
              "Integrative Programming and Technologies",
              "Introduction to Computing",
              "Introduction to Human-Computer Interaction",
              "IT Elective 1",
              "IT Elective 2",
              "IT Elective 3",
              "IT Elective 4",
              "IT Elective 5",
              "IT Research Methods",
              "IT Seminars and Educational Trips",
              "Networking 1",
              "Networking 2",
              "Object-Oriented Programming",
              "PC Troubleshooting with Basic Electronics",
              "Platform Technologies",
              "Quantitative Methods (Inc. Modelling & Simulation)",
              "Social Issues and Professional Practice in Computing",
              "System Administration and Maintenance",
              "Systems Integration and Architecture 1",
            ],
            gecSubjects: [
              "Art Appreciation",
              "Ethics",
              "Mathematics in the Modern World",
              "People and Earth's Ecosystem",
              "Purposive Communication",
              "Reading Visual Arts",
              "Readings in Philippine History with Indigenous People Studies",
              "Science, Technology and Society",
              "The Contemporary World with Peace Studies",
              "The Entrepreneurial Mind",
              "The Life and Works of Rizal",
              "Understanding the Self",
            ],
            peNstpSubjects: [
              "National Service Training Program with Anti-Smoking and Environmental Education",
              "National Service Training Program with GAD and Peace Education",
              "Physical Activities Toward Health and Fitness 1 (PATHFit 1): Movement Competency",
              "Physical Activities Toward Health and Fitness 2 (PATHFit 2): Exercise-Based Fitness Activities",
              "Physical Activities Toward Health and Fitness 3 (PATHFit 3)",
              "Physical Activities Toward Health and Fitness 4 (PATHFit 4)",
            ],
          };
          break;

        case "Bachelor of Science in Computer Science (BSCS)":
          this.availableSubjects = {
            coreSubjects: [
              "Computer Programming 1",
              "Computer Programming 2",
              "Introduction to Computing",
              "PC Troubleshooting with Basic Electronics",
              "Data Structures and Algorithms",
              "Algorithms and Complexity 1",
              "Software Engineering 1",
              "Software Engineering 2",
              "Operating Systems",
              "Object-Oriented Programming",
              "Information Management 1",
              "Discrete Structures 1",
              "Discrete Structures 2",
              "Principles of Statistics and Probability",
              "Graphics and Visual Computing",
              "Automata Theory",
              "Intelligent Systems",
              "Programming Languages",
              "Parallel and Distributed Computing",
              "Architecture and Organization",
              "Information Assurance and Security",
              "CS Thesis Writing 1",
              "CS Thesis Writing 2",
              "CS Elective 1",
              "CS Elective 2",
              "CS Elective 3",
              "CS Elective 4",
              "CS Elective 5",
              "CS Seminars and Educational Trips",
            ],
            gecSubjects: [
              "Art Appreciation",
              "Ethics",
              "Mathematics in the Modern World",
              "People and Earth's Ecosystem",
              "Purposive Communication",
              "Reading Visual Arts",
              "Readings in Philippine History with Indigenous People Studies",
              "Science, Technology and Society",
              "The Contemporary World with Peace Studies",
              "The Entrepreneurial Mind",
              "The Life and Works of Rizal",
              "Understanding the Self",
            ],
            peNstpSubjects: [
              "National Service Training Program 1",
              "National Service Training Program 2",
              "Physical Activities Toward Health and Fitness 1 (PATHFit 1): Movement Competency",
              "Physical Activities Toward Health and Fitness 2 (PATHFit 2): Exercise-Based Fitness Activities",
              "Physical Activities Toward Health and Fitness 3 (PATHFit 3)",
              "Physical Activities Toward Health and Fitness 4 (PATHFit 4)",
            ],
          };
          break;

        case "Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)":
          this.availableSubjects = {
            coreSubjects: [
              "Introduction to EM Computing",
              "Computer Programming 1",
              "PC Troubleshooting with Basic Electronics",
              "Computer Programming 2",
              "Usability, HCI, UI Design",
              "Free Hand and Digital Drawing",
              "Data Structures and Algorithms",
              "Information Management 1",
              "Introduction to Game Design and Development",
              "Computer Graphics Programming",
              "Image and Video Processing",
              "Script Writing and Storyboard Design",
              "Applications Development and Emerging Technologies",
              "Principles of 2D Animation",
              "Audio Design and Sound Engineering Modelling and Rigging",
              "Texture and Mapping",
              "Social Issues and Professional Practice in Computing",
              "Lighting and Effects",
              "Principles of 3D Animation",
              "Design and Production Process",
              "Advanced Sound Production",
              "Advanced 2D Animation",
              "EMC Professional Elective 1",
              "Research Methods",
              "Advanced 3D Animation and Scripting",
              "Compositing and Rendering",
              "EMC Professional Elective 2",
              "Animation Design and Production",
              "EMC Professional Elective 3",
              "Computing Seminars and Educational Trips",
            ],
            gecSubjects: [
              "Art Appreciation",
              "Ethics",
              "Mathematics in the Modern World",
              "People and Earth's Ecosystem",
              "Purposive Communication",
              "Reading Visual Arts",
              "Readings in Philippine History with Indigenous People Studies",
              "Science, Technology and Society",
              "The Contemporary World with Peace Studies",
              "The Entrepreneurial Mind",
              "The Life and Works of Rizal",
              "Understanding the Self",
            ],
            peNstpSubjects: [
              "National Service Training Program with Anti-Smoking and Environmental Education",
              "National Service Training Program with GAD and Peace Education",
              "Physical Activities Toward Health and Fitness 1 (PATHFit 1): Movement Competency",
              "Physical Activities Toward Health and Fitness 2 (PATHFit 2): Exercise-Based Fitness Activities",
              "Physical Activities Toward Health and Fitness 3 (PATHFit 3)",
              "Physical Activities Toward Health and Fitness 4 (PATHFit 4)",
            ],
          };
          break;

        default:
          this.availableSubjects = {
            coreSubjects: [],
            gecSubjects: [],
            peNstpSubjects: [],
          };
      }
      this.updateSelectedCounts();
    },

    validateContactNumber() {
      this.contactNumber = this.contactNumber.replace(/\D/g, "");

      if (this.contactNumber.length > 11) {
        this.contactNumber = this.contactNumber.slice(0, 11);
      }
    },

    async submitApplication() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      const finalValidationErrors = this.validateForm();
      const store = registrationStore();

      if (finalValidationErrors.length > 0) {
        alert(
          "Please complete all required fields before submitting:\n\n" +
            finalValidationErrors.join("\n")
        );
        return;
      }

      try {
        // First API call - Set secondary role
        try {
          const secondaryRoleResponse = await api.post(
            "/api/set/2nd_role",
            {},
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
        } catch (error) {
          throw new Error("Failed to set secondary role");
        }

        // Second API call - Mentor registration
        const formData = new FormData();
        // formData.append("email", store.registrationData.email); // Corrected property
        // formData.append("password", store.registrationData.password); // Corrected property
        // formData.append(
        //   "password_confirmation",
        //   store.registrationData.password_confirmation
        // ); // Corrected property
        // formData.append("role", store.registrationData.role); // Corrected property
        // formData.append("name", this.fullName);
        formData.append(
          "gender",
          this.gender === "Other" ? this.otherGender : this.gender
        );
        formData.append("year", this.yearLevel);
        formData.append("course", this.program);
        formData.append("phoneNum", this.contactNumber);
        formData.append("address", this.address);
        formData.append("subjects", JSON.stringify(this.selectedSubjects)); // Convert array to JSON string
        formData.append("learn_modality", this.modality);
        formData.append("availability", JSON.stringify(this.selectedDays)); // Convert array to JSON string
        formData.append("bio", this.bio);
        formData.append(
          "teach_sty",
          JSON.stringify(this.selectedsessionStyles)
        ); // Convert array to JSON string
        formData.append("prefSessDur", this.sessionDuration);
        formData.append("exp", this.experience);
        formData.append("proficiency", this.proficiency); // Added proficiency level
        formData.append(
          "credentials",
          JSON.stringify(this.credentials.map((file) => file.name))
        ); // Convert array to JSON string

        // Ensure profileImage is a file
        if (this.$refs.profileInput.files[0]) {
          formData.append("image", this.$refs.profileInput.files[0]);
        } else {
          throw new Error("Profile image is missing or invalid.");
        }

        this.credentials.forEach((file, index) => {
          formData.append(`credentials[${index}]`, file);
        });

        // First API call - Mentor registration
        await api
          .post("/api/mentor/register/2nd", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              accept: "application/json",
            },
          })
          .then((response) => {});

        // Second API call - Set secondary role
        try {
          const response = await api
            .post("/api/set/2nd_role", {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
            .then((response) => {
              createToast("Second Role Set Successfully!", {
                position: "bottom-right",
                type: "success",
                transition: "slide",
                timeout: 2000,
                showIcon: true,
                toastBackgroundColor: "#319cb0",
              });
            });
        } catch (error) {
          createToast("Registration failed!", {
            position: "bottom-right",
            type: "danger",
            transition: "slide",
            timeout: 2000,
            showIcon: true,
          });
          return null;
        }

        this.sendEmailToAdmin(formData);
        this.showStatusPopup = true;
        this.isSubmitted = true;
      } catch (error) {
        alert(
          "An error occurred while submitting your application. Please try again."
        );
      } finally {
        this.isSubmitting = false;
        this.setButtonActive(false);
      }
    },

    sendEmailToAdmin(formData) {},

    closeStatusPopup() {
      this.showStatusPopup = false;
    },

    proceedToHome() {
      this.$router.push("/");
    },

    validateField(field, value) {
      const rules = this.validationRules[field];
      if (!rules) return;

      if (rules.pattern && !rules.pattern.test(value)) {
        this.validationErrors[field] = rules.message;
        return false;
      }

      if (rules.minLength && value.length < rules.minLength) {
        this.validationErrors[field] = rules.message;
        return false;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        this.validationErrors[field] = rules.message;
        return false;
      }

      this.validationErrors[field] = "";
      return true;
    },

    validateSelections() {
      // Subjects validation
      if (this.selectedSubjects.length === 0) {
        this.validationErrors.selectedSubjects =
          "Please select at least one subject";
      } else {
        this.validationErrors.selectedSubjects = "";
      }

      // Days validation
      if (this.selectedDays.length === 0) {
        this.validationErrors.selectedDays = "Please select at least one day";
      } else {
        this.validationErrors.selectedDays = "";
      }

      // Learning styles validation
      if (this.selectedsessionStyles.length === 0) {
        this.validationErrors.selectedsessionStyles =
          "Please select at least one learning style";
      } else {
        this.validationErrors.selectedsessionStyles = "";
      }
    },
  },

  mounted() {
    this.csrf();
  },

  watch: {
    fullName(newVal) {
      this.validateField("fullName", newVal);
    },
    address(newVal) {
      this.validateField("address", newVal);
    },
    contactNumber(newVal) {
      this.validateField("contactNumber", newVal);
    },
    bio(newVal) {
      this.validateField("bio", newVal);
    },
    experience(newVal) {
      this.validateField("experience", newVal);
    },
    selectedSubjects: {
      handler() {
        this.validateSelections();
      },
      deep: true,
    },
    selectedDays: {
      handler() {
        this.validateSelections();
      },
      deep: true,
    },
    selectedsessionStyles: {
      handler() {
        this.validateSelections();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Montserrat", sans-serif;
}

html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  color: white;
}

.mentorinfo-container {
  background-image: url("@/assets/bg.png");
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  overflow: hidden;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #02475e;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3);
}

.page-header p {
  color: #02475e;
  font-weight: 500;
  font-size: 0.9rem;
}

.back-btn {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(44, 62, 80, 0.1);
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  color: #2c3e50;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.back-btn svg {
  width: 1.2rem;
  height: 1.2rem;
  transition: transform 0.3s ease;
}

.back-btn:hover {
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  transform: translateX(-2px);
}

.back-btn:hover svg {
  transform: translateX(-4px);
}

.form-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 100%;
  min-height: 610px;
  max-height: 800px;
  background: rgba(255, 255, 255, 0.724);
  border-radius: 40px;
  box-shadow: 2px 2px 4px 4px rgba(29, 61, 113, 0.3);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #02475e transparent;
}

.form-container::-webkit-scrollbar {
  width: 10px;
}

.form-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  margin: 10px;
}

.form-container::-webkit-scrollbar-thumb {
  background: linear-gradient(
    45deg,
    rgba(2, 71, 94, 0.6) 0%,
    rgba(6, 102, 120, 0.6) 100%
  );
  border: 1px solid #02475e;
  border-radius: 4px;
}

.form-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #033a4b, #044c5c);
}

.form-content {
  padding-bottom: 80px;
}

.title {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #02475e;
  padding: 1.5rem 4rem 1rem;
  color: #ffffff;
  font-size: 1.6rem;
  margin: 0 -1.5rem 1.5rem;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
}

.personal-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-left: 5.5rem;
  padding-right: 5.5rem;
}

.personal-label {
  color: #02475e;
  font-weight: 600;
  font-size: 0.85rem;
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
}

.personal-input,
.profile-input,
.gender-specify {
  padding: 0.7rem;
  border-radius: 15px;
  border: 1px solid rgb(12, 4, 102);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
  background: #e8f0fe;
  color: rgba(24, 37, 69, 0.842);
  width: 100%;
  transition: all 0.2s ease;
  text-align: left;
  font-weight: 600;
}

.personal-input::placeholder,
.profile-input::placeholder,
.gender-specify::placeholder {
  color: rgba(15, 31, 70, 0.683);
  font-size: 0.8rem;
}

.personal-input:focus,
.profile-input:focus,
.gender-specify:focus {
  outline: none;
  border-color: rgba(2, 71, 94, 0.8);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
}

.gender-dropdown,
.year-dropdown,
.program-dropdown,
.subjmodality-dropdown,
.proficiency-dropdown,
.availability-dropdown,
.teaching-style-dropdown,
.session-duration-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.dropdown-container input {
  padding: 0.7rem 30px 0.7rem 0.7rem;
  border-radius: 15px;
  border: 1px solid rgb(12, 4, 102);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
  background: #e8f0fe;
  color: rgba(26, 41, 80, 0.683);
  width: 100%;
  transition: all 0.2s ease;
}

.dropdown-options {
  position: absolute;
  background: rgb(229, 235, 237);
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  z-index: 10;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.8rem;
}

.dropdown-option {
  padding: 7px 13px;
  cursor: pointer;
  color: #02475e;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 13px;
}

.dropdown-option:hover {
  background-color: rgba(255, 253, 253, 0.243);
}

.dropdown-icon {
  color: rgb(36, 63, 131);
  font-size: 10px;
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.dropdown-wrapper {
  position: relative;
  width: 100%;
}

.dropdown-trigger {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
}

.dropdown-trigger input {
  border: none;
  outline: none;
  width: 100%;
  cursor: pointer;
  background: transparent;
  padding: 0.7rem;
  border-radius: 20px;
  border: 1px solid rgb(12, 4, 102);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
  background: #e8f0fe;
  color: rgba(24, 37, 69, 0.842);
  font-size: 0.85rem;
  text-align: left;
}

.dropdown-trigger input::placeholder {
  color: rgba(26, 41, 80, 0.683);
}

.dropdown-menu {
  position: absolute;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}
.categories {
  width: 100%;
  top: 100%;
  left: 0;
  margin-top: 1px;
  font-size: 13px;
}

.subjects {
  width: 350px;
  top: 0;
  left: calc(100% + 2px);
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s;
  color: #02475e;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.subject-item {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  font-size: 0.85rem;
}

.subject-item input[type="checkbox"] {
  margin-right: 10px;
  cursor: pointer;
}

.subject-item label {
  color: #02475e;
  cursor: pointer;
  flex: 1;
}

.no-subjects {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 15px;
}

.dropdown-menu {
  z-index: 1000;
}

.count-badge {
  background: #02475e;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  margin-left: 5px;
}

.profile-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-left: 4rem;
  padding-right: 5rem;
}

.profile-label {
  color: #02475e;
  font-weight: 500;
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
  margin-left: 0.5rem;
}

.profile-input {
  padding: 0.7rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(215, 217, 230, 0.293);
  color: rgba(26, 41, 80, 0.683);
  font-size: 0.85rem;
  width: 100%;
  transition: all 0.2s ease;
  text-align: left;
}

.profile-input::placeholder {
  color: rgba(26, 41, 80, 0.683);
}

.profile-input:focus {
  outline: none;
  border-color: rgba(2, 71, 94, 0.8);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
}

.profile-textarea {
  min-height: 70px;
  resize: none;
  padding: 0.7rem;
  border-radius: 15px;
  border: 1px solid rgb(12, 4, 102);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
  background: #e8f0fe;
  color: rgba(24, 37, 69, 0.842);
  font-size: 0.85rem;
  width: 100%;
}

.profile-textarea::placeholder {
  color: rgba(26, 41, 80, 0.683);
  font-weight: 500;
}

.profile-textarea:focus {
  outline: none;
  border-color: rgba(2, 71, 94, 0.8);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
}

/* Profile Picture and Credentials Upload */
.upload-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
  flex-wrap: wrap;
}

.profile-picture-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 250px;
}

.profile-label {
  font-weight: 600;
  color: #02475e;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.profile-preview-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #02475e;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.default-icon {
  font-size: 3rem;
  color: rgba(2, 71, 94, 0.3);
}

.upload-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.choose-file-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 1.5rem;
  border-radius: 25px;
  background: linear-gradient(to bottom, #02475e, #066678);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.choose-file-container:hover {
  background: linear-gradient(to bottom, #033a4b, #044c5c);
  transform: translateY(-2px);
}

.file-name {
  font-size: 0.8rem;
  color: #02475e;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.credentials-upload {
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -4%;
  padding: 2rem;
  border-radius: 12px;
}

.credentials-upload .profile-label {
  display: block;
  margin-bottom: 1.8rem;
  text-align: center;
}

.credentials-upload .upload-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.credentials-upload .profile-preview-container {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 50%;
}

.credentials-upload .upload-icon {
  font-size: 5rem;
  color: #243c55;
}

.credentials-upload .upload-controls .file-link {
  color: #19415b;
  text-decoration: none;
  cursor: pointer;
  font-size: 12px;
  padding: 0.2rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-top: -1.1rem;
  text-decoration: underline;
}

/* File List Modal */
.Credmodal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.Credmodal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
  max-height: 80%;
  overflow-y: auto;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.Credmodal-content h3 {
  text-align: center;
  color: rgb(9, 9, 80);
  margin-bottom: 10px;
}

.file-list {
  margin-top: 0.5rem;
  list-style: none;
  padding: 0;
}

.file-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #02475e;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-list button {
  background: transparent;
  border: none;
  color: rgba(255, 100, 100, 0.8);
  cursor: pointer;
  padding: 0.2rem;
  flex-shrink: 0;
}

.file-list button:hover {
  color: #ff4d4d;
}

.close-button {
  background-color: #155577;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 120px;
  align-self: center;
  margin-top: 20px;
}

.close-button:hover {
  background-color: #032c58;
}

.divider {
  height: 1px;
  background: #929495;
  margin-bottom: 35px;
  margin-left: 10rem;
  margin-top: -2rem;
  width: 86%;
  max-width: 1200px;
  border: none;
  border-radius: 2px;
  transform: translateX(-100px);
}

/* Status Popup */
.status-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}

.status-popup-content {
  background: white;
  border-radius: 8px;
  width: 500px;
  height: 220px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.status-popup-content h3 {
  text-align: center;
  color: white;
  background-color: #02475e;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 23px;
}

.status-text {
  color: #02475e;
  text-align: center;
  margin-bottom: 45px;
  padding: 0 20px;
  line-height: 1.5;
}

.proceed-button {
  background-color: #02475e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  font-weight: 500;
  transition: background-color 0.3s;
}

.proceed-button:hover {
  background-color: #033140;
}

.next-button {
  position: absolute;
  right: 30px;
  bottom: 10px;
  background-color: #155577;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 130px;
  font-weight: 600;
  font-size: 0.9rem;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  text-align: center;
  user-select: none;
}

.next-button:hover {
  background-color: #032c58;
}

.next-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.next-button:active,
.next-button.active {
  transform: translateY(0);
  background-color: #1a3a4a;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.fas {
  font-family: "Font Awesome 5 Free" !important;
  font-weight: 900;
}

.dropdown-menu.subjects {
  position: absolute;
  left: 45%;
  top: 2.5rem;
  width: 350px;
  max-width: 100vw;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 999;
  box-sizing: border-box;
}

.subject-item {
  display: flex;
  align-items: center;
  padding: 8px 15px;
}

.subject-item input[type="checkbox"] {
  margin-right: 10px;
}

.subject-item label {
  color: #02475e;
  cursor: pointer;
  flex: 1;
}

.gender-specify {
  padding: 0.4rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(149, 154, 176, 0.242);
  color: rgb(48, 66, 106);
  font-size: 0.7rem;
  width: 35%;
  height: 30%;
  transition: all 0.2s ease;
  margin-top: 0.8rem;
  margin-left: 0.8rem;
}

.gender-specify:focus {
  outline: none;
  border-color: rgba(2, 71, 94, 0.8);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
}

.validation-error {
  color: #ff6b6b;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 0.5rem;
}

.availability-options,
.teaching-style-options {
  padding: 0.5rem;
  width: 100%;
}

.availability-option,
.teaching-style-option {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: #02475e;
}

.availability-option input[type="checkbox"],
.teaching-style-option input[type="checkbox"] {
  margin-right: 0.5rem;
}

.availability-option label,
.teaching-style-option label {
  cursor: pointer;
  color: #02475e;
  font-size: 0.85rem;
}

.required::after {
  content: "*";
  color: #ff6b6b;
  margin-left: 4px;
}

.validation-message {
  color: #ff6b6b;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 0.5rem;
  display: block;
}

.personal-input.error,
.profile-input.error,
.profile-textarea.error {
  border-color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.05);
}

.validation-error {
  color: #ff6b6b;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 0.5rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .mentorinfo-container {
    padding-top: 15px;
    height: auto;
    min-height: 100vh;
    position: relative;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .page-header p {
    font-size: 0.8rem;
  }

  .form-container {
    max-width: 85%;
    min-height: auto;
    max-height: none;
    border-radius: 20px;
    margin-bottom: 20px;
  }

  .title {
    padding: 1rem 1.5rem;
    font-size: 1.3rem;
    margin: 0 -1rem 1rem;
  }

  .personal-field,
  .profile-field {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .personal-input,
  .profile-input,
  .profile-textarea {
    padding: 0.6rem;
    font-size: 0.8rem;
  }

  .dropdown-menu.subjects {
    position: absolute;
    width: 100%;
    left: 0 !important;
    top: 100% !important;
    max-height: 50vh;
    border-radius: 0 0 10px 10px;
    border-top: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: none !important;
  }

  .upload-container {
    padding: 0.5rem;
  }

  .profile-preview-container {
    width: 80px;
    height: 80px;
  }

  .choose-file-container {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }

  .next-button {
    position: relative;
    bottom: auto;
    margin: 10px;
    margin-left: 18rem;
    width: 30%;
    align-self: center;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .form-container {
    max-width: 90%;
  }

  .personal-field,
  .profile-field {
    padding-left: 3rem;
    padding-right: 3rem;
  }

  .dropdown-menu.subjects {
    left: 30%;
    width: 300px;
  }

  .next-button {
    position: relative;
    bottom: auto;
    margin: 20px auto;
    width: 50%;
    align-self: center;
  }
}

@media (max-width: 480px) {
  .form-container {
    margin: 10px;
    width: calc(100% - 20px);
    max-width: calc(100% - 20px);
  }

  .personal-field,
  .profile-field {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .gender-specify {
    width: 50%;
  }

  .title {
    font-size: 15px;
  }

  .profile-preview-container {
    width: 70px;
    height: 70px;
  }

  .default-icon {
    font-size: 2.5rem;
  }
  .dropdown-menu.subjects {
    position: absolute;
    width: 100%;
    left: 0 !important;
    top: 100% !important;
    max-height: 50vh;
    border-radius: 0 0 10px 10px;
    border-top: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: none !important;
  }

  .next-button {
    position: relative;
    bottom: auto;
    margin: 10px;
    margin-left: 6.5rem;
    width: 50%;
    align-self: center;
  }

  .divider {
    height: 1px;
    background: #929495;
    margin-bottom: 35px;
    margin-left: 7.5rem;
    margin-top: -2rem;
    width: 86%;
    border: none;
    border-radius: 2px;
    transform: translateX(-100px);
  }
}
.mosha__toast .mosha__toast__content {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
}

.mosha__toast .mosha__toast__content .mosha__toast__content__text {
  padding: 0.5rem;
}
</style>
