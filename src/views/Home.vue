<template>
  <div class="home-container">
    <Navbar />
    <main class="intro-section" id="home">
      <div class="intro-content">
        <img alt="Illustration" :src="logo" class="intro-logo" />
        <div class="intro-text">
          <h1>GCCo<span class="highlight-ed">Ed</span>:</h1>
          <p>A Peer-Assisted Educational Sessions</p>
        </div>
      </div>
    </main>

    <section id="learners" class="content-section learners-section">
      <div class="content-box learners-content-box">
        <h2 class="learners-heading">LEARNERS</h2>
        <p class="learner-text">
          As a learner, you get the chance to boost your knowledge and sharpen
          your skills in subjects that matter to you. Whether you're prepping
          for exams, struggling with tricky topics, or just eager to learn more,
          our platform connects you with mentors who can help. It's all about
          learning at your own pace, with flexible and personalized support to
          help you reach your academic goals.
        </p>
      </div>
      <img
        class="section-image learners-image"
        src="@/assets/learners.png"
        alt="Learners Illustration"
      />
    </section>
    <section id="mentors" class="content-section mentors-section">
      <img
        class="section-image mentors-image"
        src="@/assets/mentors.png"
        alt="Mentors Illustration"
      />
      <div class="content-box mentor-content-box">
        <h2 class="mentors-heading">MENTORS</h2>
        <p>
          Being a mentor is more than just sharing what you know, it's about
          helping others grow. By guiding fellow students through their academic
          hurdles, you strengthen your own understanding while making a positive
          difference. It's a fulfilling way to develop leadership skills,
          improve communication, and contribute to a supportive student
          community.
        </p>
      </div>
    </section>
    <section id="how-it-works" class="how-it-works">
      <h2>HOW IT WORKS</h2>
      <div class="how-it-works-grid">
        <div class="row">
          <div class="step">
            <img src="@/assets/icon1.png" alt="Find a Mentor or Learner" />
            <h3>Find a Mentor or Learner</h3>
            <p>
              Search and filter peers based on subjects, expertise,
              availability, and ratings.
            </p>
          </div>
          <div class="step">
            <img
              src="@/assets/icon2.png"
              alt="Check Profiles & Qualifications"
            />
            <h3>Check Profiles & Qualifications</h3>
            <p>
              View mentor and learner profiles, including expertise, experience,
              and session availability.
            </p>
          </div>
          <div class="step">
            <img src="@/assets/icon3.png" alt="Learn & Teach" />
            <h3>Learn & Teach</h3>
            <p>
              Expand your knowledge or share your expertise by joining
              peer-assisted sessions.
            </p>
          </div>
        </div>
        <div class="row">
          <div class="step">
            <img src="@/assets/icon4.png" alt="Schedule Your Session" />
            <h3>Schedule Your Session</h3>
            <p>
              Book a tutoring session at a time that works best for both you and
              your peer.
            </p>
          </div>
          <div class="step">
            <img src="@/assets/icon5.png" alt="Get Notified" />
            <h3>Get Notified</h3>
            <p>
              Receive email reminders for upcoming sessions, booking changes, or
              cancellations.
            </p>
          </div>
          <div class="step">
            <img src="@/assets/icon6.png" alt="Rate & Review" />
            <h3>Rate & Review</h3>
            <p>
              Provide feedback on completed sessions to help improve the
              learning experience for others.
            </p>
          </div>
        </div>
      </div>
      <button class="learn-more-btn" @click="goToLearnMore">LEARN MORE</button>
    </section>
    <section class="join-section" id="get-started">
      <div class="get-started-card">
        <h2 class="get-started-title">Ready to Get Started?</h2>
        <div class="get-started-content">
          <ul class="benefits-list">
            <li>
              <font-awesome-icon
                :icon="['fas', 'check-circle']"
                class="benefit-icon"
              />
              Connect with mentors in various subjects
            </li>
            <li>
              <font-awesome-icon
                :icon="['fas', 'check-circle']"
                class="benefit-icon"
              />
              Share your knowledge as a mentor
            </li>
            <li>
              <font-awesome-icon
                :icon="['fas', 'check-circle']"
                class="benefit-icon"
              />
              Flexible scheduling for sessions
            </li>
            <li>
              <font-awesome-icon
                :icon="['fas', 'check-circle']"
                class="benefit-icon"
              />
              Join our supportive learning community
            </li>
          </ul>
          <button class="signup-btn" @click="goToSignup">JOIN NOW</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import logo from "@/assets/logo_gccoed.png";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "HomeComponent",
  components: {
    Navbar,
  },
  data() {
    return {
      logo,
    };
  },
  methods: {
    goToLearnMore() {
      this.$router.push("/learn-more");
    },
    goToSignup() {
      this.$router.push("/login");
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80;
        const targetPosition = element.offsetTop - navbarHeight;

        this.smoothScrollTo(targetPosition, 1000); // 1000ms duration
      }
    },
    smoothScrollTo(targetPosition, duration) {
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = this.ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };

      requestAnimationFrame(animation);
    },
    ease(t, b, c, d) {
      // Easing function for smooth animation
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    },
  },
  mounted() {
    // Listen for navigation events from the Navbar component
    this.$root.$on("navigate-to-section", this.scrollToSection);
  },
  beforeDestroy() {
    // Clean up the event listener
    this.$root.$off("navigate-to-section", this.scrollToSection);
  },
};
</script>

<style scoped>
@import "@/assets/homestyles.css";

/* Enhanced smooth scrolling */
* {
  scroll-behavior: smooth;
}

html {
  scroll-behavior: smooth;
}

/* Additional styles for FontAwesome icons */
.benefit-icon {
  color: #31b046;
  margin-right: 0.5rem;
  font-size: 1rem;
}

/* Ensure sections have proper spacing for smooth navigation */
.content-section,
.how-it-works,
.join-section,
.intro-section {
  scroll-margin-top: 100px; /* Increased offset for better positioning */
  padding-top: 20px; /* Add some padding to prevent content from being hidden */
}

/* Ensure smooth transitions for all scrollable elements */
.home-container {
  scroll-behavior: smooth;
}
</style>
