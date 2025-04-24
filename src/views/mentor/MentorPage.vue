<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import Information from "../../components/mentorpage/information.vue";
import logoutDialog from "@/components/mentorpage/logoutDialog.vue";
import help from "@/components/mentorpage/help.vue";

const userName = ref("John Doe Mendoza");
const proficiency = ref("Advanced");

const bio = ref(
  "Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis"
);

const starFilled = ref(4);
const yearLevel = ref(2);
const program = ref("BSCS");

const days = ref("MONDAY-TUESDAY");
const duration = ref(2);

const isEdit = ref(false);
const users = ref([]);
const confirmLogout = ref(false);
const isHelp = ref(false);

const openHelp = () => {
  isHelp.value = !isHelp.value;
};

const openLogoutDialog = () => {
  confirmLogout.value = !confirmLogout.value;
};

const activeComponent = ref("main");
const switchComponent = (component) => {
  if (activeComponent.value !== component) {
    activeComponent.value = component;
  }
};

const mainView = defineAsyncComponent(() =>
  import("../../components/mentorpage/main.vue")
);

const sessionView = defineAsyncComponent(() =>
  import("../../components/mentorpage/session.vue")
);

const recordsView = defineAsyncComponent(() =>
  import("../../components/mentorpage/records.vue")
);

const filesView = defineAsyncComponent(() =>
  import("../../components/mentorpage/files.vue")
);

const componentMap = {
  main: mainView,
  session: sessionView,
  records: recordsView,
  files: filesView,
};

const courseCard = ref([
  "Computer Programming",
  "Ethics",
  "Information Management",
  "Networking",
  "Database",
  "Discrete Mathematics",
  "Calculus",
  "Algorithms",
  "Data Structures",
  "Operating Systems",
  "Computer Architecture",
  "Software Engineering"
]);

const displayedCourses = computed(() => courseCard.value.slice(0, 5));
const remainingCoursesCount = computed(() => Math.max(courseCard.value.length - 5, 0));
const remainingCourses = computed(() => courseCard.value.slice(5)); 
const showAllCourses = ref(false);

const toggleShowAllCourses = () => {
  showAllCourses.value = !showAllCourses.value;
};

const openEditInformation = () => {
  isEdit.value = !isEdit.value;
};

const searchQuery = ref("");

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const searchLower = searchQuery.value.toLowerCase();
    return (
      searchQuery.value === "" ||
      user.userName.toLowerCase().includes(searchLower) ||
      user.yearLevel.toLowerCase().includes(searchLower) ||
      user.course.toLowerCase().includes(searchLower)
    );
  });
});

const handleLogout = () => {
  alert("User logged out");
  confirmLogout.value = false;
};

