<template>
  <div class="profile-page">
    <!-- App Header -->
    <header class="app-header">
      <div class="profile-section">
        <div class="avatar-container">
          <img
            alt="Profile image"
            class="avatar"
            src="https://storage.googleapis.com/a1aa/image/b5c5c738-a11d-4e1f-5c35-598c085890e6.jpg"
          />
        </div>
        <div class="profile-meta">
          <h1 class="profile-name">Barry D. Allen</h1>
          <p class="profile-title">Program Coordinator</p>
          <p class="profile-details">
            BS Information Technology • College of Computer Studies
          </p>
        </div>
      </div>
      <div class="current-date">
        {{ currentDate }}
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-container">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
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

      <!-- Content Area -->
      <main class="content-area">
        <!-- Dashboard shown by default -->
        <dashboard v-if="activeTab === 'dashboard'" :stats="stats" />

        <!-- Applications table -->
        <application v-if="activeTab === 'application'" />

        <!-- Users table -->
        <users v-if="activeTab === 'users'" />
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import dashboard from "@/components/adminpage/dashboard.vue";
import application from "@/components/adminpage/application.vue";
import users from "@/components/adminpage/users.vue";

export default {
  components: { dashboard, application, users },
  setup() {
    const activeTab = ref("dashboard");
    const stats = ref({
      learners: 1245,
      mentors: 86,
      applicants: 324,
    });

    const handleLogout = () => {
      console.log("Logout clicked");
    };

    // Get current date in readable format
    const currentDate = ref(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    return { activeTab, stats, handleLogout, currentDate };
  },
};

const fetchApplicants = async () => {
  try {
    const response = await axios
      .get("http://localhost:8000/api/admin/applicants", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("pre-fetched:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  } catch (error) {
    console.error(error);
  }
};

const activeTab = ref("dashboard"); // Dashboard shows by default
const stats = ref({
  learners: 1245,
  mentors: 86,
  applicants: 324,
});

const handleLogout = () => {
  console.log("Logout clicked");
};

onMounted(async () => {
  await fetchAll();
  await fetchApplicants();
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

.current-date {
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
</style>
