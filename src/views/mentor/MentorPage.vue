<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import Information from "../../components/mentorpage/information.vue";
import logoutDialog from "@/components/mentorpage/logoutDialog.vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Initialize router
const router = useRouter();

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const loggedUserDets = async () => {
  try {
    await axios
      .get("http://localhost:8000/api/mentor/details", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("User details fetched successfully:", response.data);
        if (response.status === 200) {
          // Store data in unified userData ref
          userData.value = {
            user: response.data.user,
            ment: {
              ...response.data.ment,
              availability: JSON.parse(response.data.ment.availability),
              subjects: JSON.parse(response.data.ment.subjects),
              teach_sty: JSON.parse(response.data.ment.teach_sty),
              rating_ave: response.data.ment.rating_ave || 0,
            },
          };
        } else {
          throw new Error("Failed to fetch user details");
        }
      });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

const learnersProfile = async () => {
  try {
    const response = await axios
      .get("http://localhost:8000/api/mentor/users", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("Learner profiles fetched successfully:", response.data);
        if (response.status === 200) {
          users.value = response.data;
        } else {
          throw new Error("Failed to fetch learner profiles");
        }
      })
      .catch((error) => {
        console.error("Error fetching learner profiles:", error);
      });
  } catch (error) {
    console.error("Error fetching learner profiles:", error);
    return null;
  }
};

const sessionInfo = async () => {
  try {
    const sessionDeets = await axios
      .get(`http://localhost:8000/api/mentor/schedule`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("session details:", response.data);
        todaySchedule.value = response.data.schedules_today;
        upcommingSchedule.value = response.data.upcoming_schedules;
      });
  } catch (error) {
    console.error("Error fetching session details:", error);
    return null;
  }
};

const getFeedbacks = async () => {
  try {
    const response = await axios
      .get("http://localhost:8000/api/mentor/getFeedback", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("Feedbacks:", response.data);
        feedbacks.value = response.data.feedbacks;
      });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return null;
  }
};

const getFiles = async () => {
  try {
    const response = await axios
      .get("http://localhost:8000/api/mentor/files", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("Files:", response.data);
        files.value = response.data.files;
      });
  } catch (error) {
    console.error("Error fetching files:", error);
    return null;
  }
};

const registerLearnerRole = async () => {
  try {
    const response = await axios
      .post("http://localhost:8000/api/set/2nd_role", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("Learner registration:", response.data);
        router.push("/learner-info/alt");
      });
  } catch (error) {
    console.error("Error registering as learner:", error);
    return null;
  }
};

const switchRole = async () => {
  try {
    const response = await axios
      .post("http://localhost:8000/api/switch", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("Role switched:", response.data);
        router.push("/login");
      });
  } catch (error) {
    console.error("Error switching role:", error);
    return null;
  }
};

const logout = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/logout/web",
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      }
    );
    console.log("Logout response:", response.data);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

const userData = ref({
  user: {
    id: null,
    name: "",
    email: "",
    role: "",
  },
  ment: {
    address: "",
    proficiency: "",
    year: "",
    course: "",
    availability: [],
    prefSessDur: "",
    bio: "",
    subjects: [],
    image: "",
    phoneNum: "",
    teach_sty: [],
    credentials: [],
    exp: "",
    rating_ave: 0,
  },
});

const department = ref("College of Computer Studies");
const users = ref([]);
const todaySchedule = ref([]);
const upcommingSchedule = ref([]);
const feedbacks = ref([]);
const files = ref([]);
const isEdit = ref(false);
const confirmLogout = ref(false);
const showAllCourses = ref(false);
const searchQuery = ref("");

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

const fileManageView = defineAsyncComponent(() =>
  import("../../components/mentorpage/fileManage.vue")
);

const openLogoutDialog = () => {
  confirmLogout.value = true;
};

const componentMap = {
  main: mainView,
  session: sessionView,
  records: recordsView,
  files: filesView,
  fileManage: fileManageView,
};

const displayedCourses = computed(() =>
  userData.value.ment.subjects.slice(0, 5)
);
const remainingCoursesCount = computed(() =>
  Math.max(userData.value.ment.subjects.length - 5, 0)
);
const remainingCourses = computed(() => userData.value.ment.subjects.slice(5));

