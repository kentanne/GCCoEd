<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import Information from "../../components/learnerpage/information.vue";
import logoutDialog from "@/components/learnerpage/logoutDialog.vue";
import { useRouter } from "vue-router";
import api from "@/axios.js";
import axios from "axios";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const baseURL = api.defaults.baseURL;

const router = useRouter();

// Add loading state
const isLoading = ref(false);

const startLoading = () => {
  isLoading.value = true;
};

const stopLoading = () => {
  isLoading.value = false;
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const getLearnerDets = async () => {
  try {
    await api
      .get("/api/learner/details", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          userData.value = {
            user: response.data.user,
            learn: {
              ...response.data.learn,
              availability: JSON.parse(response.data.learn.availability),
              subjects: JSON.parse(response.data.learn.subjects),
              learn_sty: JSON.parse(response.data.learn.learn_sty),
            },
          };
        } else {
          throw new Error("Failed to fetch user details");
        }
      });
  } catch (error) {
    return null;
  }
};

const sessionInfo = async () => {
  try {
    const sessionDeets = await api
      .get(`/api/learner/sched`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        todaySchedule.value = response.data.schedules_today;
        upcommingSchedule.value = response.data.upcoming_schedules;
      });
  } catch (error) {
    return null;
  }
};

const sessionForReview = async () => {
  try {
    const pastSessionDeets = await api
      .get(`/api/learner/doneSched`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        schedForReview.value = response.data.schedules_done;
      });
  } catch (error) {
    return null;
  }
};

const mentorProfile = async () => {
  try {
    await api
      .get("/api/learner/users", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          users.value = response.data.map((item) => ({
            id: item.mentor_infos.mentor_no,
            userName: item.user.name,
            yearLevel: item.mentor_infos.year,
            course: item.mentor_infos.course,
            image_id: item.mentor_infos.image,
            proficiency: item.mentor_infos.proficiency,
            subjects: JSON.parse(item.mentor_infos.subjects),
            availability: JSON.parse(item.mentor_infos.availability),
            rating_ave: item.mentor_infos.rating_ave || 0,
            bio: item.mentor_infos.bio,
            exp: item.mentor_infos.exp,
            prefSessDur: item.mentor_infos.prefSessDur,
            teach_sty: JSON.parse(item.mentor_infos.teach_sty || "[]"),
            credentials: item.mentor_infos.credentials || [],
          }));
        }
      });
  } catch (error) {}
};

const registerMentorRole = async () => {
  router.push("/mentor-info/alt");
};

const switchRole = async () => {
  try {
    const response = await api
      .post("/api/switch", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        createToast("Role switched!", {
          position: "bottom-right",
          type: "success",
          transition: "slide",
          timeout: 2000,
          showIcon: true,
          toastBackgroundColor: "#319cb0",
        });
        router.push("/login");
      })
      .catch((error) => {
        createToast(
          "Failed to switch role. Please try again or Register as Mentor.",
          {
            position: "bottom-right",
            type: "error",
            transition: "slide",
            timeout: 2000,
            showIcon: true,
            toastBackgroundColor: "#e74c3c",
          }
        );
      });
  } catch (error) {
    return null;
  }
};

const mentFiles = async () => {
  try {
    const response = await api
      .get("/api/learner/mentFiles", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        return response.data;
      });
    return response;
  } catch (error) {
    return null;
  }
};

const fetchMentFiles = async () => {
  try {
    const response = await api.get("/api/learner/mentFiles", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    });
    mentorFiles.value = response.data;
  } catch (error) {}
};

const logout = async () => {
  try {
    const response = await api.post(
      "/api/logout/web",
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
  } catch (error) {}
};

const userData = ref({
  user: {
    id: null,
    name: "",
    email: "",
    role: "",
  },
  learn: {
    address: "",
    year: "",
    course: "",
    availability: [],
    prefSessDur: "",
    bio: "",
    subjects: [],
    image: "",
    phoneNum: "",
    learn_sty: [],
    goals: "",
    rating_ave: 0,
  },
});

const schedForReview = ref([]);
const todaySchedule = ref([]);
const upcommingSchedule = ref([]);
const mentorFiles = ref([]);

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

const courseCard = ref([]);

const displayedCourses = computed(() => courseCard.value.slice(0, 5));
const remainingCoursesCount = computed(() =>
  Math.max(courseCard.value.length - 5, 0)
);
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
  // alert("User logged out");
  confirmLogout.value = false;
  logout();
  router.push("/login");
};

