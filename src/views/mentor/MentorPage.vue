<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import Information from "../../components/mentorpage/information.vue";
import logoutDialog from "@/components/mentorpage/logoutDialog.vue";
import help from "@/components/mentorpage/help.vue";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

function getCookie(name){
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const loggedUserDets = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/mentor/details", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    }).then((response) => {
      
      console.log("User details fetched successfully:", response.data);
      if (response.status === 200) {
        userName.value = response.data.user.name;
        proficiency.value = response.data.ment.proficiency;
        //starFilled.value = response.data.ment.starFilled;
        yearLevel.value = response.data.ment.year;
        program.value = response.data.ment.course;
        days.value = JSON.parse(response.data.ment.availability);
        duration.value = response.data.ment.prefSessDur;
        bio.value = response.data.ment.bio;
        courseCard.value = JSON.parse(response.data.ment.subjects);
        profilePic.value = response.data.ment.image;
        loggedUserId.value = response.data.user.id;
      } else {
        throw new Error("Failed to fetch user details");
      }
    }).catch((error) => {
      console.error("Error fetching user details:", error);
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}

const learnersProfile = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/mentor/users", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    }).then((response) => {
      console.log("Learner profiles fetched successfully:", response.data);
      if (response.status === 200) {
        users.value = response.data;
        // // users.value.userName = response.data.name;
        // return response.data;
      } else {
        throw new Error("Failed to fetch learner profiles");
      }
    }).catch((error) => {
      console.error("Error fetching learner profiles:", error);
    });
  } catch (error) {
    console.error("Error fetching learner profiles:", error);
    return null;
  }
}

const sessionInfo = async() => {
  try{
    const sessionDeets = await axios.get(`http://localhost:8000/api/mentor/schedule`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
      },
    }).then((response) => {
      console.log('session details:', response.data)
      todaySchedule.value = response.data.schedules_today;
      upcommingSchedule.value = response.data.upcoming_schedules;
    })
  } catch (error){
    console.error('Error fetching session details:', error)
    return null
  }
}

const loggedUserId = ref();
const userName = ref();
const proficiency = ref();
const profilePic = ref();
const todaySchedule = ref([]);
const upcommingSchedule = ref([]);

const bio = ref();

const starFilled = ref();
const yearLevel = ref();
const program = ref();
const department = ref("Department of Computer Science");

const days = ref([]);
const duration = ref();

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

const courseCard = ref([]);

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

onMounted( async () => {
  console.log("test kung namamount");
  await loggedUserDets();
  await learnersProfile();
  await sessionInfo();
  // users.value = learnersProfile();
});
</script>

<template>
  <!-- sidebar -->
  <div class="sidebar">
    <div class="upper-element">
      <div>
        <h1>Hi, Mentor!</h1>
        <img :src="'http://localhost:8000/api/image/' + profilePic || 'http://placehold.co/600x400'" alt="profile-pic" />
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
    <!-- <div class="wave-curve"></div> -->
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
            <p>{{ department }}</p>
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
            <ul>
              <li v-for="(day, index) in days" :key="index">{{ day }}</li>
            </ul>
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
      :schedule="todaySchedule"
      :upcomingSchedule="upcommingSchedule"
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
  </template>
  
  <script>
  // import api from '../../axios.js'; // Adjust the path as necessary
  import axios from 'axios';

  axios.defaults.withCredentials = true; // Enable sending cookies with requests
  axios.defaults.withXSRFToken = true; // Enable CSRF token handling

  // Add this function above the export default block or in a utility file if shared across components.
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  export default {
    name: 'MentorPage',

    methods: {
      async getCookVal(){
        const cookieValue = getCookie('XSRF-TOKEN');
        console.log("Cookie value:", cookieValue);
      },
      async getalltest() {
        try {
          const response = await axios.get('http://localhost:8000/api/mentor/users', {
            withCredentials: true,
            headers: 
            {'Content-Type': 'application/json',
              "X-XSRF-TOKEN": getCookie('XSRF-TOKEN'),
            }}); // Adjust the endpoint as necessary
          console.log("Fetched data:", response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      },
    },
    mounted() {
      this.getCookVal();
      this.getalltest();
    },
  }
  </script>