const toggleShowAllCourses = () => {
  showAllCourses.value = !showAllCourses.value;
};

const openEditInformation = () => {
  isEdit.value = !isEdit.value;
};

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

const currentDate = computed(() => {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
});

const currentDay = computed(() => {
  const options = { weekday: 'long' };
  return new Date().toLocaleDateString('en-US', options);
});

const handleLogout = () => {
  alert("User logged out");
  confirmLogout.value = false;
  logout();
  router.push("/login");
};

onMounted(async () => {
  console.log("test kung namamount");
  await loggedUserDets();
  await learnersProfile();
  await sessionInfo();
  await getFeedbacks();
  await getFiles();
});
</script>

<template>
  <!-- sidebar -->
  <div class="sidebar">
    <div class="logo-container">
      <img src="/src/assets/logo_gccoed.png" alt="GCCoEd Logo" class="logo">
      <span class="logo-text">GCCoEd</span>
    </div>
    
    <div class="upper-element">
      <div>
        <h1>Hi, Mentor!</h1>
        <img
          :src="
            'http://localhost:8000/api/image/' + userData.ment.image ||
            'http://placehold.co/600x400'
          "
          alt="profile-pic"
        />
      </div>
      <div>
        <h2>{{ userData.user.name }}</h2>
        <i><p>{{ userData.ment.proficiency }}</p></i>
        <div class="stars">
          <span class="filledStar" v-for="i in 5" :key="i">
            <span v-if="i <= Math.round(userData?.ment?.rating_ave || 0)">★</span>
            <span v-else>☆</span>
          </span>
        </div>
      </div>
    </div>
    
    <div class="footer-element">
      <div class="user-information">
        <h1>User Information</h1>
        <div class="lines">
          <h3>Year Level:</h3>
          <div>
            <p>{{ userData.ment.year }}</p>
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
            <p>{{ userData.ment.course.match(/\(([^)]+)\)/)?.[1] || userData.ment.course }}</p>
          </div>
        </div>
      </div>
      
      <div class="availability">
        <h1>Availability</h1>
        <div class="lines">
          <h3>Days:</h3>
          <div>
            <p>{{ userData.ment.availability.join(', ') }}</p>
          </div>
        </div>
        <div class="lines">
          <h3>Duration:</h3>
          <div>
            <p>{{ userData.ment.prefSessDur }}</p>
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
                v-for="(course, index) in userData.ment.subjects"
                :key="index"
                class="popup-course"
              >
                {{ course }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Account Actions Dropdown -->
      <div class="account-actions">
        <div class="account-dropdown">
          <button class="account-dropbtn">
            <img src="/person.svg" alt="Account" class="account-icon" />
            Account
          </button>
          <div class="account-dropdown-content">
            <a @click="openEditInformation">
              <img src="/edit.svg" alt="Edit" /> Edit Information
            </a>
            <a @click="registerLearnerRole">
              <img src="/register.svg" alt="Register" /> Register as Learner
            </a>
            <a @click="switchRole">
              <img src="/switch.svg" alt="Switch" /> Switch Account Role
            </a>
            <a @click="openLogoutDialog">
              <img src="/logout.svg" alt="Logout" /> Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- updated topbar with icon beside text -->
  <div class="topbar">
    <div class="topbar-left">
      <div 
        @click="switchComponent('main')" 
        class="topbar-option"
        :class="{ 'active': activeComponent === 'main' }"
      >
        <img src="/main.svg" alt="Main" class="nav-icon" />
        <span class="nav-text">Main</span>
      </div>
      <div 
        @click="switchComponent('session')" 
        class="topbar-option"
        :class="{ 'active': activeComponent === 'session' }"
      >
        <img src="/calendar.svg" alt="Session" class="nav-icon" />
        <span class="nav-text">Sessions</span>
      </div>
      <div 
        @click="switchComponent('records')" 
        class="topbar-option"
        :class="{ 'active': activeComponent === 'records' }"
      >
        <img src="/records.svg" alt="Records" class="nav-icon" />
        <span class="nav-text">Records</span>
      </div>
      <div 
        @click="switchComponent('files')" 
        class="topbar-option"
        :class="{ 'active': activeComponent === 'files' }"
      >
        <img src="/uploadCloud.svg" alt="Upload" class="nav-icon" />
        <span class="nav-text">Files</span>
      </div>
      <div 
        @click="switchComponent('fileManage')" 
        class="topbar-option"
        :class="{ 'active': activeComponent === 'fileManage' }"
      >
        <img src="/files.svg" alt="Files" class="nav-icon" />
        <span class="nav-text">File Manager</span>
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
    <div class="date-display">
      <div class="date-day">{{ currentDay }}</div>
      <div class="date-full">{{ currentDate }}</div>
    </div>
  </div>

  <!-- main content -->
  <div class="main-content">
    <component
      :userInformation="filteredUsers"
      :is="componentMap[activeComponent] || mainView"
      :schedule="todaySchedule"
      :upcomingSchedule="upcommingSchedule"
      :feedbacks="feedbacks"
      :files="files"
    />
  </div>

  <Transition name="fade" mode="out-in">
    <div v-if="isEdit" class="edit-information-popup">
      <Information :userData="userData" @close="openEditInformation" />
    </div>
  </Transition>

  <Transition name="fade" mode="out-in">
    <div v-if="confirmLogout" class="logout-popup">
      <logoutDialog @close="confirmLogout = false" @logout="handleLogout" />
    </div>
  </Transition>
</template>

<style scoped>
/* Sidebar Styling */
.sidebar {
  position: fixed;
  height: 100vh;
  width: 300px;
  background-color: rgb(40, 70, 86);
  color: white;
  padding: 20px 15px;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  width: 45px;
  height: 30px;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Profile Section */
.upper-element {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 13px;
  text-align: center;
}

.upper-element h1 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 17px;
  font-weight: 400;
  font-style: italic;
}

.upper-element img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
  margin-top: 1rem;
}

