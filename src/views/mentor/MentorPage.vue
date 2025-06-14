<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import Information from "../../components/mentorpage/information.vue";
import logoutDialog from "@/components/mentorpage/logoutDialog.vue";
import { useRouter } from "vue-router";
import api from "@/axios.js";
import axios from "axios";
import Offer from "@/components/mentorpage/offer.vue";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const baseURL = api.defaults.baseURL;

// Initialize router
const router = useRouter();

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

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

const loggedUserDets = async () => {
  try {
    await api
      .get("/api/mentor/details", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
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
            image_url: response.data.image_url, // Add image URL
          };
        } else {
          throw new Error("Failed to fetch user details");
        }
      });
  } catch (error) {
    return null;
  }
};

const learnersProfile = async () => {
  try {
    const response = await api
      .get("/api/mentor/users", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          users.value = response.data;
        } else {
          throw new Error("Failed to fetch learner profiles");
        }
      })
      .catch((error) => {});
  } catch (error) {
    return null;
  }
};

const sessionInfo = async () => {
  try {
    const sessionDeets = await api
      .get(`/api/mentor/schedule`, {
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

const getFeedbacks = async () => {
  try {
    const response = await api
      .get("/api/mentor/getFeedback", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        feedbacks.value = response.data.feedbacks;
      });
  } catch (error) {
    return null;
  }
};

const getFiles = async () => {
  try {
    const response = await api
      .get("/api/mentor/files", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        files.value = response.data.files;
      });
  } catch (error) {
    return null;
  }
};

const registerLearnerRole = async () => {
  try {
    const response = await api
      .post("/api/set/2nd_role", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        router.push("/learner-info/alt");
      });
  } catch (error) {
    return null;
  }
};

const switchRole = async () => {
  try {
    const response = await api
      .post("/api/switch", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        createToast("Role switched successfully", {
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
          "Failed to switch role. Please try again or Register as Learner",
          {
            position: "bottom-right",
            type: "danger",
            transition: "slide",
            timeout: 2000,
            showIcon: true,
            toastBackgroundColor: "#ff4d4d",
          }
        );
      });
  } catch (error) {
    return null;
  }
};

// const logout = async () => {
//   try {
//     await api.post("/api/logout");
//   } catch (error) {
//     console.error("Logout error:", error);
//   } finally {
//     // Always clean up locally regardless of server response
//     removeToken();
//     router.push("/login");
//   }
// };

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
  image_url: null, // Add image URL property
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
const showOffer = ref(false);
const userId = ref(null);

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
  const options = { month: "long", day: "numeric", year: "numeric" };
  return new Date().toLocaleDateString("en-US", options);
});

const currentDay = computed(() => {
  const options = { weekday: "long" };
  return new Date().toLocaleDateString("en-US", options);
});

const handleLogout = () => {
  // alert("User logged out");
  confirmLogout.value = false;
  logout();
  router.push("/login");
};

const handleOfferConfirm = () => {
  // Handle the offer confirmation logic here
  // You can also close the offer modal here if needed
  showOffer.value = false;
};

// Add this with your other ref declarations
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

