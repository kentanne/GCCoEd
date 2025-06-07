<template>
  <div class="profile-page">
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
      <svg class="toggle-icon" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"
        />
      </svg>
    </button>

    <!-- Overlay to close sidebar on mobile -->
    <div
      v-if="isMobileView && isSidebarVisible"
      class="sidebar-overlay"
      @click="toggleSidebar"
    ></div>

    <!-- App Header -->
    <header
      class="app-header"
      :class="{ 'header-expanded': isMobileView && !isSidebarVisible }"
    >
      <div class="profile-section">
        <div class="avatar-container">
          <img
            alt="Profile image"
            class="avatar"
            src="https://gordoncollegeccs.edu.ph/ccs/students/lamp/assets/profile.jpg"
          />
        </div>
        <div class="profile-meta">
          <h1 class="profile-name">{{ adminNameValue }}</h1>
          <p class="profile-title">
            College of Computer Science | Program Coordinator
          </p>
          <!-- <p class="profile-details">
            BS Information Technology • College of Computer Studies
          </p> -->
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
    </header>

    <!-- Main Content -->
    <div class="main-container">
      <!-- Sidebar Navigation with responsive classes -->
      <aside
        class="sidebar"
        :class="{
          'sidebar-mobile-visible': isSidebarVisible,
          'sidebar-mobile': isMobileView,
        }"
      >
        <nav class="app-navigation">
          <button
            class="nav-btn"
            :class="{ active: activeTab === 'dashboard' }"
            @click="activeTab = 'dashboard'"
          >
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z"
              />
            </svg>
            Dashboard
          </button>
          <button
            class="nav-btn"
            :class="{ active: activeTab === 'application' }"
            @click="activeTab = 'application'"
          >
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
              />
            </svg>
            Applications
          </button>
          <button
            class="nav-btn"
            :class="{ active: activeTab === 'users' }"
            @click="activeTab = 'users'"
          >
            <svg class="nav-icon" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
              />
            </svg>
            Users
          </button>

          <!-- Logout button moved to bottom of sidebar -->
          <div class="nav-bottom">
            <button class="nav-btn logout-btn" @click="handleLogout">
              <svg class="nav-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      <!-- Content Area with responsive class -->
      <main
        class="content-area"
        :class="{ 'content-expanded': isMobileView && !isSidebarVisible }"
      >
        <!-- Dashboard shown by default -->
        <dashboard
          v-if="activeTab === 'dashboard'"
          :stats="stats"
          :chartData="chartData"
        />

        <!-- Applications table -->
        <application
          v-if="activeTab === 'application'"
          :applicantsList="applicantsList"
        />

        <!-- Users table -->
        <users v-if="activeTab === 'users'" :users="usersFetch" />

        <!-- Add this where you want to display the data -->
        <!-- <div v-if="activeTab === 'users'" class="users-container">
          <div v-for="user in users" :key="user.id" class="user-item">
            <h3>{{ user.name }}</h3>
            <p>{{ user.email }}</p>
          </div>
        </div> -->

        <div v-if="activeTab === 'application'" class="applicants-container">
          <div
            v-for="applicant in applicantsList.value"
            :key="applicant.id"
            class="applicant-item"
          >
            <h3>{{ applicant.name }}</h3>
            <p>{{ applicant.email }}</p>
            <!-- Add more applicant properties as needed -->
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import dashboard from "@/components/adminpage/dashboard.vue";
import application from "@/components/adminpage/application.vue";
import users from "@/components/adminpage/users.vue";
import axios from "axios";
import api from "@/axios.js";
import { useRouter } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
// Import loading overlay
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const Router = useRouter();

// Add chartData ref
const chartData = ref({
  userCounts: null,
  courseBreakdown: null,
  yearBreakdown: null,
});

const adminName = async () => {
  try {
    const response = await api
      .get("/api/admin/profile", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        // console.log("Admin name fetched:", response.data.name);
        if (response.status === 200) {
          adminNameValue.value = response.data.name || "Admin";
        }
      });
    // return response.data.name || "Admin";
  } catch (error) {
    console.error("Error fetching admin name:", error);
  }
};

// Add loading state
const isLoading = ref(false);

const startLoading = () => {
  isLoading.value = true;
};

const stopLoading = () => {
  isLoading.value = false;
};

// Reactive refs
const activeTab = ref("dashboard");
const stats = ref({
  learners: 0,
  mentors: 0,
  applicants: 0,
});

// Add these refs for storing API data
const usersFetch = ref([]);
const applicantsList = ref([]);

// Get current date in readable format
const currentDate = ref(
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
);

// Add these variables after your existing ref declarations
const isSidebarVisible = ref(false); // For mobile devices only
const isMobileView = ref(false);
const adminNameValue = ref("");

// Methods
const handleLogout = () => {
  // alert("Logout clicked");
  logout();
  Router.push("/login");
};

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

// Update the fetch functions to store the data and bind chartData
const fetchAll = async () => {
  try {
    const response = await api.get("/api/admin", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    });

    console.log("Response data:", response.data);

    // Map the response data to include gender and program/course
    usersFetch.value = response.data.users.map((user) => ({
      ...user,
      gender: user.gender || "N/A",
      program: user.course || "N/A", // Map course to program
      role: user.role.toLowerCase(),
      secondary_role: user.secondary_role?.toLowerCase() || "N/A",
    }));

    // Update stats
    stats.value = {
      learners: response.data.counts.learners || 0,
      mentors: response.data.counts.approved_mentors || 0,
      applicants: response.data.counts.pending_mentors || 0,
    };

    // Bind chart data from the response payload
    chartData.value = {
      userCounts: response.data.counts || null,
      courseBreakdown: response.data.course_breakdown || null,
      yearBreakdown: response.data.year_breakdown || null,
    };

    console.log("Chart data bound:", chartData.value);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Reset chartData on error
    chartData.value = {
      userCounts: null,
      courseBreakdown: null,
      yearBreakdown: null,
    };
  }
};

