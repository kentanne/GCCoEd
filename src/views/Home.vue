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
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300&family=Anton&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap");
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Poppins", sans-serif;
}

html, body {
  width: 100vw;
  max-width: 100%;
  overflow-x: hidden;
  scroll-behavior: smooth;
  color: white;
  position: relative;
}

.home-container {
  width: 100vw;
  max-width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

body > * {
  max-width: 100%;
  overflow-x: hidden;
}

.intro-section {
  width: 100%;
  min-height: 100vh;
  background: url("@/assets/bg.png") no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
}

.intro-content {
  display: flex;
  align-items: center;
  gap: 3rem;
  max-width: 1200px;
  padding: 0 5%;
}

.intro-logo {
  width: 500px;
  height: auto;
}

.intro-text h1 {
  font-size: 6rem;
  color: #116275;
  font-family: "Anton", sans-serif;
  letter-spacing: 0.1em;
}

.highlight-ed {
  color: #0097b2;
  font-family: "Anton", sans-serif;
  letter-spacing: 0.1em;
}

.intro-text p {
  font-size: 3rem;
  color: #116275;
}

.content-section {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 40px 5% 0;
  width: 100%;
  flex-wrap: wrap;
}

.learners-section,
.mentors-section {
  flex: 1;
  min-height: 320px;
}

.learners-section {
  background-color: #02475e;
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
}

.learners-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.learners-section:hover::before {
  left: 100%;
}

.learners-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.learners-section h2 {
  color: #ffffff; 
}

.learners-image {
  width: 320px;
  height: auto;
  margin-left: -10px;
  transition: all 0.5s ease;
}

.learners-section:hover .learners-image {
  transform: scale(1.08) rotate(5deg);
}

.learner-text {
  transition: all 0.3s ease;
}

.learners-section:hover .learner-text {
  color: #a8dadc;
}

.mentors-section {
  background-color: white;
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
}

.mentors-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(1, 71, 97, 0.1), transparent);
  transition: 0.5s;
}

.mentors-section:hover::before {
  left: 100%;
}

.mentors-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.mentors-heading {
  color: #02475e;
}

.mentors-image {
  width: 290px;
  height: auto;
  margin-left: 40px;
  transition: all 0.5s ease;
}

.mentors-section:hover .mentors-image {
  transform: scale(1.05) rotate(-5deg);
}

.mentors-section .content-box p {
  color: #02475e;
  transition: all 0.3s ease;
}

.mentors-section:hover .content-box p {
  color: #116275;
}

.content-box {
  max-width: 750px;
  padding: 20px 0;
}

.mentor-content-box {
  max-width: 750px;
  padding: 40px 0;
  margin-right: 40px;
  margin-bottom: 30px;
}

.learners-content-box {
  max-width: 750px;
  padding: 40px 0;
  margin-left: 20px;
  margin-bottom: 30px;
}

.content-box h2 {
  font-size: 3.5rem;
  text-transform: uppercase;
  margin-bottom: 1rem;
  font-family: "Montserrat", sans-serif;
  letter-spacing: 0.1em;
}

.content-box p {
  font-size: 1.2rem;
  color: white;
  text-align: justify;
}

.how-it-works {
  text-align: center;
  padding: 40px 5%;
  background: #d9d9d9;
  color: #02475e;
}

.how-it-works h2 {
  font-size: 3rem;
  margin-top: 50px;
  color: #02475e;
  font-family: "Montserrat", sans-serif;
}

.how-it-works-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 50px;
}

.row {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.step {
  width: 30%;
  text-align: center;
  transition: transform 0.3s ease, color 0.3s ease;
}

.step:hover {
  transform: scale(1.05);
  color: #0097b2;
}

.step img {
  width: 120px;
  transition: transform 0.3s ease;
}

.step:hover img {
  transform: scale(1.1);
}

.step h3 {
  font-size: 1.3rem;
  margin-top: 10px;
  color: #02475e;
}

.step p {
  font-size: 0.9rem;
  color: #333;
}

.learn-more-btn {
  margin-top: 65px;
  padding: 10px 30px;
  font-size: 1.2rem;
  background-color: #02475e;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

.learn-more-btn:hover {
  background-color: #012f41;
}

.join-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: url("@/assets/school_bg.jpg") no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 80px 5%;
}

.join-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1;
}

.join-card {
  width: 350px;
  height: 480px;
  margin-top: 6rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 2;
}

.join-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.learner-card {
  background: #02475e;
  color: white;
}

.mentor-card {
  background: white;
  color: #02475e;
}

.join-card h3 {
  font-size: 1.5rem;
  font-weight: normal;
}

.join-card h2 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.join-card ul {
  list-style: none;
  padding: 0;
  margin-top: 2.5rem;
}

.join-card ul li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  text-align: left;
}

.join-card ul li i {
  margin-right: 25px;
  margin-top: 3px;
  flex-shrink: 0;
}

.join-btn {
  display: center;
  width: 60%;
  padding: 10px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  margin-top: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.learner-card .join-btn {
  background: white;
  color: #02475e;
}

.mentor-card .join-btn {
  background: #02475e;
  color: white;
}

.join-btn:hover {
  transform: scale(1.03);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .intro-content {
    flex-direction: column;
    text-align: center;
  }

  .intro-text h1 {
    font-size: 4rem;
  }

  .intro-text p {
    font-size: 2rem;
  }

  .join-section {
    flex-direction: column;
    gap: 20px;
  }

  .join-card {
    width: 90%;
  }

  .learners-section,
  .mentors-section {
    flex-direction: column;
    align-items: center;
  }

  .learners-section .content-box,
  .mentors-section .content-box {
    order: 0;
    margin-bottom: 20px;
  }

  .section-image {
    margin: 0;
  }

  .learners-image,
  .mentors-image {
    width: 250px;
  }

  .content-box h2 {
    font-size: 2.5rem;
  }

  .content-box p {
    font-size: 1rem;
  }

  .step {
    width: 100%;
    margin-bottom: 30px;
  }
}
</style>