.upper-element h2 {
  color: white;
  font-size: 17px;
  font-weight: 500;
  margin-bottom: 5px;
}

.upper-element p {
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  font-size: 13px;
  margin-bottom: 4px;
}

.stars {
  color: #FFD700;
  font-size: 18px;
  display: flex;
  gap: 3px;
  justify-content: center;
}

/* Content Sections */
.footer-element {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-information h1,
.availability h1,
.course-offered h1 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  padding-top: 17px;
  margin-top: 0rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 0.5rem;
}

/* Information Items */
.lines {
  display: flex;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 6px;
  background: rgba(255, 254, 254, 0.2);
  align-items: center;
  font-weight: 600;
  overflow: hidden;
}

.lines h3 {
  min-width: 90px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 500;
}

.lines p,
.lines div {
  color: white;
  font-size: 12px;
  white-space: nowrap;    
  overflow-x: auto;          
  overflow-y: hidden;      
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;     
  -ms-overflow-style: none;  
}

.lines p::-webkit-scrollbar,
.lines div::-webkit-scrollbar {
  display: none;            
}

/* Subjects Grid */
.course-offered .course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}

.course-offered .course-card {
  background-color: #225d6f;
  border-radius: 8px;
  overflow: hidden;
  cursor: default;
  width: 100%;
}

.course-offered .course-card .lines {
  padding: 5px;
  background-color: #cee1e6b6;
  overflow: hidden; 
  margin-bottom: 0;
}

.course-offered .course-card .lines p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px;
  font-weight: 500;
  color: rgb(32, 71, 92);
  display: block;
  width: 100%;        
}

.course-offered .remaining-courses {
  background-color: #225d6f;
  cursor: pointer;
}

.course-offered .remaining-courses .lines {
  justify-content: center; 
}

.course-offered .remaining-courses .lines p {
  color: rgb(32, 71, 92);
  font-weight: bold;
  text-align: center;
}

.course-offered .remaining-courses:hover {
  background-color: #00819d;
}

.course-offered .remaining-courses:hover .lines {
  background-color: #00819d;
}