const fetchApplicants = async () => {
  try {
    const response = await api.get("/api/admin/applicants", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    });
    applicantsList.value = response.data; // Store the applicants data
  } catch (error) {}
};

const logout = async () => {
  try {
    const response = await api
      .post(
        "/api/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          createToast("Logout successful!", {
            position: "bottom-right",
            type: "success",
            transition: "slide",
            timeout: 2000,
            showIcon: true,
            toastBackgroundColor: "#319cb0",
          });
          Router.push("/login");
        } else {
          createToast("Logout failed!", {
            position: "bottom-right",
            type: "error",
            transition: "slide",
            timeout: 2000,
            showIcon: true,
          });
        }
      });
  } catch (error) {}
};

// Lifecycle hook
onMounted(async () => {
  try {
    // Start loading before any fetch operations
    startLoading();

    // Check initial screen size
    checkMobileView();
    window.addEventListener("resize", checkMobileView);

    // Use Promise.all to wait for all fetch operations to complete
    await Promise.all([fetchAll(), fetchApplicants(), adminName()]);
  } catch (error) {
    createToast("Error loading data. Please refresh the page.", {
      position: "top-right",
      type: "danger",
      transition: "slide",
      timeout: 5000,
      showIcon: true,
    });
  } finally {
    stopLoading();
  }
});
</script>

<style scoped>
:root {
  --primary: #4361ee; /* Vibrant blue */
  --primary-light: #4895ef; /* Lighter blue */
  --primary-dark: #3f37c9; /* Darker blue */
  --secondary: #f8f9fa; /* Light gray background */
  --sidebar-bg: #1c3858; /* Dark navy for sidebar */
  --sidebar-bottom: #0f2438; /* Even darker for bottom section */
  --accent: #7209b7; /* Purple accent */
  --text: #2b2d42; /* Dark text */
  --text-light: #8d99ae; /* Light text */
  --white: #ffffff;
  --border: #e9ecef;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.profile-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--secondary);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
}

/* Header Styles */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(
    135deg,
    var(--primary) 0%,
    var(--primary-dark) 100%
  );
  color: var(--white);
  position: relative;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-meta {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(43, 64, 93);
  margin-bottom: 0.25rem;
}

.profile-title {
  font-size: 0.875rem;
  color: rgba(60, 80, 114, 0.9);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.profile-details {
  font-size: 0.75rem;
  color: rgba(44, 59, 106, 0.7);
}

.topbar-date {
  font-size: 0.875rem;
  color: rgba(42, 67, 98, 0.9);
  font-weight: 500;
  background-color: #d4d7dd;
  padding: 10px;
  border-radius: 20px;
}

/* Main Container */
.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar Styles */
.sidebar {
  width: 220px;
  background-color: rgb(40, 70, 86);
  color: var(--white);
  display: flex;
  flex-direction: column;
  margin-right: 2.5rem;
  flex-shrink: 0;
}

/* Sidebar Navigation */
.app-navigation {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  flex: 1;
  margin-top: 1.5rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 6px;
  border: none;
  background: none;
  color: rgba(253, 253, 253, 0.8);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.712);
  color: var(--white);
}

.nav-btn.active {
  background: rgba(255, 255, 255, 0.712);
  color: black;
  box-shadow: 0 4px 12px rgba(114, 9, 183, 0.3);
}

.nav-icon {
  width: 20px;
  height: 20px;
  color: currentColor;
}

/* Nav bottom section */
.nav-bottom {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  width: 100%;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.693);
}

/* Content Area */
.content-area {
  flex: 1;
  background-color: var(--white);
  border-radius: 12px 0 0 0;
  box-shadow: var(--shadow);
  padding: 2rem;
  overflow-y: auto;
  margin: 1.5rem 1.5rem 1.5rem 0;
}
.mosha__toast .mosha__toast__content {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
}

.mosha__toast .mosha__toast__content .mosha__toast__content__text {
  padding: 0.5rem;
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

/* Add these new style rules */

/* Mobile Sidebar Toggle Button */
.sidebar-toggle {
  display: none;
  background: var(--primary);
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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.toggle-icon {
  width: 24px;
  height: 24px;
}

.sidebar-toggle:hover {
  background-color: var(--primary-dark);
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
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 1000;
  }

  /* State when sidebar is toggled visible */
  .sidebar-mobile-visible {
    transform: translateX(0);
  }

  /* Adjust header when sidebar is hidden */
  .header-expanded {
    padding-left: 70px;
  }

  /* Adjust content when sidebar is hidden */
  .content-expanded {
    margin-left: 0;
    width: 100%;
  }

  /* Update main container layout */
  .main-container {
    flex-direction: column;
  }

  /* Adjust content area on mobile */
  .content-area {
    margin-left: 0;
    width: 100%;
    transition: margin-left 0.3s ease;
  }
}

/* Ensure date doesn't break layout on small screens */
@media (max-width: 576px) {
  .current-date {
    display: none;
  }

  .app-header {
    padding: 0.8rem;
  }

  .profile-meta {
    font-size: 0.9rem;
  }

  .avatar-container {
    width: 60px;
    height: 60px;
  }
}

/* Make sure sidebar mobile styles override defaults */
.sidebar-mobile-visible {
  transform: translateX(0) !important;
}
</style>
