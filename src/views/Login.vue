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
            <div class="input-with-icon">
              <i class="fas fa-user"></i>
              <input
                type="text"
                v-model="email"
                placeholder="Enter your email"
                required
              />
            </div>
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
            <p class="switch-link">
              <router-link to="/forgot-password">Forgot Password?</router-link>
            </p>
          </div>
          <button type="submit">Login</button>
        </form>
        <p class="switch-link">
          Don't have an account? <router-link to="/signup">Sign up</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import logo from "@/assets/logo_gccoed.png";
import api from "@/axios";

const router = useRouter();
const email = ref("");
const password = ref("");
const passwordVisible = ref(false);

function getCookie(name) {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
}

async function csrf() {
  try {
    await api.get("/sanctum/csrf-cookie");
    console.log("CSRF cookie set successfully");
    return true;
  } catch (error) {
    console.error("Error setting CSRF cookie:", error);
    return false;
  }
}

async function login() {
  try {
    // await csrf().then((success) => {
    //   if (!success) {
    //     console.error("Failed to set CSRF cookie");
    //     return;
    //   }

    console.log("All cookies:", document.cookie);
    const token = getCookie("XSRF-TOKEN");
    console.log("Retrieved XSRF-TOKEN:", token);

    const loginData = {
      login: email.value,
      password: password.value,
    };

    const response = api
      .post("/api/login", loginData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Login successful:", response.data);

        switch (response.data.user_role) {
          case null:
            router.push("/signup");
            break;
          case "learner":
            router.push("/learner");
            break;
          case "mentor":
            router.push("/mentor");
            break;
          case "admin":
            router.push("/admin");
            break;
          default:
            console.error("Unknown user role:", response.data.user_role);
            break;
        }
        // return response;
      });
  } catch (error) {
    console.error("Login failed:", error);
  }
}

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

onMounted(async () => {
  await csrf();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

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
  gap: 5rem;
  padding: 1rem;
  margin-top: 3rem;
}

.main-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-image img {
  width: 400px;
  height: auto;
  max-width: 100%;
  transition: all 0.3s ease;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  width: 100%;
  max-width: 400px;
  background: rgba(6, 102, 120, 0.5);
  padding: 2rem;
  border-radius: 30px;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 10px rgba(46, 34, 34, 0.6);
  transition: all 0.3s ease;
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
  gap: 1.5rem;
  width: 100%;
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

.input-with-icon input {
  padding: 0.8rem 2.5rem 0.8rem 1rem;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  font-size: 0.95rem;
  background: rgb(255, 255, 255);
  outline: none;
  transition: 0.3s;
  font-family: "Montserrat", sans-serif;
}

.input-with-icon i {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(165, 161, 161, 0.9);
}

.input-with-icon .fa-user,
.input-with-icon .fa-eye,
.input-with-icon .fa-eye-slash {
  right: 15px;
  left: auto;
}

.input-with-icon .fa-eye,
.input-with-icon .fa-eye-slash {
  cursor: pointer;
}

.input-with-icon .fa-user {
  cursor: default;
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
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif;
}

button:hover {
  background: #319cb0;
  color: white;
}

.switch-link {
  text-align: right;
  margin-top: 0.3rem;
  font-size: 0.85rem;
}

.switch-link a {
  color: #144149;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.switch-link a:hover {
  color: #f8f8f8;
}

@media (min-width: 768px) and (max-width: 1199px) {
  main {
    gap: 3rem;
  }

  .main-image img {
    width: 350px;
  }

  .main-content {
    max-width: 380px;
    padding: 1.5rem;
  }
}

/* Mobile Screens */
@media (max-width: 767px) {
  main {
    flex-direction: column;
    gap: 2rem;
    margin-top: 7rem;
  }

  .main-image img {
    position: absolute;
    top: 5.2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    width: 150px;
  }

  .main-content {
    max-width: 350px;
    padding: 1.5rem;
  }

  button {
    width: 60%;
  }
}

@media (max-width: 480px) {
  .main-image img {
    width: 170px;
  }

  .main-content {
    padding: 1.2rem;
  }

  .main-content h1 {
    font-size: 1.5rem;
  }

  button {
    width: 70%;
    padding: 0.7rem;
  }
}

/* Large Desktop Screens */
@media (min-width: 1200px) {
  main {
    gap: 8rem;
  }

  .main-image img {
    width: 500px;
  }

  .main-content {
    max-width: 450px;
    padding: 2.5rem;
  }
}
</style>