const fetchUserInformation = () => {
  return [
  {
			id: 1,
			userName: "Maria Santos",
			yearLevel: "1st Year",
			course: "BSCS | CSS",
		},
		{
			id: 2,
			userName: "James Wilson",
			yearLevel: "3rd Year",
			course: "BSIT | CSS",
		},
		{
			id: 3,
			userName: "Sofia Rodriguez",
			yearLevel: "2nd Year",
			course: "BSA | CAFA",
		},
		{
			id: 4,
			userName: "David Chen",
			yearLevel: "4th Year",
			course: "BSME | COE",
		},
		{
			id: 5,
			userName: "Ana Reyes",
			yearLevel: "1st Year",
			course: "BSN | CON",
		},
		{
			id: 6,
			userName: "Marco Tan",
			yearLevel: "3rd Year",
			course: "BSBA | COB",
		},
		{
			id: 7,
			userName: "Ling Xu",
			yearLevel: "5th Year",
			course: "BSArch | CEA",
		},
		{
			id: 8,
			userName: "Paulo Cordova",
			yearLevel: "2nd Year",
			course: "BSIT | CSS",
		},
		{
			id: 9,
			userName: "Aisha Patel",
			yearLevel: "4th Year",
			course: "BSCE | COE",
		},
		{
			id: 10,
			userName: "Rafael Gutierrez",
			yearLevel: "3rd Year",
			course: "BSCS | CSS",
		},
		{
			id: 11,
			userName: "Nina Thompson",
			yearLevel: "1st Year",
			course: "BSBio | COS",
		},
		{
			id: 12,
			userName: "Carlos Mendoza",
			yearLevel: "2nd Year",
			course: "BSECE | COE",
		},
		{
			id: 13,
			userName: "Jennifer Kim",
			yearLevel: "4th Year",
			course: "BSA | CAFA",
		},
		{
			id: 14,
			userName: "Hiroshi Tanaka",
			yearLevel: "3rd Year",
			course: "BSBA | COB",
		},
		{
			id: 15,
			userName: "Fatima Ahmed",
			yearLevel: "2nd Year",
			course: "BSMT | COS",
		},
		{
			id: 16,
			userName: "Victor Garcia",
			yearLevel: "1st Year",
			course: "BSEE | COE",
		},
		{
			id: 17,
			userName: "Emily Zhang",
			yearLevel: "5th Year",
			course: "BSArch | CEA",
		},
		{
			id: 18,
			userName: "Michael Okafor",
			yearLevel: "3rd Year",
			course: "BSIT | CSS",
		},
		{
			id: 19,
			userName: "Isabella Martinez",
			yearLevel: "2nd Year",
			course: "BSPsych | CAS",
		},
		{
			id: 20,
			userName: "Raj Patel",
			yearLevel: "4th Year",
			course: "BSCS | CSS",
		},
		{
			id: 21,
			userName: "Gabriela Silva",
			yearLevel: "1st Year",
			course: "BSN | CON",
		},
		{
			id: 22,
			userName: "Daniel Lee",
			yearLevel: "3rd Year",
			course: "BSME | COE",
		},
		{
			id: 23,
			userName: "Fatma Ibrahim",
			yearLevel: "2nd Year",
			course: "BSBA | COB",
		},
		{
			id: 24,
			userName: "Alejandro Diaz",
			yearLevel: "4th Year",
			course: "BSCE | COE",
		},
		{
			id: 25,
			userName: "Mei Lin",
			yearLevel: "3rd Year",
			course: "BSChem | COS",
		},
		{
			id: 26,
			userName: "Mohammed Al-Farsi",
			yearLevel: "1st Year",
			course: "BSIT | CSS",
		},
		{
			id: 27,
			userName: "Sarah Johnson",
			yearLevel: "5th Year",
			course: "BSArch | CEA",
		},
		{
			id: 28,
			userName: "Juan Dela Cruz",
			yearLevel: "2nd Year",
			course: "BSIT | CSS",
		},
		{
			id: 29,
			userName: "Amara Okonkwo",
			yearLevel: "4th Year",
			course: "BSMath | COS",
		},
		{
			id: 30,
			userName: "Liam O'Connor",
			yearLevel: "3rd Year",
			course: "BSIT | CSS",
		},
		{
			id: 31,
			userName: "Priya Sharma",
			yearLevel: "2nd Year",
			course: "BSBA | COB",
		},
		{
			id: 32,
			userName: "Ricardo Torres",
			yearLevel: "1st Year",
			course: "BSCS | CSS",
		},  ];
};

onMounted(() => {
  users.value = fetchUserInformation();
});
</script>