const createUser = (id, userName, yearLevel, rating = 4) => {
  return {
    id,
    userName,
    yearLevel,
    starFilled: ref(rating),
  };
};

const fetchUserInformation = () => {
  return [
    // createUser(1, "Maria Santos", "1st Year"),
    // createUser(2, "James Wilson", "3rd Year"),
    // createUser(3, "Sofia Rodriguez", "2nd Year"),
    // createUser(4, "David Chen", "4th Year"),
    // createUser(5, "Ana Reyes", "1st Year"),
    // createUser(6, "Marco Tan", "3rd Year", "BSBA | COB"),
    // createUser(7, "Ling Xu", "5th Year"),
    // createUser(8, "Paulo Cordova", "2nd Year"),
    // createUser(9, "Aisha Patel", "4th Year"),
    // createUser(10, "Rafael Gutierrez", "3rd Year"),
    // createUser(11, "Nina Thompson", "1st Year"),
    // createUser(12, "Carlos Mendoza", "2nd Year"),
    // createUser(13, "Jennifer Kim", "4th Year"),
    // createUser(14, "Hiroshi Tanaka", "3rd Year"),
    // createUser(15, "Fatima Ahmed", "2nd Year"),
    // createUser(16, "Victor Garcia", "1st Year"),
    // createUser(17, "Emily Zhang", "5th Year"),
    // createUser(18, "Michael Okafor", "3rd Year"),
    // createUser(19, "Isabella Martinez", "2nd Year"),
    // createUser(20, "Raj Patel", "4th Year"),
    // createUser(21, "Gabriela Silva", "1st Year"),
    // createUser(22, "Daniel Lee", "3rd Year"),
    // createUser(23, "Fatma Ibrahim", "2nd Year"),
    // createUser(24, "Alejandro Diaz", "4th Year"),
    // createUser(25, "Mei Lin", "3rd Year"),
    // createUser(26, "Mohammed Al-Farsi", "1st Year"),
    // createUser(27, "Sarah Johnson", "5th Year"),
    // createUser(28, "Juan Dela Cruz", "2nd Year", "BSIT | CSS"),
    // createUser(29, "Amara Okonkwo", "4th Year"),
    // createUser(30, "Liam O'Connor", "3rd Year"),
    // createUser(31, "Priya Sharma", "2nd Year"),
    // createUser(32, "Ricardo Torres", "1st Year"),
  ];
};

const isSidebarVisible = ref(false); // For mobile devices only
const isMobileView = ref(false);

// Function to toggle sidebar on mobile
const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

// Check if we're on mobile view on mount and window resize
const checkMobileView = () => {
  isMobileView.value = window.innerWidth <= 768;
  // On larger screens, always show sidebar
  if (!isMobileView.value) {
    isSidebarVisible.value = true;
  }
};

// Update onMounted to include mobile view check
onMounted(async () => {
  try {
    // Start loading before any fetch operations
    startLoading();

    // Check initial screen size
    checkMobileView();
    window.addEventListener("resize", checkMobileView);

    // Use Promise.all to wait for all fetch operations to complete
    await Promise.all([
      getLearnerDets(),
      sessionInfo(),
      mentorProfile(),
      sessionForReview(),
      fetchMentFiles(),
    ]);
  } catch (error) {
    createToast("Error loading data. Please refresh the page.", {
      position: "top-right",
      type: "danger",
      transition: "slide",
      timeout: 5000,
      showIcon: true,
    });
  } finally {
    // Hide loading overlay when all operations are complete or if there's an error
    stopLoading();
  }
});
</script>

