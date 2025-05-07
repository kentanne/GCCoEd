<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import Information from "../../components/learnerpage/information.vue";
import logoutDialog from "@/components/learnerpage/logoutDialog.vue";

const userName = ref("John Doe Mendoza");
const yearLevel = ref(2);
const program = ref("BSCS");

const bio = ref(
  "Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis"
);

const goals = ref(
  "Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis"
);

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
  import("../../components/learnerpage/main.vue")
);

const sessionView = defineAsyncComponent(() =>
  import("../../components/learnerpage/session.vue")
);

const recordsView = defineAsyncComponent(() =>
  import("../../components/learnerpage/records.vue")
);

const componentMap = {
  main: mainView,
  session: sessionView,
  records: recordsView,
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
      (user.course && user.course.toLowerCase().includes(searchLower))
    );
  });
});

const handleLogout = () => {
  alert("User logged out");
  confirmLogout.value = false;
};

const createUser = (id, userName, yearLevel, rating = 4) => {
  return {
    id,
    userName,
    yearLevel,
    starFilled: ref(rating)
  };
};

const fetchUserInformation = () => {
  return [
    createUser(1, "Maria Santos", "1st Year"),
    createUser(2, "James Wilson", "3rd Year"),
    createUser(3, "Sofia Rodriguez", "2nd Year"),
    createUser(4, "David Chen", "4th Year"),
    createUser(5, "Ana Reyes", "1st Year"),
    createUser(6, "Marco Tan", "3rd Year", "BSBA | COB"),
    createUser(7, "Ling Xu", "5th Year"),
    createUser(8, "Paulo Cordova", "2nd Year"),
    createUser(9, "Aisha Patel", "4th Year"),
    createUser(10, "Rafael Gutierrez", "3rd Year"),
    createUser(11, "Nina Thompson", "1st Year"),
    createUser(12, "Carlos Mendoza", "2nd Year"),
    createUser(13, "Jennifer Kim", "4th Year"),
    createUser(14, "Hiroshi Tanaka", "3rd Year"),
    createUser(15, "Fatima Ahmed", "2nd Year"),
    createUser(16, "Victor Garcia", "1st Year"),
    createUser(17, "Emily Zhang", "5th Year"),
    createUser(18, "Michael Okafor", "3rd Year"),
    createUser(19, "Isabella Martinez", "2nd Year"),
    createUser(20, "Raj Patel", "4th Year"),
    createUser(21, "Gabriela Silva", "1st Year"),
    createUser(22, "Daniel Lee", "3rd Year"),
    createUser(23, "Fatma Ibrahim", "2nd Year"),
    createUser(24, "Alejandro Diaz", "4th Year"),
    createUser(25, "Mei Lin", "3rd Year"),
    createUser(26, "Mohammed Al-Farsi", "1st Year"),
    createUser(27, "Sarah Johnson", "5th Year"),
    createUser(28, "Juan Dela Cruz", "2nd Year", "BSIT | CSS"),
    createUser(29, "Amara Okonkwo", "4th Year"),
    createUser(30, "Liam O'Connor", "3rd Year"),
    createUser(31, "Priya Sharma", "2nd Year"),
    createUser(32, "Ricardo Torres", "1st Year")
  ];
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
        <h1>Hi, Learner!</h1>
        <img src="https://placehold.co/600x400" alt="profile-pic" />
      </div>
      <div>
        <h2>{{ userName }}</h2>
        <i><p>{{ yearLevel }}</p></i>
        <i><p>{{ program }}</p></i>
      </div>
    </div>
    <div class="wave-curve"></div>
    <div class="footer-element">
      <div class="biogoals-container">
        <h1>BIO</h1>
        <div>
          <p>{{ bio }}</p>
        </div>
        <h1>LEARNING GOALS</h1>
        <div>
          <p>{{ goals }}</p>
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
      <div class="s-interest">
        <h1>Subject of Interest</h1>
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
@import "@/assets/learnerpage/learner.css";
@import "@/assets/learnerpage/color.css";


</style>