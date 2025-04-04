<template>
  <div class="learnmore-container">
    <Navbar />
    
    <div class="system-explanation">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left back-icon"></i>
      </button>
      
      <!-- HOW OUR SYSTEM WORKS -->
      <h1 class="title animated-title">HOW OUR SYSTEM WORKS</h1>
      <div class="divider animated-divider"></div>
      
      <div class="intro-container">
        <img src="@/assets/logo_gccoed.png" alt="GCCoEd Logo" class="logo animated-logo">
        <p class="intro animated-description">
          GCCoEd is a web-based platform proposed to make the process of finding and scheduling peer-to-peer tutoring sessions efficient within our school community. With easy access for all students, it allows anyone to offer and receive tutoring in various subjects, book sessions at their convenience, and stay organized in their learning journey.
        </p>
      </div>
      
      <div class="divider tight-divider animated-divider"></div>
      
      <!-- Features section -->
      <div class="content-wrapper">
        <div class="feature-row">
          <div class="icon-container">
            <img src="@/assets/icon1.png" alt="Icon1" class="feature-icon animated-icon">
          </div>
          <div class="feature-section">
            <h3 class="feature-title animated-text">Find the Right Mentor or Learner</h3>
            <p class="feature-description animated-text">
              Students looking for guidance can search for mentors based on subjects, expertise, and availability. Filtering options allow users to narrow down their choices and find the most suitable match.
            </p>
          </div>
        </div>
        
        <div class="feature-row">
          <div class="icon-container">
            <img src="@/assets/icon3.png" alt="Icon3" class="feature-icon animated-icon">
          </div>
          <div class="feature-section">
            <h3 class="feature-title animated-text">Connect and Learn</h3>
            <p class="feature-description animated-text">
              Once a student finds a potential mentor, they can view their profile to learn more about their experience and qualifications. Communication is done via email, where both parties can discuss learning goals, session details, and scheduling.
            </p>
          </div>
        </div>
        
        <div class="feature-row">
          <div class="icon-container">
            <img src="@/assets/icon4.png" alt="Icon4" class="feature-icon animated-icon">
          </div>
          <div class="feature-section">
            <h3 class="feature-title animated-text">Schedule and Begin Sessions</h3>
            <p class="feature-description animated-text">
              After finalizing the details, students and mentors can arrange tutoring sessions at convenient times. Sessions can be adjusted or rescheduled as needed to ensure a smooth learning experience.
            </p>
          </div>
        </div>
      </div>
      
      <div class="divider animated-divider"></div>

      <!-- Unique features section -->
      <div class="unique-features">
        <h2 class="section-title">What Makes GCCoEd Different?</h2>
        <p class="section-description">
          GCCoEd is more than just a tutoring platform—it's a student-driven learning space designed specifically for our school community. Unlike other tutoring services, GCCoEd is built on peer-assisted learning, allowing students to be both learners and mentors, fostering a collaborative academic environment.
        </p>
        
        <div class="numbered-icons">
          <div class="icon-wrapper" @mouseenter="activeIcon = 1" @mouseleave="activeIcon = 0">
            <div class="icon-circle">1</div>
            <div class="icon-text" :class="{ active: activeIcon === 1 }">Peer-to-Peer Learning</div>
          </div>
          <div class="icon-wrapper" @mouseenter="activeIcon = 2" @mouseleave="activeIcon = 0">
            <div class="icon-circle">2</div>
            <div class="icon-text" :class="{ active: activeIcon === 2 }">School-Specific Platform</div>
          </div>
          <div class="icon-wrapper" @mouseenter="activeIcon = 3" @mouseleave="activeIcon = 0">
            <div class="icon-circle">3</div>
            <div class="icon-text" :class="{ active: activeIcon === 3 }">Flexible Learning</div>
          </div>
          <div class="icon-wrapper" @mouseenter="activeIcon = 4" @mouseleave="activeIcon = 0">
            <div class="icon-circle">4</div>
            <div class="icon-text" :class="{ active: activeIcon === 4 }">Comfortable Learning</div>
          </div>
        </div>
      </div>
      
      <div class="divider animated-divider"></div>

      <!-- FAQs section -->
      <div class="faq-section">
        <h2 class="section-title">FAQs</h2>
        <div class="faq-list">
          <div 
            class="faq-item" 
            v-for="(faq, index) in faqs" 
            :key="index"
            @click="toggleFaq(index)"
          >
            <div class="faq-question">
              {{ faq.question }}
              <i class="fas" :class="{'fa-chevron-down': !faq.open, 'fa-chevron-up': faq.open}"></i>
            </div>
            <div class="faq-answer" :class="{ 'open': faq.open }">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

      <div class="divider animated-divider"></div>

      <!-- Developers section -->
      <div class="developers-section">
        <h2 class="section-title">DEVELOPERS</h2>
        <div class="developers-container">
          <div class="developer-card">
            <div class="card-content">
              <img src="@/assets/paulo.jpg" alt="Paulo P. Cordova" class="developer-photo">
              <h3 class="developer-name">PAULO P. CORDOVA</h3>
              <p class="developer-specialty">Backend Developer</p>
              <p class="developer-role">Handles the server-side logic, authentication, and database management to ensure secure and efficient platform functionality.</p>
            </div>
          </div>
          <div class="developer-card">
            <div class="card-content">
              <img src="@/assets/kent.png" alt="Kent Ann G. Ecal" class="developer-photo">
              <h3 class="developer-name">KENT ANN G. ECAL</h3>
              <p class="developer-specialty">Frontend Developer</p>
              <p class="developer-role">Responsible for designing and developing the user interface using Vue.js, ensuring a seamless and responsive experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  name: "LearnMoreComponent",
  components: { Navbar },
  setup() {
    const router = useRouter();
    const activeIcon = ref(0);
    
    const faqs = ref([
      { question: "Who can use GCCoEd?", answer: "GCCoEd is exclusively available to students of Gordon College. It is designed to help students connect with peers for tutoring and educational support.", open: false },
      { question: "How do I become a mentor or learner?", answer: "To become a mentor or learner, you need to create two separate accounts using the same email and password — one for each role. This allows you to switch between mentoring and learning as needed.", open: false },
      { question: "Is there a fee for using GCCoEd?", answer: "No, GCCoEd is completely free for all students. The platform aims to promote peer learning without any financial barriers.", open: false },
      { question: "How do I schedule a session?", answer: "Once you find a mentor, you can communicate via email to agree on a suitable time for your tutoring session. The platform provides tools to help manage your schedule.", open: false },
      { question: "What if I need to cancel a session?", answer: "If you need to cancel a session, please inform your mentor as soon as possible to reschedule. Communication is key to ensuring a smooth experience.", open: false }
    ]);

    const toggleFaq = (index) => {
      faqs.value[index].open = !faqs.value[index].open;
    };

    const goBack = () => {
      router.go(-1);
    };

    return { activeIcon, faqs, toggleFaq, goBack };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  font-family: 'Montserrat', sans-serif;
  color: #2c3e50;
}

