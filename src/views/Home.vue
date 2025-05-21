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
          your skills in subjects that matter to you. Whether you're prepping for
          exams, struggling with tricky topics, or just eager to learn more, our
          platform connects you with mentors who can help. It's all about learning at
          your own pace, with flexible and personalized support to help you reach
          your academic goals.
        </p>
       
      </div>
      <img class="section-image learners-image" src="@/assets/learners.png" alt="Learners Illustration" />
    </section>
    <section id="mentors" class="content-section mentors-section">
      <img class="section-image mentors-image" src="@/assets/mentors.png" alt="Mentors Illustration" />
      <div class="content-box mentor-content-box">
        <h2 class="mentors-heading">MENTORS</h2>
        <p>
          Being a mentor is more than just sharing what you know, it's about helping
          others grow. By guiding fellow students through their academic hurdles,
          you strengthen your own understanding while making a positive
          difference. It's a fulfilling way to develop leadership skills, improve
          communication, and contribute to a supportive student community.
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
            <p>Search and filter peers based on subjects, expertise, availability, and ratings.</p>
          </div>
          <div class="step">
            <img src="@/assets/icon2.png" alt="Check Profiles & Qualifications" />
            <h3>Check Profiles & Qualifications</h3>
            <p>View mentor and learner profiles, including expertise, experience, and session availability.</p>
          </div>
          <div class="step">
            <img src="@/assets/icon3.png" alt="Learn & Teach" />
            <h3>Learn & Teach</h3>
            <p>Expand your knowledge or share your expertise by joining peer-assisted sessions.</p>
          </div>
        </div>
        <div class="row">
          <div class="step">
            <img src="@/assets/icon4.png" alt="Schedule Your Session" />
            <h3>Schedule Your Session</h3>
            <p>Book a tutoring session at a time that works best for both you and your peer.</p>
          </div>
          <div class="step">
            <img src="@/assets/icon5.png" alt="Get Notified" />
            <h3>Get Notified</h3>
            <p>Receive email reminders for upcoming sessions, booking changes, or cancellations.</p>
          </div>
          <div class="step">
            <img src="@/assets/icon6.png" alt="Rate & Review" />
            <h3>Rate & Review</h3>
            <p>Provide feedback on completed sessions to help improve the learning experience for others.</p>
          </div>
        </div>
      </div>
      <button class="learn-more-btn" @click="goToLearnMore">LEARN MORE</button>
    </section>
    <section class="join-section" id="get-started">
      <div class="join-card learner-card">
        <h3>Join as</h3>
        <h2>LEARNER</h2>
        <ul>
          <li><i class="fas fa-check"></i> Find mentors for various subjects and skills.</li>
          <li><i class="fas fa-check"></i> Schedule learning sessions at your convenience.</li>
          <li><i class="fas fa-check"></i> Get guidance from experienced peers.</li>
          <li><i class="fas fa-check"></i> Improve your knowledge with structured sessions.</li>
        </ul>
        <button class="join-btn" @click="goToSignup">REGISTER</button>
      </div>
      <div class="join-card mentor-card">
        <h3>Join as</h3>
        <h2>MENTOR</h2>
        <ul>
          <li><i class="fas fa-check"></i> Share your knowledge and expertise.</li>
          <li><i class="fas fa-check"></i> Set your availability and manage sessions.</li>
          <li><i class="fas fa-check"></i> Help fellow students enhance their learning.</li>
          <li><i class="fas fa-check"></i> Build leadership and teaching experience.</li>
        </ul>
        <button class="join-btn" @click="goToSignup">REGISTER</button>
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
      this.$router.push('/learn-more');
    },
    goToSignup() {
      this.$router.push('/signup');
    }
  }
};

</script>

<style scoped>
@import "@/assets/homestyles.css";
</style>
