<template>
  <div class="login-container">
    <Navbar />

    <main>
      <div class="main-image">
        <img alt="Illustration" :src="logo" />
      </div>

      <div class="main-content">
        <h1>Login</h1>
        <form @submit.prevent="login">
          <div class="input-field">
            <label>DOMAIN EMAIL</label>
            <input
              type="text"
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
          <button type="submit">Login</button>
        </form>
        <p class="switch-link">
          Don't have an account? <router-link to="/signup">Sign up</router-link>
        </p>
        <p class="switch-link">
          <router-link to="/forgot-password">Forgot Password?</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import logo from "@/assets/logo_gccoed.png";
// import api from "../axios.js"; // Adjust the path as necessary
import axios from "axios";

axios.defaults.withCredentials = true; // Enable sending cookies with requests
axios.defaults.withXSRFToken = true; // Enable CSRF token handling

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default {
  name: "LoginComponent",
  components: { Navbar },
  data() {
    return {
      logo,
      email: "",
      password: "",
      passwordVisible: false,
    };
  },
  methods: {
    async csrf() {
      try {
        await axios.get("http://localhost:8000/sanctum/csrf-cookie");
        console.log("CSRF cookie set successfully");
        return true;
      } catch (error) {
        console.error("Error setting CSRF cookie:", error);
        return false;
      }
    },
    async login() {
      try {
        // Set CSRF token before login attempt
        const csrfSet = await this.csrf();
        if (!csrfSet) {
          console.error("Failed to set CSRF token");
          return;
        }

        const loginData = {
          login: this.email,
          password: this.password,
        };

        const response = await axios.post(
          "http://localhost:8000/api/login",
          loginData,
          {
            headers: {
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
          }
        );

        console.log("Login successful:", response.data);

        switch (response.data.user_role) {
          case null:
            this.$router.push("/signup");
            break;
          case "learner":
            this.$router.push("/learner");
            break;
          case "mentor":
            this.$router.push("/mentor");
            break;
          case "admin":
            this.$router.push("/admin");
            break;
          default:
            console.error("Unknown user role:", response.data.user_role);
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
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

.login-container {
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
  max-width: 450px;
  width: 100%;
  height: 450px;
  background: rgba(6, 102, 120, 0.4);
  padding: 2rem;
  border-radius: 30px;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
}

.main-content h1 {
  font-size: 1.8rem;
  color: rgb(255, 255, 255);
  margin-bottom: 0.8rem;
  font-weight: bold;
}

form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 95%;
  border-radius: 25px;
  margin-top: 1rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.input-field label {
  font-size: 0.85rem;
  font-weight: 400;
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
  background: rgb(255, 255, 255);
  outline: none;
  transition: 0.3s;
  font-family: "Montserrat", sans-serif;
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
  margin-top: 1.5rem;
  font-family: "Montserrat", sans-serif;
}

button:hover {
  background: #319cb0;
  transform: scale(1);
}

.switch-link {
  color: white;
  font-size: 1rem;
  font-weight: 400;
}

.switch-link a {
  color: #2b617e;
  text-decoration: none;
  font-weight: 500;
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
</style>