.learnmore-container {
  background-color: white;
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 40px;
  width: 100%;
}

.back-button {
  position: absolute;
  top: 145px;
  left: 65px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1000;
}

.back-icon {
  font-size: 30px;
  color: #02475e;
}

.system-explanation {
  width: 100%;
  margin: 0 auto;
  padding: 40px 5%;
  font-family: 'Montserrat', sans-serif;
  color: #2c3e50;
  line-height: 1.6;
}

.intro-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.logo {
  width: 280px;
  height: auto;
  flex-shrink: 0;
  object-fit: contain;
  transform: translateX(-100px);
  opacity: 0;
  animation: slideInFromLeft 0.5s forwards;
  animation-delay: 0.1s;
}

.intro {
  flex: 1;
  text-align: justify;
  font-size: 18px;
  color: #2c3e50;
  line-height: 1.7;
  margin: 0;
  padding-right: 20px;
  max-width: 800px;
  transform: translateX(-100px);
  opacity: 0;
  animation: slideInFromLeft 0.5s forwards;
  animation-delay: 0.3s;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
  margin-top: 50px;
}

.title {
  text-align: center;
  color: #02475e;
  margin-bottom: 30px;
  font-size: 36px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  margin-top: 20px;
  width: 100%;
  transform: translateX(-100px);
  opacity: 0;
  animation: slideInFromLeft 0.5s forwards;
  animation-delay: 0.2s;
}