<template>
  <!-- Loading Overlay -->
  <loading
    v-model:active="isLoading"
    :can-cancel="false"
    :is-full-page="true"
    :opacity="1"
    :color="'#006981'"
    loader="spinner"
    background-color="#ffffff"
  />

  <!-- Mobile Sidebar Toggle Button (only visible on mobile) -->
  <button v-if="isMobileView" class="sidebar-toggle" @click="toggleSidebar">
    <i class="fas fa-bars"></i>
  </button>

  <!-- Overlay to close sidebar on mobile -->
  <div
    v-if="isMobileView && isSidebarVisible"
    class="sidebar-overlay"
    @click="toggleSidebar"
  ></div>

  <!-- sidebar with conditional classes -->
  <div
    class="sidebar"
    :class="{
      'sidebar-mobile-visible': isSidebarVisible,
      'sidebar-mobile': isMobileView,
    }"
  >
    <!-- Existing sidebar content -->
    <div class="logo-container">
      <img src="/src/assets/logo_gccoed.png" alt="GCCoEd Logo" class="logo" />
      <span class="logo-text">GCCoEd</span>
    </div>

    <div class="upper-element">
      <div>
        <h1>Hi, Learner!</h1>
        <img
          :src="
            `${baseURL}/api/image/` + userData.learn.image ||
            'https://placehold.co/600x400'
          "
          alt="profile-pic"
        />
      </div>
      <div>
        <h2>{{ userData.user.name }}</h2>
        <i
          ><p>{{ userData.learn.year }}</p></i
        >
        <i
          ><p>{{ userData.learn.course.match(/\(([^)]+)\)/)?.[1] }}</p></i
        >
      </div>
    </div>

    <div class="footer-element">
      <div class="bio-container">
        <h1>BIO</h1>
        <div class="lines">
          <p style="white-space: normal; word-break: break-all">
            {{ userData.learn.bio }}
          </p>
        </div>
      </div>

      <div class="availability">
        <h1>Availability</h1>
        <div class="lines">
          <h3>Days:</h3>
          <div>
            <p>{{ userData.learn.availability.join(", ") }}</p>
          </div>
        </div>
        <div class="lines">
          <h3>Duration:</h3>
          <div>
            <p>{{ userData.learn.prefSessDur }}</p>
          </div>
        </div>
      </div>

      <div class="subject-interest">
        <h1>Subject of Interest</h1>
        <div class="course-grid">
          <div
            v-for="(card, index) in userData.learn.subjects.slice(0, 5)"
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
            v-if="userData.learn.subjects.length > 5"
            class="course-card remaining-courses"
            @click="toggleShowAllCourses"
          >
            <div class="lines">
              <div>
                <p>+{{ userData.learn.subjects.length - 5 }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showAllCourses" class="all-courses-popup">
          <div class="popup-content">
            <div class="popup-courses">
              <div
                v-for="(course, index) in userData.learn.subjects"
                :key="index"
                class="popup-course"
              >
                {{ course }}
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <a @click="registerMentorRole">
              <img src="/register.svg" alt="Register" /> Register as Mentor
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

  <!-- updated topbar with responsive classes -->
  <div
    class="topbar"
    :class="{ 'topbar-expanded': isMobileView && !isSidebarVisible }"
  >
    <div class="topbar-left">
      <div
        @click="switchComponent('main')"
        class="topbar-option"
        :class="{ active: activeComponent === 'main' }"
      >
        <img src="/main.svg" alt="Main" class="nav-icon" />
        <span class="nav-text">Main</span>
      </div>
      <div
        @click="switchComponent('session')"
        class="topbar-option"
        :class="{ active: activeComponent === 'session' }"
      >
        <img src="/calendar.svg" alt="Session" class="nav-icon" />
        <span class="nav-text">Sessions</span>
      </div>
      <div
        @click="switchComponent('records')"
        class="topbar-option"
        :class="{ active: activeComponent === 'records' }"
      >
        <img src="/records.svg" alt="Records" class="nav-icon" />
        <span class="nav-text">Records</span>
      </div>
    </div>
    <div class="topbar-date">
      {{
        new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      }}
    </div>
  </div>

  <!-- main content with responsive class -->
  <div
    class="main-content"
    :class="{ 'content-expanded': isMobileView && !isSidebarVisible }"
  >
    <component
      :userInformation="filteredUsers"
      :is="componentMap[activeComponent] || mainView"
      :userData="userData"
      :upcomingSchedule="upcommingSchedule"
      :schedule="todaySchedule"
      :schedForReview="schedForReview"
      :mentFiles="mentorFiles"
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
  background: linear-gradient(135deg, #0b2b31, #2b737e);
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
  color: #ffd700;
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

.bio-container h1 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  padding-top: 17px;
  margin-top: -1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 0.5rem;
}

.goals-container h1,
.availability h1,
.subject-interest h1 {
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
.bio-container .lines {
  white-space: normal;
  word-break: break-word;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  padding: 8px;
  position: relative;
}

.bio-container .lines p {
  color: white;
  font-size: 12px;
  line-height: 1.2;
  margin: 0;
  white-space: normal;
  word-break: break-word;
  width: 100%;
  padding-right: 12px;
  max-height: 30px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.bio-container .lines p::-webkit-scrollbar {
  display: none;
}
/* Subjects Grid */
.subject-interest .course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}

.subject-interest .course-card {
  background-color: #225d6f;
  border-radius: 8px;
  overflow: hidden;
  cursor: default;
  width: 100%;
}

.subject-interest .course-card .lines {
  padding: 5px;
  background-color: #cee1e6b6;
  overflow: hidden;
  margin-bottom: 0;
}

.subject-interest .course-card .lines p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px;
  font-weight: 500;
  color: rgb(32, 71, 92);
  display: block;
  width: 100%;
}

.subject-interest .remaining-courses {
  background-color: #225d6f;
  cursor: pointer;
}

.subject-interest .remaining-courses .lines {
  justify-content: center;
}

.subject-interest .remaining-courses .lines p {
  color: rgb(32, 71, 92);
  font-weight: bold;
  text-align: center;
}

.subject-interest .remaining-courses:hover {
  background-color: #00819d;
}

.subject-interest .remaining-courses:hover .lines {
  background-color: #00819d;
}

/* All Subjects Popup */
.subject-interest .all-courses-popup {
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

.subject-interest .popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  width: 80%;
  max-width: 400px;
  margin-top: 10%;
}

.subject-interest .popup-content h3 {
  color: #006981;
  text-align: center;
  margin-bottom: 15px;
  font-size: 16px;
}

.subject-interest .popup-courses {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding: 5px;
}

.subject-interest .popup-course {
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
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  bottom: 100%;
  left: 6rem;
  border-radius: 5px;
  overflow: hidden;
  font-family: "Helvetica Neue", Arial, sans-serif;
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
  content: "";
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

.topbar-date {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 20px;
  background-color: #f5f5f5;
}

/* Popup Styles */
.edit-information-popup,
.logout-popup,
.help-popup {
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

/* Add loading overlay styles */
.vl-overlay {
  z-index: 9999 !important;
}

.vl-icon {
  border-top-color: #006981 !important;
  border-left-color: #006981 !important;
}

.vl-backdrop {
  background-color: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(2px);
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

  .topbar-date {
    font-size: 12px;
    padding: 5px 10px;
  }
}

@media (max-width: 576px) {
  .topbar {
    left: 0;
    padding-left: 270px;
  }

  .topbar-date {
    display: none;
  }
}
.mosha__toast .mosha__toast__content {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
}

.mosha__toast .mosha__toast__content .mosha__toast__content__text {
  padding: 0.5rem;
}

/* Add these new style rules */

/* Mobile Sidebar Toggle Button */
.sidebar-toggle {
  display: none;
  background: #006981;
  color: white;
  border: none;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1002;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.sidebar-toggle:hover {
  background-color: #00819d;
}

/* Overlay for closing sidebar on mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

/* Responsive styles */
@media (max-width: 768px) {
  /* Show mobile toggle button */
  .sidebar-toggle {
    display: flex;
  }

  /* Show overlay when sidebar is visible */
  .sidebar-overlay {
    display: block;
  }

  /* Default state for sidebar on mobile */
  .sidebar-mobile {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  /* State when sidebar is toggled visible */
  .sidebar-mobile-visible {
    transform: translateX(0);
  }

  /* Adjust topbar when sidebar is hidden */
  .topbar-expanded {
    left: 0;
    padding-left: 70px;
  }

  /* Adjust main content when sidebar is hidden */
  .content-expanded {
    padding-left: 20px;
  }

  /* Update main content area */
  .main-content {
    padding-left: 20px;
    transition: padding-left 0.3s ease;
  }

  /* Update topbar */
  .topbar {
    transition: left 0.3s ease, padding-left 0.3s ease;
  }

  /* Make topbar scrollable horizontally */
  .topbar {
    left: 0 !important;
    padding-left: 70px;
    overflow-x: auto;
    justify-content: flex-start;
    white-space: nowrap;
  }

  .topbar-left {
    display: flex;
    min-width: max-content; /* Ensure content doesn't wrap */
  }

  /* Hide scrollbar while maintaining functionality */
  .topbar::-webkit-scrollbar {
    height: 0;
    display: none;
  }

  .topbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
}

/* Make sure other conflicting style rules are overridden */
.sidebar-mobile-visible {
  transform: translateX(0) !important;
}

/* Add styles for scrollable topbar */
.topbar-option {
  flex-shrink: 0; /* Prevent options from shrinking */
}
</style>
