<template>
  <div class="learnerinfo-container">
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
      <h1>LEARNER INFO</h1>
      <p>Complete your profile to start learning.</p>
    </header>

    <div class="form-container scrollable-content">
      <!-- Step 1 Content -->
      <div v-if="currentStep === 1">
        <h2 class="title">I. PERSONAL INFORMATION</h2>

        <div class="personal-field">
          <label class="personal-label required" for="address">ADDRESS</label>
          <input
            type="text"
            id="address"
            v-model="address"
            @input="validateField('address', address)"
            @blur="validateField('address', address)"
            placeholder="Enter your address"
            class="personal-input"
            :class="{ error: validationErrors.address }"
            :disabled="isSubmitting"
          />
          <span v-if="validationErrors.address" class="validation-message">
            {{ validationErrors.address }}
          </span>
        </div>

        <div class="personal-field">
          <label class="personal-label required" for="contact-number"
            >CONTACT NUMBER
          </label>
          <input
            type="text"
            id="contact-number"
            v-model="contactNumber"
            @input="validateField('contactNumber', contactNumber)"
            @blur="validateField('contactNumber', contactNumber)"
            placeholder="Enter your contact number (11 digits)"
            class="personal-input"
            :class="{ error: validationErrors.contactNumber }"
            :disabled="isSubmitting"
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
                readonly
                :disabled="isSubmitting"
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
                placeholder="Select your year level"
                class="personal-input"
                readonly
                :disabled="isSubmitting"
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
                class="personal-input"
                readonly
                :disabled="isSubmitting"
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

        <!-- Profile Picture Upload -->
        <div class="upload-container">
          <div class="profile-picture-upload">
            <label class="profile-label">PROFILE PICTURE</label>
            <div
              class="profile-preview-container"
              @click="uploadProfilePicture"
            >
              <img
                v-if="profileImage"
                :src="profileImage"
                alt="Profile Preview"
                class="profile-preview"
              />
              <i v-else class="fas fa-user-circle default-icon"></i>
            </div>
            <div class="upload-controls">
              <div class="upload-text">
                <div
                  class="choose-file-container"
                  @click.stop="uploadProfilePicture"
                  :class="{ disabled: isSubmitting }"
                >
                  <i class="fas fa-upload"></i>
                  <span>Choose File</span>
                </div>
                <input
                  type="file"
                  ref="profileInput"
                  accept="image/*"
                  style="display: none"
                  @change="handleProfileUpload"
                  :disabled="isSubmitting"
                />
                <span class="file-name">
                  {{ profilePictureName || "No file chosen" }}
                </span>
              </div>
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
                placeholder="Select available days"
                class="profile-input"
                readonly
                :disabled="isSubmitting"
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
                  v-model="selectedDays"
                  @click.stop
                  :disabled="isSubmitting"
                />
                <label :for="'day-' + day">{{ day }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-field">
          <label class="profile-label required">SUBJECTS OF INTEREST</label>
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
                :class="{ error: validationErrors.selectedSubjects }"
                :disabled="isSubmitting"
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
                  :value="subject"
                  v-model="selectedSubjects"
                  @change="updateSelectedCounts"
                  :disabled="isSubmitting"
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
          <label class="profile-label" for="modality">LEARNING MODALITY</label>
          <div class="subjmodality-dropdown">
            <div class="dropdown-container" @click="toggleDropdown('modality')">
              <input
                type="text"
                v-model="modality"
                placeholder="Select learning modality"
                class="profile-input"
                readonly
                :disabled="isSubmitting"
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
            >PREFERRED SESSION DURATION</label
          >
          <div class="session-duration-dropdown">
            <div
              class="dropdown-container"
              @click="toggleDropdown('sessionDuration')"
            >
              <input
                type="text"
                v-model="sessionDuration"
                placeholder="Select duration"
                class="profile-input"
                readonly
                :disabled="isSubmitting"
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
          <label class="profile-label" for="learning-style"
            >LEARNING STYLE</label
          >
          <div class="learning-style-dropdown">
            <div
              class="dropdown-container"
              @click="toggleDropdown('learningStyle')"
            >
              <input
                type="text"
                id="learning-style"
                v-model="learningStyleDisplay"
                placeholder="Select learning style(s)"
                class="profile-input"
                readonly
                :disabled="isSubmitting"
              />
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div
              v-if="dropdownOpen.learningStyle"
              class="dropdown-options learning-style-options"
            >
              <div
                v-for="style in sessionStyles"
                :key="style"
                class="dropdown-option learning-style-option"
              >
                <input
                  type="checkbox"
                  :id="'style-' + style"
                  :value="style"
                  v-model="selectedsessionStyles"
                  @click.stop
                  :disabled="isSubmitting"
                />
                <label :for="'style-' + style">{{ style }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-field">
          <label class="profile-label" for="bio">SHORT BIO</label>
          <textarea
            id="bio"
            v-model="bio"
            @input="validateField('bio', bio)"
            @blur="validateField('bio', bio)"
            placeholder="Tell us about yourself (50-500 characters)"
            rows="4"
            class="profile-textarea"
            :class="{ error: validationErrors.bio }"
            :disabled="isSubmitting"
          ></textarea>
          <span v-if="validationErrors.bio" class="validation-message">
            {{ validationErrors.bio }}
          </span>
        </div>

        <div class="profile-field">
          <label class="profile-label" for="goals">LEARNING GOALS</label>
          <textarea
            id="goals"
            v-model="goals"
            @input="validateField('goals', goals)"
            @blur="validateField('goals', goals)"
            placeholder="Describe your learning goals (50-500 characters)"
            rows="4"
            class="profile-textarea"
            :class="{ error: validationErrors.goals }"
            :disabled="isSubmitting"
          ></textarea>
          <span v-if="validationErrors.goals" class="validation-message">
            {{ validationErrors.goals }}
          </span>
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
      </div>
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
</template>

<script>
import { registrationStore } from "@/stores/registrationStore";
import api from "@/axios.js";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

export default {
  data() {
    return {
      currentStep: 1,
      totalSteps: 2,
      isSubmitting: false,
      isButtonActive: false,
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
      goals: "",
      profileImage: null,
      profilePictureName: "",

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
        availability: false,
        learningStyle: false,
        sessionDuration: false,
      },
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
        this.selectedsessionStyles.join(", ") || "Select learning style(s)"
      );
    },
    isFormComplete() {
      if (this.currentStep === 1) {
        return (
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
        this.sessionDuration &&
        this.bio.trim() &&
        this.goals.trim() &&
        this.profileImage
      );
    },
  },

  methods: {
    setButtonActive(active) {
      if (!this.isSubmitting) {
        this.isButtonActive = active;
      }
    },

    scrollToGetStarted() {
      this.$router.push("/signup");
    },

    async csrf() {
      await api
        .get("/sanctum/csrf-cookie")
        .then((response) => {})
        .catch((error) => {});
    },

    toggleSubjectDropdown() {
      if (!this.isSubmitting) {
        this.showCategories = !this.showCategories;
        this.showSubjectsDropdown = false;
      }
    },

    selectCategory(category) {
      if (!this.isSubmitting) {
        this.selectedSubjectCategory = category.name;
        this.showCategories = false;
        this.showSubjects(category.type);
        this.updateSelectedCounts();
      }
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
        if (!this.modality) errors.push("Learning Modality is required");
        if (this.selectedDays.length === 0)
          errors.push("At least one day of availability is required");
        if (this.selectedsessionStyles.length === 0)
          errors.push("At least one learning style is required");
        if (!this.sessionDuration)
          errors.push("Preferred Session Duration is required");
        if (!this.bio.trim()) errors.push("Short Bio is required");
        if (!this.goals.trim()) errors.push("Learning goals is required");
        if (!this.profileImage) errors.push("Profile Picture is required");
      }

      return errors;
    },

    toggleDropdown(type) {
      if (!this.isSubmitting) {
        for (const key in this.dropdownOpen) {
          this.dropdownOpen[key] =
            key === type ? !this.dropdownOpen[key] : false;
        }
      }
    },

    selectGender(selectedGender) {
      if (!this.isSubmitting) {
        this.gender = selectedGender;
        this.dropdownOpen.gender = false;
      }
    },

    selectYearLevel(selectedYear) {
      if (!this.isSubmitting) {
        this.yearLevel = selectedYear;
        this.dropdownOpen.yearLevel = false;
      }
    },

    selectProgram(selectedProgram) {
      if (!this.isSubmitting) {
        this.program = selectedProgram;
        this.dropdownOpen.program = false;
        this.updateAvailableSubjects();
      }
    },

    selectModality(selectedModality) {
      if (!this.isSubmitting) {
        this.modality = selectedModality;
        this.dropdownOpen.modality = false;
      }
    },

    selectSessionDuration(duration) {
      if (!this.isSubmitting) {
        this.sessionDuration = duration;
        this.dropdownOpen.sessionDuration = false;
      }
    },

    nextStep() {
      if (this.isSubmitting) return; // Prevent multiple submissions

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
        this.submitLearnerInfo();
      }
    },

    goToStep(step) {
      if (step <= this.currentStep && !this.isSubmitting) {
        this.currentStep = step;
      }
    },

    uploadProfilePicture() {
      if (!this.isSubmitting) {
        this.$refs.profileInput.click();
      }
    },

    handleProfileUpload(event) {
      if (this.isSubmitting) return;

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
              "Introduction to Computing",
              "PC Troubleshooting with Basic Electronics",
              "Understanding the SELF",
              "Readings in Philippine History with Indigenous People Studies",
              "The Life and Works of Jose Rizal",
              "People and Earth's Ecosystem",
              "Mathematics in the Modern World",
              "Science, Technology and Society",
              "Reading Visual Arts",
              "Art Appreciation",
              "Purposive Communication",
              "Ethics",
              "The Contemporary World With Peace Studies",
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

    async submitLearnerInfo() {
      if (this.isSubmitting) return; // Prevent multiple submissions

      this.isSubmitting = true;

      const finalValidationErrors = this.validateForm();
      const store = registrationStore();

      if (finalValidationErrors.length > 0) {
        alert(
          "Please complete all required fields before submitting:\n\n" +
            finalValidationErrors.join("\n")
        );
        this.isSubmitting = false;
        return;
      }

      try {
        const formData = new FormData();
        formData.append("role", store.registrationData.role);
        formData.append(
          "gender",
          this.gender === "Other" ? this.otherGender : this.gender
        );
        formData.append("year", this.yearLevel);
        formData.append("course", this.program);
        formData.append("phoneNum", this.contactNumber);
        formData.append("address", this.address);

        // Stringify array fields
        formData.append("subjects", JSON.stringify(this.selectedSubjects));
        formData.append("availability", JSON.stringify(this.selectedDays));
        formData.append(
          "learn_sty",
          JSON.stringify(this.selectedsessionStyles)
        );

        formData.append("learn_modality", this.modality);
        formData.append("bio", this.bio);
        formData.append("prefSessDur", this.sessionDuration);
        formData.append("goals", this.goals);

        // Ensure profileImage is a file
        if (this.$refs.profileInput.files[0]) {
          formData.append("image", this.$refs.profileInput.files[0]);
        } else {
          throw new Error("Profile image is missing or invalid.");
        }

        await api.post("/api/learner/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
        });

        createToast("Registration successful!", {
          position: "bottom-right",
          type: "success",
          transition: "slide",
          timeout: 2000,
          showIcon: true,
          toastBackgroundColor: "#319cb0",

          // this.$router.push('/');
        });
        setTimeout(() => {
          this.$router.push("/#/login");
        }, 2000);
      } catch (error) {
        createToast("Registration failed!", {
          position: "bottom-right",
          type: "danger",
          transition: "slide",
          timeout: 2000,
          showIcon: true,
        });
      } finally {
        this.isSubmitting = false;
        this.setButtonActive(false);
      }
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
    address(newVal) {
      this.validateField("address", newVal);
    },
    contactNumber(newVal) {
      this.validateField("contactNumber", newVal);
    },
    bio(newVal) {
      this.validateField("bio", newVal);
    },
    goals(newVal) {
      this.validateField("goals", newVal);
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
@import "@/assets/learnerInfo.css";

/* Additional styles for loading states and button feedback */
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  min-height: 40px;
}

.next-button:hover:not(:disabled) {
  background-color: #032c58;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.next-button:active,
.next-button.active {
  transform: translateY(0);
  background-color: #1a3a4a;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.next-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.next-button.loading {
  pointer-events: none;
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

/* Disabled states for form elements */
.personal-input:disabled,
.profile-input:disabled,
.profile-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.choose-file-container.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.dropdown-container:has(input:disabled) {
  opacity: 0.6;
  pointer-events: none;
}

.mosha__toast .mosha__toast__content {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
}

.mosha__toast .mosha__toast__content .mosha__toast__content__text {
  padding: 0.5rem;
}
</style>