.divider {
  height: 5px;
  background: #02475e;
  margin: 40px auto;
  width: 90%;
  max-width: 1200px;
  border: none;
  border-radius: 2px;
  transform: translateX(-100px);
  opacity: 0;
  animation: slideInFromLeft 0.5s forwards;
  animation-delay: 0.4s;
}

.divider.tight-divider {
  margin-top: 20px;
  margin-bottom: 20px;
}

.feature-row {
  display: flex;
  align-items: flex-start;
  gap: 40px;
  margin-bottom: 40px;
}

.icon-container {
  flex-shrink: 0;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 5px;
}

.feature-icon {
  width: 130px;
  height: 100px;
  object-fit: contain;
  transform: translateX(-100px);
  opacity: 0;
  animation: slideInFromLeft 0.5s forwards;
  animation-delay: 0.5s;
}

.feature-section {
  flex: 1;
  padding: 0;
}

.feature-title {
  color: #02475e;
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: 600;
  text-align: justify;
  transform: translateX(-100px);
  opacity: 0;
  animation: slideInFromLeft 0.5s forwards;
  animation-delay: 0.6s;
}

.feature-description {
  text-align: justify;
  margin-left: 0;
  font-size: 17px;
  color: #2c3e50;
  line-height: 1.7;
  transform: translateX(-100px);
  opacity: 0;
  animation: slideInFromLeft 0.4s forwards;
  animation-delay: 0.7s;
}

.unique-features {
  margin-top: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 1050px;
  text-align: left;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #02475e;
}

.section-description {
  font-size: 1.1rem;
  color: #666;
  text-align: justify;
  margin: 0 auto;
  max-width: 1050px;
}

.numbered-icons {
  display: flex;
  justify-content: center;
  gap: 200px;
  margin-top: 3rem;
  flex-wrap: wrap;
  margin-bottom: 4rem;
}

.icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.icon-circle {
  background-color: #349eb1;
  color: #fff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  transition: all 0.3s ease;
  z-index: 2;
}

.icon-text {
  position: absolute;
  top: 100%;
  margin-top: 15px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  background-color: #02475e;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 1rem;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}

.icon-text::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent #02475e transparent;
}

.icon-text.active {
  opacity: 1;
  transform: translateY(0);
}

.icon-wrapper:hover .icon-circle {
  transform: translateY(-10px);
  background-color: #02475e;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.faq-section {
  margin-top: 2rem;
  max-width: 1050px;
  margin-left: auto;
  margin-right: auto;
}

.faq-list {
  list-style: none;
  padding: 0;
}

.faq-item {
  margin-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-question {
  padding: 1rem 0;
  font-weight: 600;
  color: #02475e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question i {
  transition: transform 0.3s ease;
  color: #349eb1;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  color: #666;
  line-height: 1.6;
}

.faq-answer.open {
  max-height: 500px;
  padding-bottom: 1rem;
}

.developers-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.developers-container {
  display: flex;
  justify-content: center;
  gap: 100px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.developer-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 350px;
  padding: 25px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: scale(1);
  z-index: 1;
}

.developer-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.developer-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #f0f0f0;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.developer-card:hover .developer-photo {
  transform: scale(1.05);
}

.developer-name {
  font-size: 1.4rem;
  margin-bottom: 5px;
  color: #02475e;
  transition: color 0.3s ease;
}

.developer-card:hover .developer-name {
  color: #349eb1;
}

.developer-specialty {
  font-size: 1.1rem;
  font-weight: 600;
  color: #349eb1;
  margin-bottom: 15px;
  padding: 5px 15px;
  background: #f0f8ff;
  border-radius: 20px;
  display: inline-block;
}

.developer-role {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  text-align: center;
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .intro-container {
    flex-direction: column;
    gap: 30px;
  }
  
  .logo {
    transform: translateX(0);
    margin-bottom: 20px;
  }
  
  .feature-row {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .feature-title, .feature-description {
    text-align: center;
  }
  
  .numbered-icons {
    gap: 20px;
  }
  
  .developer-card {
    width: 100%;
    max-width: 400px;
  }
  
  .developers-container {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .numbered-icons {
    gap: 15px;
  }
  
  .icon-circle {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .icon-text {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
}
</style>