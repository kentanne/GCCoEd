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
              <input
                type="text"
                v-model="email"
                placeholder="Enter your email"
                :disabled="isLoading"
                required
              />
              <font-awesome-icon :icon="['fas', 'user']" class="input-icon" />
            </div>
          </div>
          <div class="input-field">
            <label>PASSWORD</label>
            <div class="input-with-icon">
              <input
                :type="passwordVisible ? 'text' : 'password'"
                v-model="password"
                placeholder="Enter your password"
                :disabled="isLoading"
                required
              />
              <font-awesome-icon
                :icon="['fas', passwordVisible ? 'eye' : 'eye-slash']"
                @click="togglePasswordVisibility"
                class="input-icon password-toggle"
              />
            </div>
            <p class="switch-link">
              <router-link to="/forgot-password">Forgot Password?</router-link>
            </p>
          </div>
          <button
            type="submit"
            :class="{ loading: isLoading, active: isButtonActive }"
            @mousedown="setButtonActive(true)"
            @mouseup="setButtonActive(false)"
            @mouseleave="setButtonActive(false)"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? "Logging in..." : "Login" }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api, { setToken, setUserData } from "@/axios.js";
import Navbar from "@/components/Navbar.vue";
import logo from "@/assets/logo_gccoed.png";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

const router = useRouter();
const email = ref("");
const password = ref("");
const passwordVisible = ref(false);
const isLoading = ref(false);
const isButtonActive = ref(false);

function setButtonActive(active) {
  if (!isLoading.value) {
    isButtonActive.value = active;
  }
}

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

async function login() {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    const loginData = {
      login: email.value,
      password: password.value,
    };

    const response = await api
      .post("/api/login", loginData)
      .then((res) => {
        if (res.status === 200) {
          setToken(res.data.token);

          // Store user data properly
          setUserData(res.data.user);

          createToast("Login successful!", {
            position: "bottom-right",
            type: "success",
            transition: "slide",
            timeout: 2000,
            showIcon: true,
            toastBackgroundColor: "#319cb0",
          });

          // Redirect based on user role
          const userRole = res.data.user_role;
          switch (userRole) {
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
              router.push("/signup");
          }
        } else {
          throw new Error("Login failed");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        createToast("Login failed. Please try again.", {
          position: "bottom-right",
          type: "error",
          transition: "slide",
          timeout: 2000,
          showIcon: true,
          toastBackgroundColor: "#ff4d4d",
        });
        throw error;
      });
  } catch (e) {
    // console.error("Login failed:", error);
    // createToast("Login failed. Please try again.", {
    //   position: "bottom-right",
    //   type: "error",
    //   transition: "slide",
    //   timeout: 2000,
    //   showIcon: true,
    //   toastBackgroundColor: "#ff4d4d",
    // });
    // alert(error.response?.data?.message || "Login failed. Please try again.");
  } finally {
    isLoading.value = false;
  }
}
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

.input-with-icon input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-icon {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  color: rgba(165, 161, 161, 0.9);
  font-size: 16px;
}

.input-icon.password-toggle {
  cursor: pointer;
}

.input-icon:not(.password-toggle) {
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0.5rem auto 0;
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif;
  min-height: 48px;
}

button:hover:not(:disabled) {
  background: #319cb0;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

button:active,
button.active {
  transform: translateY(0);
  background: #2a8a9e;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

button.loading {
  pointer-events: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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

@media (max-width: 767px) {
  main {
    flex-direction: column;
    gap: 2rem;
    margin-top: 3em;
  }

  .main-image img {
    display: none;
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

.mosha__toast .mosha__toast__content {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
}

.mosha__toast .mosha__toast__content .mosha__toast__content__text {
  padding: 0.5rem;
}
</style>
