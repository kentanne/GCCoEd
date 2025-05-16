<template>
  <div class="signup-container">
    <Navbar />

    <!-- <main>
      <div class="main-image">
        <img alt="Illustration" :src="logo" />
      </div>

      <div class="main-content">
        <h1>Sign Up</h1>
        <form @submit.prevent="signup">
          <div class="input-field">
            <label>DOMAIN EMAIL</label>
            <input
              type="email"
              v-model="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="input-field">
            <label>PASSWORD</label>
            <div class="input-with-icon">
              <i
                class="fas"
                :class="passwordVisible ? 'fa-eye' : 'fa-eye-slash'"
                @click="togglePasswordVisibility"
              ></i>
              <input
                :type="passwordVisible ? 'text' : 'password'"
                v-model="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <div class="input-field">
            <label>CONFIRM PASSWORD</label>
            <div class="input-with-icon">
              <i
                class="fas"
                :class="confirmPasswordVisible ? 'fa-eye' : 'fa-eye-slash'"
                @click="toggleConfirmPasswordVisibility"
              ></i>
              <input
                :type="confirmPasswordVisible ? 'text' : 'password'"
                v-model="password_confirmation"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>
          <div class="input-field">
            <label>ROLE</label>
            <div class="custom-select">
              <select v-model="role" required>
                <option value="" disabled selected class="placeholder-option">
                  Select your role
                </option>
                <option value="learner">Learner</option>
                <option value="mentor">Mentor</option>
              </select>
              <span class="select-arrow">▼</span>
            </div>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p class="switch-link">
          Already have an account? <router-link to="/login">Login</router-link>
        </p>
      </div>
    </main> -->

    <section class="join-section" id="get-started">
      <div class="join-card learner-card">
        <h3>Join as</h3>
        <h2>LEARNER</h2>
        <ul>
          <li>
            <i class="fas fa-check"></i> Find mentors for various subjects and
            skills.
          </li>
          <li>
            <i class="fas fa-check"></i> Schedule learning sessions at your
            convenience.
          </li>
          <li>
            <i class="fas fa-check"></i> Get guidance from experienced peers.
          </li>
          <li>
            <i class="fas fa-check"></i> Improve your knowledge with structured
            sessions.
          </li>
        </ul>
        <button class="join-btn" @click="signUpAsLearner">
          Join as LEARNER
        </button>
      </div>
      <div class="join-card mentor-card">
        <h3>Join as</h3>
        <h2>MENTOR</h2>
        <ul>
          <li>
            <i class="fas fa-check"></i> Share your knowledge and expertise.
          </li>
          <li>
            <i class="fas fa-check"></i> Set your availability and manage
            sessions.
          </li>
          <li>
            <i class="fas fa-check"></i> Help fellow students enhance their
            learning.
          </li>
          <li>
            <i class="fas fa-check"></i> Build leadership and teaching
            experience.
          </li>
        </ul>
        <button class="join-btn" @click="signUpAsMentor">Join as MENTOR</button>
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import logo from "@/assets/logo_gccoed.png";
import { registrationStore } from "@/stores/registrationStore";

export default {
  name: "SignupComponent",
  components: { Navbar },
  data() {
    return {
      logo,
      // email: "",
      // password: "",
      // password_confirmation: "",
      role: "",
      // passwordVisible: false,
      // confirmPasswordVisible: false,
    };
  },
  methods: {
    signup() {
      const store = registrationStore();

      store.passAndMail({
        // email: this.email,
        // password: this.password,
        // password_confirmation: this.password_confirmation,
        role: this.role,
      });

      console.log("Store data after signup:", store.registrationData); // Debugging

      if (this.role === "learner") {
        this.$router.push("/learner-info");
      }
      if (this.role === "mentor") {
        this.$router.push("/mentor-info");
      }
    },
    signUpAsLearner() {
      const store = registrationStore();
      store.passAndMail({
        role: "learner",
      });

      this.$router.push("/learner-info");
    },
    signUpAsMentor() {
      const store = registrationStore();
      store.passAndMail({
        role: "mentor",
      });

      this.$router.push("/mentor-info");
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    toggleConfirmPasswordVisibility() {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Montserrat", sans-serif;
}

html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  font-family: "Montserrat", sans-serif;
  color: white;
}

.signup-container {
  background-image: url("@/assets/bg.png");
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
  gap: 10rem;
  margin-top: 5rem;
}

.main-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-image img {
  width: 550px;
  height: auto;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  width: 100%;
  height: 560px;
  background: rgba(6, 102, 120, 0.4);
  padding: 2rem;
  border-radius: 30px;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
}

.main-content h1 {
  font-size: 1.8rem;
  color: rgb(255, 255, 255);
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 95%;
  border-radius: 25px;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  width: 100%;
}

.input-field label {
  font-size: 0.8rem;
  font-weight: 500;
  text-align: left;
  padding-left: 0.5rem;
  color: #ffffff;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(165, 161, 161, 0.9);
  cursor: pointer;
}

input {
  padding: 0.8rem;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255);
  outline: none;
  transition: 0.3s;
}

input::placeholder {
  color: rgba(62, 81, 90, 0.7);
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
}

input:focus {
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 8px rgb(242, 168, 134);
}

.custom-select {
  position: relative;
  width: 100%;
}

.custom-select select {
  padding: 0.8rem;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  font-size: 14px;
  background: rgba(7, 23, 84, 0.2);
  color: white;
  outline: none;
  transition: 0.3s;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  padding-right: 2.5rem;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  pointer-events: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.custom-select select option.placeholder-option {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
}

.custom-select select option {
  background: rgba(20, 106, 134, 0.9);
  color: white;
  padding: 10px;
}

.custom-select select:focus {
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 8px rgb(242, 168, 134);
}

button {
  background: #ffffff;
  color: #1c6b79;
  border: none;
  padding: 0.8rem;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  width: 50%;
  text-align: center;
  display: block;
  margin: 0.5rem auto 0;
  transition: 0.3s;
  margin-top: 1rem;
}

button:hover {
  background: #319cb0;
  transform: scale(1);
}

.switch-link {
  color: white;
  font-size: 1rem;
}

.switch-link a {
  color: #2b617e;
  text-decoration: none;
}

.switch-link a:hover {
  text-decoration: underline;
}

@media (min-width: 768px) {
  .main-image img {
    width: 600px;
  }

  .main-content {
    max-width: 420px;
  }
}

.join-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: url("@/assets/school_bg.png") no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 80px 5%;
}

.join-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.561);
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
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
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
</style>
