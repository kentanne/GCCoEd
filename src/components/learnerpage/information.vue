<template>
  <div class="edit-information">
    <div class="upper-element">
      <h1>Edit Information</h1>
      <img @click="closeEditInformation" src="/exit.svg" alt="exit" />
    </div>
    <div class="lower-element">
      <div class="personal-information">
        <h1>PERSONAL INFORMATION</h1>
        <div class="input-wrapper">
          <div
            v-for="(item, index) in inputFieldPersonalInformation"
            :key="index"
            class="input-fields"
          >
            <label>{{ item.field }}</label>

            <!-- Text Input -->
            <input
              v-if="item.type === 'text'"
              type="text"
              v-model="personalData[toCamelCase(item.field)]"
              :placeholder="getPlaceholder(item.field, 'personal')"
              class="standard-input"
            />

            <!-- Select Dropdown -->
            <div v-else-if="item.type === 'select'" class="custom-dropdown">
              <div
                class="dropdown-container"
                @click.stop="toggleDropdown(toCamelCase(item.field))"
              >
                <input
                  type="text"
                  :value="personalData[toCamelCase(item.field)]"
                  :placeholder="
                    personalData[toCamelCase(item.field)] ||
                    `Select ${item.field.toLowerCase()}`
                  "
                  readonly
                  class="standard-input"
                />
                <i
                  class="dropdown-icon"
                  :class="{ open: dropdownOpen[toCamelCase(item.field)] }"
                  >▼</i
                >
              </div>
              <div
                v-if="dropdownOpen[toCamelCase(item.field)]"
                class="dropdown-options"
              >
                <div
                  v-for="(option, i) in item.options"
                  :key="i"
                  class="dropdown-option"
                  @click="
                    selectOption(toCamelCase(item.field), option, 'personal')
                  "
                >
                  {{ option }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-information">
        <h1>PROFILE INFORMATION</h1>
        <div class="input-wrapper">
          <div
            v-for="(item, index) in inputFieldProfileInformation"
            :key="index"
            class="input-fields"
          >
            <label>{{ item.field }}</label>

            <!-- Text Input -->
            <input
              v-if="item.type === 'text'"
              type="text"
              v-model="profileData[toCamelCase(item.field)]"
              :placeholder="`Enter ${item.field.toLowerCase()}`"
              class="standard-input"
            />

            <!-- Select Dropdown -->
            <div
              v-else-if="
                item.type === 'select' && item.field !== 'Subject of Interest'
              "
              class="custom-dropdown"
            >
              <div
                class="dropdown-container"
                @click.stop="toggleDropdown(toCamelCase(item.field))"
              >
                <input
                  type="text"
                  :value="profileData[toCamelCase(item.field)]"
                  :placeholder="
                    profileData[toCamelCase(item.field)] ||
                    `Select ${item.field.toLowerCase()}`
                  "
                  readonly
                  class="standard-input"
                />
                <i
                  class="dropdown-icon"
                  :class="{ open: dropdownOpen[toCamelCase(item.field)] }"
                  >▼</i
                >
              </div>
              <div
                v-if="dropdownOpen[toCamelCase(item.field)]"
                class="dropdown-options"
              >
                <div
                  v-for="(option, i) in item.options"
                  :key="i"
                  class="dropdown-option"
                  @click="selectOption(toCamelCase(item.field), option)"
                >
                  {{ option }}
                </div>
              </div>
            </div>

            <!-- Subject of Interest Checkbox Dropdown -->
            <div
              v-else-if="item.field === 'Subject of Interest'"
              class="custom-dropdown"
            >
              <div
                class="dropdown-container"
                @click.stop="toggleDropdown(toCamelCase(item.field))"
              >
                <input
                  type="text"
                  :value="getCSubjectInterestDisplay()"
                  :placeholder="
                    getCSubjectInterestDisplay() || 'Select courses'
                  "
                  readonly
                  class="standard-input"
                />
                <i
                  class="dropdown-icon"
                  :class="{ open: dropdownOpen[toCamelCase(item.field)] }"
                  >▼</i
                >
              </div>
              <div
                v-if="dropdownOpen[toCamelCase(item.field)]"
                class="dropdown-options checkbox-options"
              >
                <div
                  class="category-section"
                  v-if="availableSubjects.coreSubjects.length > 0"
                >
                  <h4>Core Subjects</h4>
                  <div
                    v-for="(option, i) in availableSubjects.coreSubjects"
                    :key="'core-' + i"
                    class="checkbox-option"
                    @click.stop
                  >
                    <input
                      type="checkbox"
                      :id="`core-${i}`"
                      :value="option"
                      v-model="profileData.courseOffered"
                      @click.stop
                    />
                    <label :for="`core-${i}`">{{ option }}</label>
                  </div>
                </div>

                <div
                  class="category-section"
                  v-if="availableSubjects.gecSubjects.length > 0"
                >
                  <h4>GEC Subjects</h4>
                  <div
                    v-for="(option, i) in availableSubjects.gecSubjects"
                    :key="'gec-' + i"
                    class="checkbox-option"
                    @click.stop
                  >
                    <input
                      type="checkbox"
                      :id="`gec-${i}`"
                      :value="option"
                      v-model="profileData.courseOffered"
                      @click.stop
                    />
                    <label :for="`gec-${i}`">{{ option }}</label>
                  </div>
                </div>

                <div
                  class="category-section"
                  v-if="availableSubjects.peNstpSubjects.length > 0"
                >
                  <h4>NSTP & PE Subjects</h4>
                  <div
                    v-for="(option, i) in availableSubjects.peNstpSubjects"
                    :key="'pe-' + i"
                    class="checkbox-option"
                    @click.stop
                  >
                    <input
                      type="checkbox"
                      :id="`pe-${i}`"
                      :value="option"
                      v-model="profileData.courseOffered"
                      @click.stop
                    />
                    <label :for="`pe-${i}`">{{ option }}</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Other Checkbox Dropdown -->
            <div v-else-if="item.type === 'checkbox'" class="custom-dropdown">
              <div
                class="dropdown-container"
                @click.stop="toggleDropdown(toCamelCase(item.field))"
              >
                <input
                  type="text"
                  :value="getDisplayValue(toCamelCase(item.field))"
                  readonly
                  class="standard-input"
                />
                <i
                  class="dropdown-icon"
                  :class="{ open: dropdownOpen[toCamelCase(item.field)] }"
                  >▼</i
                >
              </div>
              <div
                v-if="dropdownOpen[toCamelCase(item.field)]"
                class="dropdown-options checkbox-options"
              >
                <div
                  v-for="(option, i) in item.options"
                  :key="i"
                  class="checkbox-option"
                  @click.stop
                >
                  <input
                    type="checkbox"
                    :id="`${toCamelCase(item.field)}-${i}`"
                    :value="option.value"
                    v-model="profileData[toCamelCase(item.field)]"
                    :checked="isOptionChecked(item.field, option.value)"
                    @click.stop
                  />
                  <label :for="`${toCamelCase(item.field)}-${i}`">{{
                    option.label
                  }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bio-goals-wrapper">
        <div class="bio-goals-grid">
          <div class="input-fields">
            <label>Short Bio</label>
            <textarea
              v-model="profileData.shortBio"
              class="fixed-textarea"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>
          <div class="input-fields">
            <label>Learning Goals</label>
            <textarea
              v-model="profileData.learningGoals"
              class="fixed-textarea"
              placeholder="Tell us your learning goals"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="save">
      <button @click="saveChanges">Save Changes</button>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";
import api from "@/axios.js";
import axios from "axios";
import { create } from "core-js/core/object";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

const props = defineProps({
  userData: {
    type: Object,
    required: true,
    default: () => ({
      user: {
        name: "",
      },
      learn: {
        phoneNum: "",
        address: "",
        course: "",
        year: "",
        subjects: [],
        learn_modality: "",
        learn_sty: [],
        availability: [],
        prefSessDur: "",
        bio: "",
        goals: "",
      },
    }),
  },
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const personalData = reactive({});
const profileData = reactive({
  courseOffered: [],
  shortBio: props.userData?.learn?.bio || "",
  learningGoals: props.userData?.learn?.goals || "",
});
const dropdownOpen = reactive({});

const availableSubjects = reactive({
  coreSubjects: [],
  gecSubjects: [],
  peNstpSubjects: [],
});

const emit = defineEmits(["close"]);

function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

const yearLevelOptions = ref(["1st Year", "2nd Year", "3rd Year", "4th Year"]);
const programOptions = ref([
  "Bachelor of Science in Information Technology (BSIT)",
  "Bachelor of Science in Computer Science (BSCS)",
  "Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)",
]);
const learningModalityOptions = ref(["Online", "In-person", "Hybrid"]);
const durationOptions = ref(["1 hour", "2 hours", "3 hours"]);

const daysOptions = ref([
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
]);

const learningStyleOptions = ref([
  { label: "Lecture-Based", value: "Lecture-Based" },
  { label: "Interactive Discussion", value: "Interactive Discussion" },
  { label: "Q&A Session", value: "Q&A Session" },
  { label: "Demonstration", value: "Demonstration" },
  { label: "Project-based", value: "Project-based" },
  { label: "Step-by-step process", value: "Step-by-step process" },
]);

const inputFieldPersonalInformation = ref([
  { field: "Year Level", type: "select", options: yearLevelOptions },
  { field: "Program", type: "select", options: programOptions },
  { field: "Address", type: "text" },
  { field: "Contact Number", type: "text" },
]);

const inputFieldProfileInformation = ref([
  {
    field: "Learning Modality",
    type: "select",
    options: learningModalityOptions,
  },
  { field: "Days of Availability", type: "checkbox", options: daysOptions },
  { field: "Learning Style", type: "checkbox", options: learningStyleOptions },
  {
    field: "Preferred Session Duration",
    type: "select",
    options: durationOptions,
  },
  { field: "Subject of Interest", type: "select" },
]);

inputFieldPersonalInformation.value.forEach((item) => {
  const fieldName = toCamelCase(item.field);
  personalData[fieldName] = "";
});

inputFieldProfileInformation.value.forEach((item) => {
  const fieldName = toCamelCase(item.field);
  if (item.type === "checkbox") {
    profileData[fieldName] = [];
  } else if (fieldName !== "courseOffered") {
    profileData[fieldName] = "";
  }
});

watch(
  () => personalData.program,
  (newProgram) => {
    updateAvailableSubjects(newProgram);
  }
);

const updateAvailableSubjects = (program) => {
  const selectedProgram = program || personalData.program;

  switch (program) {
    case "Bachelor of Science in Information Technology (BSIT)":
      availableSubjects.coreSubjects = [
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
      ];
      availableSubjects.gecSubjects = [
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
      ];
      availableSubjects.peNstpSubjects = [
        "National Service Training Program with Anti-Smoking and Environmental Education",
        "National Service Training Program with GAD and Peace Education",
        "Physical Activities Toward Health and Fitness 1 (PATHFit 1): Movement Competency",
        "Physical Activities Toward Health and Fitness 2 (PATHFit 2): Exercise-Based Fitness Activities",
        "Physical Activities Toward Health and Fitness 3 (PATHFit 3)",
        "Physical Activities Toward Health and Fitness 4 (PATHFit 4)",
      ];
      break;

    case "Bachelor of Science in Computer Science (BSCS)":
      availableSubjects.coreSubjects = [
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
      ];
      availableSubjects.gecSubjects = [
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
      ];
      availableSubjects.peNstpSubjects = [
        "National Service Training Program 1",
        "National Service Training Program 2",
        "Physical Activities Toward Health and Fitness 1 (PATHFit 1): Movement Competency",
        "Physical Activities Toward Health and Fitness 2 (PATHFit 2): Exercise-Based Fitness Activities",
        "Physical Activities Toward Health and Fitness 3 (PATHFit 3)",
        "Physical Activities Toward Health and Fitness 4 (PATHFit 4)",
      ];
      break;

    case "Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)":
      availableSubjects.coreSubjects = [
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
      ];
      availableSubjects.gecSubjects = [
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
      ];
      availableSubjects.peNstpSubjects = [
        "National Service Training Program with Anti-Smoking and Environmental Education",
        "National Service Training Program with GAD and Peace Education",
        "Physical Activities Toward Health and Fitness 1 (PATHFit 1): Movement Competency",
        "Physical Activities Toward Health and Fitness 2 (PATHFit 2): Exercise-Based Fitness Activities",
        "Physical Activities Toward Health and Fitness 3 (PATHFit 3)",
        "Physical Activities Toward Health and Fitness 4 (PATHFit 4)",
      ];
      break;

    default:
      availableSubjects.coreSubjects = [];
      availableSubjects.gecSubjects = [];
      availableSubjects.peNstpSubjects = [];
  }

  profileData.courseOffered = props.userData.learn.subjects || [];
};

const getCSubjectInterestDisplay = () => {
  if (!profileData.courseOffered || profileData.courseOffered.length === 0) {
    return "";
  }
  return profileData.courseOffered.join(", ");
};

const closeEditInformation = () => {
  emit("close");
};

const toggleDropdown = (field) => {
  Object.keys(dropdownOpen).forEach((key) => {
    if (key !== field) dropdownOpen[key] = false;
  });
  dropdownOpen[field] = !dropdownOpen[field];
};

const selectOption = (field, value, section = "profile") => {
  if (section === "personal") {
    personalData[field] = value;
    dropdownOpen[field] = false;
  } else {
    if (Array.isArray(profileData[field])) {
      const index = profileData[field].indexOf(value);
      if (index === -1) {
        profileData[field].push(value);
      } else {
        profileData[field].splice(index, 1);
      }
    } else {
      profileData[field] = value;
      dropdownOpen[field] = false;
    }
  }
};

const getDisplayValue = (field) => {
  if (Array.isArray(profileData[field])) {
    if (profileData[field].length === 0) {
      if (field === "daysOfAvailability") {
        return props.userData.learn.availability?.join(", ") || "";
      }
      if (field === "learningStyle") {
        return props.userData.learn.learn_sty?.join(", ") || "";
      }
    }
    return profileData[field].join(", ");
  }
  return profileData[field] || "";
};

const handleClickOutside = (event) => {
  if (
    !event.target.closest(".dropdown-container") &&
    !event.target.closest(".dropdown-options")
  ) {
    Object.keys(dropdownOpen).forEach((key) => {
      dropdownOpen[key] = false;
    });
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  updateAvailableSubjects(props.userData.learn.course);
  profileData.daysOfAvailability = props.userData.learn.availability || [];
  profileData.learningStyle = props.userData.learn.learn_sty || [];
  profileData.learningModality = props.userData.learn.learn_modality || "";
  profileData.preferredSessionDuration = props.userData.learn.prefSessDur || "";
  profileData.shortBio = props.userData.learn.bio || "";
  profileData.learningGoals = props.userData.learn.goals || "";
  personalData.contactNumber = props.userData.learn.phoneNum || "";
  personalData.address = props.userData.learn.address || "";
  personalData.program = props.userData.learn.course || "";
  personalData.yearLevel = props.userData.learn.year || "";
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const validationErrors = reactive({
  contactNumber: "",
  address: "",
  shortBio: "",
  learningGoals: "",
});

function validateField(field, value) {
  const trimmedValue = value?.trim() || "";

  if (trimmedValue === "") {
    delete validationErrors[field];
    return;
  }

  switch (field) {
    case "shortBio":
      if (trimmedValue.length < 20) {
        validationErrors[field] = "Short Bio should be at least 20 characters.";
      } else {
        delete validationErrors[field];
      }
      break;

    case "learningGoals":
      if (trimmedValue.length < 10) {
        validationErrors[field] =
          "Learning Goals should be at least 10 characters.";
      } else {
        delete validationErrors[field];
      }
      break;

    case "contactNumber":
      if (trimmedValue.length !== 11) {
        validationErrors[field] = "Contact Number should be 11 digits.";
      } else if (!/^\d+$/.test(trimmedValue)) {
        validationErrors[field] = "Contact Number should contain only digits.";
      } else {
        delete validationErrors[field];
      }
      break;

    case "address":
      if (trimmedValue.length < 10) {
        validationErrors[field] = "Address should be at least 10 characters.";
      } else {
        delete validationErrors[field];
      }
      break;

    default:
      delete validationErrors[field];
  }
}

const saveChanges = async () => {
  const userData = props.userData || {};
  const learn = props.userData.learn || {};

  const combinedData = {
    phoneNum: personalData.contactNumber?.trim() || learn.phoneNum,
    address: personalData.address?.trim() || learn.address,
    course: personalData.program || learn.course,
    department: "College of Computer Studies",
    year: personalData.yearLevel || learn.year,
    subjects: JSON.stringify(
      profileData.courseOffered?.length
        ? profileData.courseOffered
        : learn.subjects || []
    ),
    learn_modality: profileData.learningModality || learn.learn_modality,
    learn_sty: JSON.stringify(
      (profileData.learningStyle?.length
        ? profileData.learningStyle
        : learn.learn_sty || []
      ).filter(Boolean)
    ),
    availability: JSON.stringify(
      (profileData.daysOfAvailability?.length
        ? profileData.daysOfAvailability
        : learn.availability || []
      ).filter(Boolean)
    ),
    prefSessDur: profileData.preferredSessionDuration || learn.prefSessDur,
    bio: profileData.shortBio?.trim() || learn.bio || "",
    goals: profileData.learningGoals?.trim() || learn.goals || "",
  };

  try {
    const response = await api.patch("/api/learner/edit", combinedData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.status === 200) {
      createToast("Changes saved successfully!", {
        position: "bottom-right",
        type: "success",
        transition: "slide",
        timeout: 2000,
        showIcon: true,
        toastBackgroundColor: "#319cb0",
      });
      // alert("Changes saved successfully!");
      emit("close");
    }
  } catch (error) {
    alert("An error occurred while saving changes.");
  }
};

const getPlaceholder = (field, section = "personal") => {
  const learn = props.userData?.learn || {};

  const mappings = {
    personal: {
      "Contact Number": learn.phoneNum || "Enter contact number",
      "Year Level": learn.year || "Select year level",
      Program: learn.course || "Select program",
      Address: learn.address || "Enter address",
    },
    profile: {
      "Learning Modality": learn.learn_modality || "Select learning modality",
      "Days of Availability": learn.availability?.join(", ") || "Select days",
      "Learning Style": learn.learn_sty?.join(", ") || "Select learning style",
      "Preferred Session Duration": learn.prefSessDur || "Select duration",
      "Subject of Interest": learn.subjects?.join(", ") || "Select subjects",
      "Short Bio": learn.bio || "Tell us about yourself",
      "Learning Goals": learn.goals || "Tell us your learning goals",
    },
  };

  return mappings[section][field];
};

const isOptionChecked = (field, value) => {
  switch (field) {
    case "Days of Availability":
      return props.userData.learn.availability?.includes(value);
    case "Learning Style":
      return props.userData.learn.learn_sty?.includes(value);
    default:
      return false;
  }
};
</script>

<style scoped>
.edit-information {
  width: 500px !important;
  max-height: 700px;
  height: 700px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 2000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  background-color: white;
}

.upper-element {
  display: flex;
  flex-direction: row;
  background-color: #0c434d;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;
  border-radius: 20px 20px 0 0;
}

.upper-element h1 {
  font-size: 24px;
  color: #ffffff;
}

.upper-element img {
  position: absolute;
  right: 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.lower-element {
  padding: 0 20px;
  background-color: white;
  overflow-y: auto;
}

.lower-element h1 {
  font-size: 17px;
  color: #0c434d;
  margin-bottom: 20px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-fields {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input-fields label {
  color: #116174;
  margin-bottom: 5px;
  font-size: 13px;
}

.standard-input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #0c434d;
  font-size: 12px;
  color: #0c434d;
  background-color: #d9d9d9;
  box-sizing: border-box;
  height: 35px;
}

.personal-information,
.profile-information {
  padding: 0 0 20px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.custom-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-container {
  position: relative;
  cursor: pointer;
}

.dropdown-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  transition: transform 0.2s;
  color: #0c434d;
  pointer-events: none;
}

.dropdown-icon.open {
  transform: translateY(-50%) rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-option {
  padding: 8px 10px;
  cursor: pointer;
  color: #0c434d;
  font-size: 12px;
  font-family: "Misterat", sans-serif;
}

.dropdown-option:hover {
  background-color: #f0f0f0;
}

.checkbox-options {
  padding: 5px;
}

.checkbox-option {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
}

.checkbox-option:hover {
  background-color: #f0f0f0;
}

.checkbox-option input[type="checkbox"] {
  margin-right: 8px;
  cursor: pointer;
}

.checkbox-option label {
  font-size: 12px;
  color: #0c434d;
  cursor: pointer;
}

.category-section {
  padding: 5px 10px;
  border-bottom: 1px solid #eee;
}

.category-section h4 {
  margin: 5px 0;
  color: #0c434d;
  font-size: 12px;
  font-weight: bold;
}

.bio-goals-wrapper {
  margin-top: 20px;
}

.bio-goals-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fixed-textarea {
  border-radius: 10px;
  border: 1px solid #0c434d;
  font-size: 12px;
  color: #0c434d;
  background-color: #d9d9d9;
  padding: 8px 10px;
  height: 70px;
  width: 100%;
  resize: none;
  box-sizing: border-box;
}

.save {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  border-radius: 0 0 20px 20px !important;
}

.save button {
  background-color: #006981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
}
</style>
