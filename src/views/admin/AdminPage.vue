<template>
  <div class="profile-page">
    <!-- Top bar -->
    <header class="header">
      <div class="header-content">
        <img 
          alt="Profile image"
          class="profile-image"
          src="https://storage.googleapis.com/a1aa/image/b5c5c738-a11d-4e1f-5c35-598c085890e6.jpg"
        />
        <div class="profile-info">
          <p class="profile-name">Barry D. Allen</p>
          <p class="profile-position">Program Coordinator</p>
          <p class="profile-degree">Bachelor of Science in Information Technology</p>
          <p class="profile-college">College of Computer Studies</p>
        </div>
      </div>
      <div class="logout-button" @click="handleLogout">
        <i class="logout-icon"></i>
        <span class="logout-text">LOGOUT</span>
      </div>
    </header>

    <main class="main-content">
      <!-- Gradient backgrounds -->
      <div class="gradient-shape top-gradient"></div>
      <div class="gradient-shape bottom-gradient"></div>
      
      <!-- All three buttons always visible -->
      <div class="buttons-container">
        <button 
          class="action-button"
          :class="{ 'active-tab': activeTab === 'dashboard' }"
          @click="activeTab = 'dashboard'"
        >
          DASHBOARD
        </button>
        <button 
          class="action-button"
          :class="{ 'active-tab': activeTab === 'application' }"
          @click="activeTab = 'application'"
        >
          APPLICATIONS
        </button>
        <button
          class="action-button"
          :class="{ 'active-tab': activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          USERS
        </button>
      </div>

      <!-- Dashboard shown by default -->
      <dashboard 
        v-if="activeTab === 'dashboard'" 
        :stats="stats" 
      />

      <!-- Applications table -->
      <application v-if="activeTab === 'application'" />

      <!-- Users table -->
      <users v-if="activeTab === 'users'" />
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'
import dashboard from '@/components/adminpage/dashboard.vue'
import application from '@/components/adminpage/application.vue'
import users from '@/components/adminpage/users.vue'

export default {
  components: { dashboard, application, users },
  setup() {
    const activeTab = ref('dashboard') // Dashboard shows by default
    const stats = ref({
      learners: 1245,
      mentors: 86,
      applicants: 324
    })

    const handleLogout = () => {
      console.log('Logout clicked')
    }

    return { activeTab, stats, handleLogout }
  }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.content-area {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0c434d;
  padding: 1.5rem 2rem;
  height: 90px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 85%;
}

.profile-image {
  width: 6rem;
  height: 6rem;
  border-radius: 9999px;
  object-fit: cover;
  flex-shrink: 0;
}

.profile-info {
  color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.profile-name {
  font-weight: 800;
  font-style: italic;
  font-size: 1.5rem;
  margin: 0;
  line-height: 1.2;
}

.profile-position,
.profile-degree,
.profile-college {
  font-style: italic;
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  line-height: 1.2;
}

.logout-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 300;
  letter-spacing: 0.025em;
  user-select: none;
  cursor: pointer;
  flex-shrink: 0;
  margin-left: 1rem;
}

.logout-icon::before {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  content: '\f2f5';
  font-size: 1.875rem;
}

.logout-text {
  margin-top: 0.25rem;
}

.main-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem 5rem;
  min-height: calc(100vh - 88px);
}

.gradient-shape {
  position: absolute;
  width: 24rem;
  height: 24rem;
  background-color: #3B9AA9;
  opacity: 0.2;
  border-radius: 9999px;
  filter: blur(120px);
  pointer-events: none;
}

.top-gradient {
  top: 0;
  left: 0;
  transform: translate(-5rem, -5rem);
}

.bottom-gradient {
  bottom: 0;
  right: 0;
  transform: translate(5rem, 5rem);
}

.buttons-container {
  display: flex;
  gap: 3rem;
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 600px;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.action-button {
  font-weight: 800;
  color: white;
  font-size: 1rem;
  border-radius: 9999px;
  padding: 0.75rem 2rem;
  background-image: linear-gradient(to right, #6DD1E3, #0B3E8A);
  transition: all 0.3s ease;
  width: 200px;
  text-align: center;
  border: none;
  cursor: pointer;
}

.action-button:hover {
  background-image: linear-gradient(to right, #0B3E8A, #6DD1E3);
}

.dashboard-cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  z-index: 10;
  position: relative;
}

.dashboard-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  padding: 2rem;
  width: 280px;
  height: 280px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.15);
}

.card-text {
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  color: #384869;
  margin: 0 0 1rem 0;
  font-weight: 500;
  text-align: center;
}

.card-divider {
  border: 0;
  height: 4px;
  background: linear-gradient(to right, transparent, rgba(59, 154, 169, 0.5), transparent);
  margin: 0.5rem 0;
}

.card-number-container {
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  position: absolute;
  font-size: 8rem;
  color: rgba(59, 154, 169, 0.2);
  z-index: 0;
}

.card-value {
  font-size: 3.5rem;
  font-weight: 700;
  color: #0b2548;
  margin: 0;
  line-height: 1;
  position: relative;
  z-index: 1;
}

.active-tab {
  background-image: linear-gradient(to right, #0B3E8A, #3B9AA9) !important;
  box-shadow: 0 0 15px rgba(59, 154, 169, 0.5);
}
</style>