<template>
  <!-- sidebar -->
  <div class="sidebar">
    <div class="upper-element">
      <div>
        <h1>Hi, Mentor!</h1>
        <img src="https://placehold.co/600x400" alt="profile-pic" />
      </div>
      <div>
        <h2>{{ userName }}</h2>
        <i><p>{{ proficiency }}</p></i>
        <div class="stars">
          <span class="filledStar" v-for="i in 5" :key="i">
            <span v-if="i <= starFilled">★</span>
            <span v-else>☆</span>
          </span>
        </div>
      </div>
    </div>
    <div class="wave-curve"></div>
    <div class="footer-element">
      <div class="bio-container">
        <h1>BIO</h1>
        <div>
          <p>{{ bio }}</p>
        </div>
      </div>
      <div class="user-information">
        <h1>User Information</h1>
        <div class="lines">
          <h3>Year Level:</h3>
          <div>
            <p>{{ yearLevel }}</p>
          </div>
        </div>
        <div class="lines">
          <h3>Department:</h3>
          <div>
            <p>College of Computer Studies</p>
          </div>
        </div>
        <div class="lines">
          <h3>Program:</h3>
          <div>
            <p>{{ program }}</p>
          </div>
        </div>
      </div>
      <div class="availability">
        <h1>Availability</h1>
        <div class="lines">
          <h3>Days:</h3>
          <div>
            <p>{{ days }}</p>
          </div>
        </div>
        <div class="lines">
          <h3>Duration:</h3>
          <div>
            <p>{{ duration }}</p>
          </div>
        </div>
      </div>
      <div class="course-offered">
        <h1>Course Offered</h1>
        <div class="course-grid">
          <div
            v-for="(card, index) in displayedCourses"
            :key="index"
            class="course-card"
          >
            <div class="lines">
              <div>
                <p :title="card">{{ card }}</p>
              </div>
            </div>
          </div>
          <div 
            v-if="remainingCoursesCount > 0" 
            class="course-card remaining-courses"
            @click="toggleShowAllCourses"
          >
            <div class="lines">
              <div>
                <p>+{{ remainingCoursesCount }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="showAllCourses" class="all-courses-popup">
          <div class="popup-content">
            <div class="popup-courses">
              <div 
                v-for="(course, index) in courseCard" 
                :key="index"
                class="popup-course"
              >
                {{ course }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="edit-information">
        <button @click="openEditInformation">
          {{ isEdit ? "Save" : "Edit" }}
        </button>
      </div>
    </div>
  </div>

  <!-- help -->
  <Transition name="fade">
    <div v-if="!isHelp" class="help-section">
      <div @click="openHelp" class="help">
        <img src="/help.svg" alt="help" />				
        <p>Help</p>
      </div>
    </div>
  </Transition>

  <!-- topbar -->
  <div class="topbar">
    <div class="topbar-left">
      <div @click="switchComponent('main')" class="topbar-options">
        <img src="/main.svg" alt="main" />
        <p>Main</p>
      </div>
      <div @click="switchComponent('session')" class="topbar-options">
        <img src="/calendar.svg" alt="calendar" />
        <p>Sessions</p>
      </div>
      <div @click="switchComponent('records')" class="topbar-options">
        <img src="/records.svg" alt="record" />
        <p>Records</p>
      </div>
      <div @click="switchComponent('files')" class="topbar-options">
        <img src="/files.svg" alt="notes" />
        <p>Files</p>
      </div>
      <div @click="openLogoutDialog" class="topbar-options">
        <img src="/logout.svg" alt="logout" />
        <p>Logout</p>
      </div>
    </div>
    <div class="topbar-right">
      <input
        maxlength="32"
        type="text"
        v-model="searchQuery"
        placeholder="Search"
      />
      <img src="/search.svg" alt="search" />
    </div>
  </div>

  <!-- main content -->
  <div class="main-content">
    <component
      :userInformation="filteredUsers"
      :is="componentMap[activeComponent] || mainView"
    />
  </div>

  <Transition name="fade" mode="out-in">
    <div v-if="isEdit" class="edit-information-popup">
      <Information @close="openEditInformation" />
    </div>
  </Transition>

  <Transition name="fade" mode="out-in">
    <div v-if="confirmLogout" class="logout-popup">
      <logoutDialog
        @close="confirmLogout = false"
        @logout="handleLogout"
      />
    </div>
  </Transition>

  <Transition name="fade" mode="out-in">
    <div v-if="isHelp" class="help-popup">
      <help @close="isHelp = false" />
    </div>
  </Transition>
</template>

<style scoped>
@import "@/assets/mentorpage/mentor.css";
@import "@/assets/mentorpage/color.css";
</style>

