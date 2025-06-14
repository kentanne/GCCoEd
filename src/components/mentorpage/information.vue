<script setup>
// import { define } from "core-js/core/object";
import { ref, reactive, watch, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import api from "@/axios.js"; // Adjust the path as necessary
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFTokens = true;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const capitalizeFirstLetter = (str) => {
  if (!str) return "Not specified";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const saveChanges = async () => {
  // Combine personal and profile data into a single object
  const combinedData = {
    name: personalData.fullName || props.userData.user.name,
    gender: capitalizeFirstLetter(
      personalData.gender || props.userData.ment.gender
    ),
    phoneNum: personalData.contactNumber || props.userData.ment.phoneNum,
    address: personalData.address || props.userData.ment.address,
    course: personalData.program || props.userData.ment.course,
    department: "College of Computer Studies",
    year: personalData.yearLevel || props.userData.ment.year,
    // Stringify subjects array
    subjects: JSON.stringify(
      profileData.courseOffered.length
        ? profileData.courseOffered
        : props.userData.ment.subjects || []
    ),
    proficiency:
      profileData.proficiencyLevel || props.userData.ment.proficiency,
    learn_modality:
      profileData.teachingModality || props.userData.ment.learn_modality,
    // Stringify teaching styles array
    teach_sty: JSON.stringify(
      (profileData.teachingStyle?.length
        ? profileData.teachingStyle
        : props.userData.ment.teach_sty || []
      ).filter(Boolean)
    ),
    // Stringify availability array
    availability: JSON.stringify(
      (profileData.daysOfAvailability?.length
        ? profileData.daysOfAvailability
        : props.userData.ment.availability || []
      ).filter(Boolean)
    ),
    prefSessDur:
      profileData.preferredSessionDuration || props.userData.ment.prefSessDur,
    bio: profileData.shortBio || props.userData.ment.bio,
    exp: profileData.tutoringExperience || props.userData.ment.exp,
  };

  try {
    const response = await api.patch("/api/mentor/edit", combinedData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "X-CSRFToken": getCookie("csrftoken"),
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

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
});

const personalData = reactive({
  gender: "",
  otherGender: "",
});
const profileData = reactive({
  courseOffered: [],
  shortBio: "",
  tutoringExperience: "",
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
const genderOptions = ref(["Male", "Female"]);
const teachingModalityOptions = ref(["Online", "In-person", "Hybrid"]);
const proficiencyOptions = ref(["Beginner", "Intermediate", "Advanced"]);
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

const teachingStyleOptions = ref([
  { label: "Lecture-Based", value: "Lecture-Based" },
  { label: "Interactive Discussion", value: "Interactive Discussion" },
  { label: "Q&A Session", value: "Q&A Session" },
  { label: "Demonstration", value: "Demonstration" },
  { label: "Project-based", value: "Project-based" },
  { label: "Step-by-step process", value: "Step-by-step process" },
]);

const inputFieldPersonalInformation = ref([
  // { field: "Full Name", type: "text" },
  { field: "Year Level", type: "select", options: yearLevelOptions },
  { field: "Program", type: "select", options: programOptions },
  { field: "Address", type: "text" },
  // { field: "Sex at Birth", type: "select", options: genderOptions },
  { field: "Contact Number", type: "text" },
]);

const inputFieldProfileInformation = ref([
  {
    field: "Teaching Modality",
    type: "select",
    options: teachingModalityOptions,
  },
  { field: "Days of Availability", type: "checkbox", options: daysOptions },
  { field: "Proficiency Level", type: "select", options: proficiencyOptions },
  { field: "Teaching Style", type: "checkbox", options: teachingStyleOptions },
  {
    field: "Preferred Session Duration",
    type: "select",
    options: durationOptions,
  },
  { field: "Course Offered", type: "select" },
]);

const bioAndExperienceFields = ref([
  { field: "Short Bio", column: 1 },
  { field: "Tutoring Experience", column: 2 },
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

bioAndExperienceFields.value.forEach((item) => {
  profileData[toCamelCase(item.field)] = "";
});

watch(
  () => personalData.program,
  (newProgram) => {
    updateAvailableSubjects(newProgram);
  }
);

const isOptionChecked = (field, value) => {
  switch (field) {
    case "Days of Availability":
      return props.userData.ment.availability?.includes(value);
    case "Teaching Style":
      return props.userData.ment.teach_sty?.includes(value);
    default:
      return false;
  }
};

const updateAvailableSubjects = (program) => {
  // If no program is selected, use the one from props
  const selectedProgram = program || props.userData.ment.course;

  switch (selectedProgram) {
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

  // Initialize courseOffered with the subjects from props
  profileData.courseOffered = props.userData.ment.subjects || [];
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

// Simplify the selectGender function since we no longer need the "Other" case
const selectGender = (gender) => {
  personalData.gender = gender;
  dropdownOpen.gender = false;
};

const getDisplayValue = (field) => {
  if (Array.isArray(profileData[field])) {
    if (profileData[field].length === 0) {
      // Return props data based on field
      if (field === "daysOfAvailability") {
        return props.userData.ment.availability?.join(", ") || "";
      }
      if (field === "teachingStyle") {
        return props.userData.ment.teach_sty?.join(", ") || "";
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

  // Initialize subjects based on the course from props
  updateAvailableSubjects(props.userData.ment.course);

  // Initialize other fields with props data
  profileData.daysOfAvailability = props.userData.ment.availability || [];
  profileData.teachingStyle = props.userData.ment.teach_sty || [];
  profileData.teachingModality = props.userData.ment.learn_modality || "";
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Update the getPlaceholder function to include the new field name
const getPlaceholder = (field, section) => {
  const mappings = {
    personal: {
      "Full Name": props.userData.user.name,
      "Year Level": props.userData.ment.year,
      Program: props.userData.ment.course,
      Address: props.userData.ment.address,
      "Contact Number": props.userData.ment.phoneNum,
      "Sex at Birth": capitalizeFirstLetter(props.userData.ment.gender),
    },
    profile: {
      "Teaching Modality": props.userData.ment.learn_modality,
      "Days of Availability": props.userData.ment.availability?.join(", "),
      "Proficiency Level": props.userData.ment.proficiency,
      "Teaching Style": props.userData.ment.teach_sty?.join(", ") || "",
      "Preferred Session Duration": props.userData.ment.prefSessDur,
      "Course Offered": props.userData.ment.subjects?.join(", "),
      "Short Bio": props.userData.ment.bio,
      "Tutoring Experience": props.userData.ment.exp,
    },
  };

  return mappings[section][field];
};

const validationErrors = reactive({
  contactNumber: "",
  address: "",
  shortBio: "",
  tutoringExperience: "",
});

// const validateInputs = () => {
//   let isValid = true;

//   const requiredFields = {
//     contactNumber: personalData.contactNumber,
//     address: personalData.address,
//     shortBio: profileData.shortBio,
//     tutoringExperience: profileData.tutoringExperience,
//   };

//   for (const field in validationErrors) {
//     if (!requiredFields[field]?.toString().trim()) {
//       validationErrors[field] = "This field is required.";
//       isValid = false;
//     } else {
//       validationErrors[field] = "";
//     }
//   }

//   return isValid;
// };

function validateField(field, value) {
  const trimmedValue = value.trim();

  // No required fields, so empty means no error
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

    case "tutoringExperience":
      if (trimmedValue.length < 10) {
        validationErrors[field] =
          "Tutoring Experience should be at least 10 characters.";
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

    case "address": {
      if (trimmedValue.length < 10) {
        validationErrors[field] = "Address should be at least 10 characters.";
      } else {
        delete validationErrors[field];
      }
      break;
    }

    default:
      delete validationErrors[field];
  }
}

watch(
  personalData,
  (newData) => {
    for (const key in newData) {
      validateField(key, newData[key]);
    }
  },
  { deep: true }
);
</script>
<template>
  <div class="edit-information">
    <div class="upper-element">
      <h1>Edit Information</h1>
      <img @click="closeEditInformation" src="/exit.svg" alt="exit" />
    </div>
    <div class="lower-element">
      <div class="personal-information">
        <h1>I. PERSONAL INFORMATION</h1>
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
              :class="{
                'input-error': validationErrors[toCamelCase(item.field)],
              }"
              :placeholder="
                getPlaceholder(item.field, 'personal') ||
                `Enter your ${item.field.toLowerCase()}`
              "
              class="standard-input"
            />

            <span
              v-if="validationErrors[toCamelCase(item.field)]"
              class="error-message"
            >
              {{ validationErrors[toCamelCase(item.field)] }}
            </span>

            <!-- Generic Select Dropdown -->
            <div
              v-else-if="item.type === 'select' && item.field !== 'Gender'"
              class="custom-dropdown"
            >
              <div
                class="dropdown-container"
                @click.stop="toggleDropdown(toCamelCase(item.field))"
              >
                <input
                  type="text"
                  :value="personalData[toCamelCase(item.field)]"
                  :placeholder="
                    getPlaceholder(item.field, 'personal') ||
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

            <!-- Update the Gender dropdown to Sex at Birth -->
            <div
              v-else-if="item.field === 'Sex at Birth'"
              class="gender-section"
            >
              <div class="gender-dropdown">
                <div
                  class="dropdown-container"
                  @click.stop="toggleDropdown('gender')"
                >
                  <input
                    type="text"
                    v-model="personalData.gender"
                    :placeholder="
                      capitalizeFirstLetter(props.userData.ment.gender) ||
                      'Select your sex at birth'
                    "
                    class="standard-input"
                    readonly
                  />
                  <i
                    class="dropdown-icon"
                    :class="{ open: dropdownOpen.gender }"
                    >▼</i
                  >
                </div>
                <div
                  v-show="dropdownOpen.gender"
                  class="dropdown-options gender-options"
                >
                  <div class="dropdown-option" @click="selectGender('Female')">
                    Female
                  </div>
                  <div class="dropdown-option" @click="selectGender('Male')">
                    Male
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-information">
        <h1>II. PROFILE INFORMATION</h1>
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
              :placeholder="
                profileData[toCamelCase(item.field)] ||
                `Enter ${item.field.toLowerCase()}`
              "
              class="standard-input"
            />

            <!-- Select Dropdown -->
            <div
              v-else-if="
                item.type === 'select' && item.field !== 'Course Offered'
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
                    getPlaceholder(item.field, 'profile') ||
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

            <!-- Course Offered Checkbox Dropdown -->
            <div
              v-else-if="item.field === 'Course Offered'"
              class="custom-dropdown"
            >
              <div
                class="dropdown-container"
                @click.stop="toggleDropdown(toCamelCase(item.field))"
              >
                <input
                  type="text"
                  :value="getDisplayValue('courseOffered')"
                  :placeholder="getPlaceholder(item.field, 'profile')"
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
                      :checked="props.userData.ment.subjects?.includes(option)"
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
                  :placeholder="getPlaceholder(item.field, 'profile')"
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

      <div class="bio-experience-wrapper">
        <div class="bio-experience-grid">
          <div
            v-for="(item, index) in bioAndExperienceFields"
            :key="'bio-' + index"
            class="input-fields"
          >
            <label>{{ item.field }}</label>
            <textarea
              v-model="profileData[toCamelCase(item.field)]"
              class="fixed-textarea"
              :class="{
                'input-error': validationErrors[toCamelCase(item.field)],
              }"
              :placeholder="
                getPlaceholder(item.field, 'profile') ||
                (item.field === 'Short Bio'
                  ? 'Tell us about yourself'
                  : 'Describe your tutoring experience')
              "
              @input="
                validateField(
                  toCamelCase(item.field),
                  profileData[toCamelCase(item.field)]
                )
              "
            ></textarea>
            <span
              v-if="validationErrors[toCamelCase(item.field)]"
              class="error-message"
            >
              {{ validationErrors[toCamelCase(item.field)] }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="save">
      <button @click="saveChanges">Save Changes</button>
    </div>
  </div>
</template>

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
  background: linear-gradient(135deg, #0b2b31, #2b737e);
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

.gender-section {
  position: relative;
  width: 100%;
}

.gender-dropdown {
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

.gender-options {
  z-index: 1001;
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

.other-gender-input {
  margin-top: 10px;
  width: 100%;
}

.other-gender-input label {
  display: block;
  color: #116174;
  margin-bottom: 5px;
  font-size: 11px;
}

.bio-experience-wrapper {
  margin-top: 20px;
}

.bio-experience-grid {
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

.input-error {
  border-color: #f87171;
  background-color: #fff1f2;
  outline: none;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .edit-information {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(
      calc(-50% - 30px),
      -50%
    ); /* Adjusted to account for margin */
    width: calc(
      80vw - 30px
    ) !important; /* Reduced width to accommodate margin */
    height: 85vh;
    max-height: 85vh;
    margin-right: 10px;
    border-radius: 15px;
  }

  .upper-element {
    padding: 12px 15px;
    border-radius: 15px 15px 0 0;
  }

  .upper-element h1 {
    font-size: 20px;
  }

  .upper-element img {
    right: 15px;
    width: 18px;
    height: 18px;
  }

  .lower-element {
    padding: 0 15px;
    max-height: calc(85vh - 120px);
    overflow-y: auto;
  }

  .input-wrapper {
    gap: 12px;
  }

  .input-fields {
    margin-bottom: 12px;
  }

  .standard-input,
  .dropdown-option,
  .checkbox-option label,
  .category-section h4,
  .fixed-textarea {
    font-size: 11px;
  }

  .save button {
    padding: 8px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .edit-information {
    transform: translate(calc(-50% - 15px), -50%);
    width: calc(95vw - 10px) !important;
    margin-right: 5px;
    height: 90vh;
    max-height: 90vh;
  }

  .upper-element h1 {
    font-size: 18px;
  }

  .lower-element {
    max-height: calc(90vh - 120px);
  }

  .lower-element h1 {
    font-size: 15px;
    margin-bottom: 15px;
  }
}
</style>