onMounted(async () => {
  console.log("MentorPage: Starting component initialization...");
  console.log("Environment:", import.meta.env.MODE);
  console.log("API Base URL:", api.defaults.baseURL);
  console.log(
    "Auth Token:",
    localStorage.getItem("auth_token") ? "Present" : "Missing"
  );

  try {
    // Start loading before any fetch operations
    startLoading();

    // Check initial screen size
    checkMobileView();
    window.addEventListener("resize", checkMobileView);

    console.log("MentorPage: Executing API calls...");

    // Use Promise.allSettled to wait for all fetch operations and get detailed results
    const results = await Promise.allSettled([
      loggedUserDets().catch((error) => {
        console.error("loggedUserDets failed:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        });
        throw error;
      }),
      learnersProfile().catch((error) => {
        console.error("learnersProfile failed:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
          },
        });
        throw error;
      }),
      sessionInfo().catch((error) => {
        console.error("sessionInfo failed:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
          },
        });
        throw error;
      }),
      getFeedbacks().catch((error) => {
        console.error("getFeedbacks failed:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
          },
        });
        throw error;
      }),
      getFiles().catch((error) => {
        console.error("getFiles failed:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
          },
        });
        throw error;
      }),
    ]);

    // Log results for debugging
    results.forEach((result, index) => {
      const functionNames = [
        "loggedUserDets",
        "learnersProfile",
        "sessionInfo",
        "getFeedbacks",
        "getFiles",
      ];
      if (result.status === "fulfilled") {
        console.log(`✅ ${functionNames[index]} completed successfully`);
      } else {
        console.error(`❌ ${functionNames[index]} failed:`, result.reason);
      }
    });

    // Count failures and provide user feedback
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length > 0) {
      console.warn(
        `⚠️ ${failures.length} out of ${results.length} API calls failed`
      );

      createToast(
        `Warning: ${failures.length} data sources failed to load. Some features may not work properly.`,
        {
          position: "top-right",
          type: "warning",
          transition: "slide",
          timeout: 5000,
          showIcon: true,
        }
      );
    } else {
      console.log("🎉 All API calls completed successfully");
    }
  } catch (error) {
    console.error("Critical error during component initialization:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      response: error.response
        ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers,
          }
        : null,
      request: error.request
        ? {
            url: error.request.responseURL || error.config?.url,
            method: error.config?.method,
          }
        : null,
    });

    createToast(
      "Critical error loading data. Please check your connection and refresh the page.",
      {
        position: "top-right",
        type: "danger",
        transition: "slide",
        timeout: 8000,
        showIcon: true,
      }
    );
  } finally {
    console.log("MentorPage: Component initialization completed");
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
    <div class="logo-container">
      <img src="/src/assets/logo_gccoed.png" alt="GCCoEd Logo" class="logo" />
      <span class="logo-text">GCCoEd</span>
    </div>

    <div class="upper-element">
      <div>
        <h1>Hi, Mentor!</h1>
        <img
          :src="userData.image_url || 'https://placehold.co/600x400'"
          alt="profile-pic"
          @error="$event.target.src = 'https://placehold.co/600x400'"
        />
      </div>
      <div>
        <h2>{{ userData.user.name }}</h2>
        <i
          ><p>{{ userData.ment.proficiency }}</p></i
        >
        <div class="stars">
          <span class="filledStar" v-for="i in 5" :key="i">
            <span v-if="i <= Math.round(userData?.ment?.rating_ave || 0)"
              >★</span
            >
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
          <h3>Program:</h3>
          <div>
            <p>
              {{
                userData.ment.course.match(/\(([^)]+)\)/)?.[1] ||
                userData.ment.course
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="availability">
        <h1>Availability</h1>
        <div class="lines">
          <h3>Days:</h3>
          <div>
            <p>{{ userData.ment.availability.join(", ") }}</p>
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

  <!-- topbar -->
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
        <span class="nav-text">Learners</span>
      </div>
      <div
        @click="switchComponent('session')"
        class="topbar-option"
        :class="{ active: activeComponent === 'session' }"
      >
        <img src="/calendar.svg" alt="Session" class="nav-icon" />
        <span class="nav-text">Schedules</span>
      </div>
      <div
        @click="switchComponent('records')"
        class="topbar-option"
        :class="{ active: activeComponent === 'records' }"
      >
        <img src="/records.svg" alt="Records" class="nav-icon" />
        <span class="nav-text">Reviews</span>
      </div>
      <div
        @click="switchComponent('files')"
        class="topbar-option"
        :class="{ active: activeComponent === 'files' }"
      >
        <img src="/uploadCloud.svg" alt="Upload" class="nav-icon" />
        <span class="nav-text">Files</span>
      </div>
      <div
        @click="switchComponent('fileManage')"
        class="topbar-option"
        :class="{ active: activeComponent === 'fileManage' }"
      >
        <img src="/files.svg" alt="Files" class="nav-icon" />
        <span class="nav-text">File Manager</span>
      </div>
    </div>
    <div class="topbar-date">
      <font-awesome-icon
        icon="fa-calendar-alt"
        class="date-icon"
        size="1x"
        color="#066678"
      />
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

  <!-- main content -->
  <div
    class="main-content"
    :class="{ 'content-expanded': isMobileView && !isSidebarVisible }"
  >
    <component
      :is="componentMap[activeComponent] || mainView"
      :mentorData="userData"
      :userInformation="users"
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

  <Transition name="fade" mode="out-in">
    <Offer
      v-if="showOffer"
      :userId="userId"
      :mentorData="userData"
      @close="showOffer = false"
      @confirm="handleOfferConfirm"
    />
  </Transition>
</template>

<style scoped>
/* Sidebar Styling */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
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
  transition: transform 0.3s ease;
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

.user-information h1 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  padding-top: 17px;
  margin-top: -1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 0.5rem;
}
.availability h1,
.course-offered h1 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  padding-top: 17px;
  margin-top: -0.4rem;
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
  left: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 104%;
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

/* Account dropdown active states */
.account-dropdown-content a:active {
  background-color: #004d5a;
  color: white;
  transform: scale(0.98);
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

/* Updated Topbar Styles */
.topbar {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
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
  font-size: 0.875rem;
  color: rgba(42, 67, 98, 0.9);
  font-weight: 500;
  background-color: #d4d7dd;
  padding: 10px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-icon {
  margin-right: 2px;
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

  /* Sidebar toggle button position */
  .sidebar-toggle {
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 1002;
    border-radius: 5px;
  }
}

/* Ensure date doesn't break layout on small screens */
@media (max-width: 576px) {
  .topbar-date {
    display: none;
  }

  /* Adjust content spacing when sidebar is hidden */
  .main-content {
    padding-left: 15px !important;
    padding-right: 15px !important;
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

/* Edit Information popup button states */
.edit-information-popup button {
  transition: all 0.2s ease;
}

.edit-information-popup button:active {
  background-color: #004d5a;
  color: white;
  transform: scale(0.98);
}

/* Active state for clickable elements */
.account-dropbtn:active,
.course-card:active,
.sidebar-toggle:active {
  transform: scale(0.98);
  transition: transform 0.2s ease;
}

/* Add active state styles for interactive elements */
.lines:active,
.popup-course:active {
  background-color: #006981;
  color: white;
  transform: scale(0.98);
}

/* Edit mode highlight */
.isEditing {
  background-color: rgba(0, 105, 129, 0.1);
  border: 2px solid #006981;
}
</style>