/* All Subjects Popup */
.course-offered .all-courses-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 50%;
  display: flex;
  align-items: center;
  margin-left: 23%;
  margin-top: 28%;
  max-height: 50%;
  max-height: 200px;
}

.course-offered .popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  width: 80%;
  max-width: 400px;
  margin-top: 10%;
}

.course-offered .popup-content h3 {
  color: #006981;
  text-align: center;
  margin-bottom: 15px;
  font-size: 16px;
}

.course-offered .popup-courses {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding: 5px;
}

.course-offered .popup-course {
  background-color: #d9dcef;
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
  text-align: center;
  color: #066678;
  font-family: Montserrat;
}

/* Account Dropdown Styles */
.account-actions {
  margin-top: 0.4rem;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.account-dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
}

.account-dropbtn {
  background-color: #d8e2e4;
  color: rgb(27, 51, 85);
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.account-dropbtn:hover {
  background-color: #00819d;
}

.account-icon {
  width: 20px;
  height: 20px;
}

.account-dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  bottom: 100%;
  left: 6rem;
  border-radius: 5px;
  overflow: hidden;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.account-dropdown-content a {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.account-dropdown-content a:hover {
  background-color: #006981;
  color: white;
}

.account-dropdown-content a img {
  width: 16px;
  height: 16px;
}

.account-dropdown:hover .account-dropdown-content {
  display: block;
}

/* Main Content Area */
.main-content {
  display: flex;
  padding-left: 370px;
  padding-right: 20px;
  padding-top: 100px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
}

/* Updated Topbar Styles with Icon Beside Text */
.topbar {
  position: fixed;
  top: 0;
  left: 330px;
  right: 0;
  height: 70px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  padding: 0 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e0e0e0;
}

.topbar-left {
  display: flex;
  gap: 30px;
  height: 100%;
}

.topbar-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 100%;
  padding: 0 20px;
  position: relative;
  transition: all 0.3s ease;
  gap: 10px;
}

.topbar-option:hover {
  background-color: #f5f5f5;
}

.topbar-option.active {
  background-color: #e6f7ff;
}

.topbar-option.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #006981;
}

.nav-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.topbar-option:hover .nav-icon {
  transform: scale(1.1);
}

.nav-text {
  color: #066678;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.topbar-option:hover .nav-text {
  color: #004d5a;
}

.topbar-option.active .nav-text {
  color: #004d5a;
  font-weight: 600;
}

.topbar-right {
  display: flex;
  position: relative;
  margin-right: 120px;
}

.topbar-right input {
  background-color: #006981;
  border: none;
  color: white;
  outline: none;
  padding: 15px 50px 15px 15px;
  width: 250px;
  text-align: initial;
  border-radius: 10px;
  transition: border 0.3s ease;
}

.topbar-right img {
  position: absolute;
  width: 25px;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  cursor: pointer;
}

.topbar-right input:focus {
  border: 1px solid green !important;
}

input::placeholder {
  color: white;
  opacity: 0.8;
}

.date-display {
  position: absolute;
  right: 20px;
  background-color: #f5f5f5;
  padding: 8px 15px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-day {
  color: #006981;
  font-size: 14px;
  font-weight: 600;
}

.date-full {
  color: #666;
  font-size: 12px;
}

/* Popup Styles */
.edit-information-popup,
.logout-popup {
  position: fixed;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  z-index: 2000;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Scrollbar styling for sidebar */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sidebar {
    width: 250px;
  }
  
  .main-content {
    padding-left: 270px;
  }
  
  .topbar {
    left: 250px;
    padding: 0 20px;
  }
  
  .topbar-left {
    gap: 15px;
  }
  
  .topbar-option {
    padding: 0 10px;
    gap: 6px;
  }
  
  .nav-icon {
    width: 18px;
    height: 18px;
  }
  
  .nav-text {
    font-size: 13px;
  }
  
  .topbar-right {
    margin-right: 80px;
  }
  
  .topbar-right input {
    width: 180px;
  }
  
  .date-display {
    display: none;
  }
}

@media (max-width: 576px) {
  .topbar {
    left: 0;
    padding-left: 270px;
  }
  
  .topbar-right {
    display: none;
  }
}
</style>