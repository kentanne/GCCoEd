<template>
  <div class="reset-password-container">
    <div class="learning-element"></div>
    <div class="learning-element"></div>
    <div class="learning-element"></div>
    <div class="learning-element"></div>

    <header class="brand-header">
      <img src="/src/assets/logo_gccoed.png" alt="GCCoed Logo" class="logo-img">
      <span class="brand-name">GCCoed</span>
    </header>
    <div class="form-wrapper">
      <h2>Reset Password</h2>
      
      <form @submit.prevent="resetUserPass" v-if="!error">
        <div class="form-group">
          <div class="input-with-icon">
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="New Password"
              required
              minlength="8"
            />
          </div>
        </div>

        <div class="form-group">
          <div class="input-with-icon">
            <input
              type="password"
              id="password_confirmation"
              v-model="password_confirmation"
              placeholder="Confirm Password"
              required
            />
          </div>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Resetting..." : "Reset Password" }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-if="success" class="success-message">
        {{ success }}
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
axios.defaults.withXSRFToken = true; // Ensure CSRF token is sent with requests

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const csrf = async () => {
  try {
    await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
      withCredentials: true,
    });
    console.log("CSRF cookie set successfully");
    return true;
  } catch (error) {
    console.error("Error setting CSRF cookie:", error);
    return false;
  }
};

const resetUserPass = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    // First get CSRF token
    await csrf();

    const newPass = {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    };

    const response = await axios.patch(
      "http://localhost:8000/api/reset-password",
      newPass,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      }
    );

    if (response.status === 200) {
      success.value = "Password reset successfully! Redirecting to login...";
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    error.value = error.response?.data?.message || "Failed to reset password";
  } finally {
    loading.value = false;
  }
};

const router = useRouter();

const token = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

onMounted(async () => {
  // Get token and email from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  token.value = urlParams.get("token");
  email.value = urlParams.get("email");

  if (!token.value || !email.value) {
    error.value = "Invalid reset link";
    return;
  }
});
</script>

<style scoped>
html, body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
}

.reset-password-container {
  background: linear-gradient(145deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.learning-element {
  position: absolute;
  opacity: 0.8;
  z-index: 0;
  animation: float 20s infinite linear;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.learning-element:nth-child(1) {
  width: 60px;
  height: 45px;
  background: #ff7043;
  border-radius: 4px 8px 8px 4px;
  top: 15%;
  left: 10%;
  animation-duration: 25s;
}
.learning-element:nth-child(1)::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #ff8a65;
  border-radius: 4px 8px 8px 4px;
  transform: translateX(4px);
}

.learning-element:nth-child(2) {
  width: 90px;
  height: 6px;
  background: #ffd54f;
  transform: rotate(45deg);
  top: 30%;
  right: 10%;
  animation-duration: 20s;
  animation-delay: -5s;
}
.learning-element:nth-child(2)::before {
  content: '';
  position: absolute;
  width: 15px;
  height: 6px;
  background: #ffb74d;
  right: -12px;
  transform: rotate(-45deg);
}

.learning-element:nth-child(3) {
  width: 75px;
  height: 60px;
  background: white;
  border: 2px solid #64b5f6;
  border-radius: 2px;
  top: 60%;
  left: 20%;
  animation-duration: 30s;
  animation-delay: -10s;
}
.learning-element:nth-child(3)::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 4px;
  background: #64b5f6;
  top: 15px;
}

.learning-element:nth-child(4) {
  width: 50px;
  height: 70px;
  background: #e0e0e0;
  border-radius: 5px;
  bottom: 20%;
  right: 20%;
  animation-duration: 18s;
  animation-delay: -7s;
}
.learning-element:nth-child(4)::before {
  content: '';
  position: absolute;
  width: 45px;
  height: 30px;
  background: #f5f5f5;
  top: 8px;
  left: 4px;
  border-radius: 3px;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(40px, 40px) rotate(5deg);
  }
  50% {
    transform: translate(80px, 0) rotate(0deg);
  }
  75% {
    transform: translate(40px, -40px) rotate(-5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

.logo-img {
  height: 50px;
  width: auto;
  margin: 1rem; 
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  display: inline-block;
  vertical-align: middle;
}

.brand-name {
  position: fixed;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  letter-spacing: 0.4px;
  margin-top: 1.3rem; 
  margin-left: 4px;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.form-wrapper {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(52, 158, 177, 0.15);
  width: 320px;
  padding: 2rem;
  border: 1px solid rgba(230, 240, 255, 0.6);
  border-top: 9px solid rgb(88, 148, 251);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  transition: all 0.3s ease;
}

.form-wrapper:hover {
  transform: translate(-50%, -50%) translateY(-1px);
  box-shadow: 0 15px 30px rgba(235, 235, 235, 0.4);
}

h2 {
  color: #2d3748;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.2px;
}

.form-group {
  margin-bottom: 1.2rem;
}

input:focus {
  outline: none;
  border-color: #349eb1;
  box-shadow: 0 0 0 3px rgba(52, 158, 177, 0.1);
  background-color: white;
}

input::placeholder {
  color: #a0aec0;
  opacity: 1;
}

.input-with-icon {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 5rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1.1rem;
}

input {
  width: 100%;
  padding: 0.8rem 0.8rem 0.8rem 0.8rem; 
  border: 1.5px solid #d2d8e0;
  border-radius: 18px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background-color: #f0f5fa;
  height: 45px;
  box-sizing: border-box;
}

button {
  width: 50%;
  padding: 0.9rem;
  background: linear-gradient(to right, #349eb1, #3ab7cc);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: block;
  margin: 1.5rem auto 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(52, 158, 177, 0.15);
}

button:hover {
  background: linear-gradient(to right, #2e8b9e, #349eb1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 158, 177, 0.25);
}

button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(52, 158, 177, 0.25);
}

button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.4s;
}

button:hover::after {
  left: 100%;
}

button:disabled {
  background: #e2e8f0;
  color: #a0aec0;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

.error-message {
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 1.2rem;
  text-align: center;
  border: 1px solid #fed7d7;
  font-size: 0.85rem;
  animation: shake 0.4s ease;
}

.success-message {
  background-color: #f0fff4;
  color: #38a169;
  padding: 0.8rem;
  border-radius: 8px;
  margin-top: 1.2rem;
  text-align: center;
  border: 1px solid #c6f6d5;
  font-size: 0.85rem;
  animation: gentleAppear 0.5s ease-out;
}

@keyframes gentleAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  60% {
    transform: translateX(-4px);
  }
  40%,
  80% {
    transform: translateX(4px);
  }
}

@media (max-width: 768px) {
  .form-wrapper {
    margin: 30px 20px;
    padding: 18px;
  }
  .form-wrapper h2 {
    font-size: 1.2rem;
  }
  .input-with-icon input {
    font-size: 0.95rem;
    padding: 9px 10px;
  }
}

@media (max-width: 480px) {
  .form-wrapper {
    margin: 20px 10px;
    padding: 16px;
    width: 75%;
  }
  .form-wrapper h2 {
    font-size: 1.1rem;
  }
  .input-with-icon input {
    font-size: 0.9rem;
    padding: 8px;
  }
  button {
    font-size: 0.8rem;
    padding: 10px;
    width: 55%;
  }
  .brand-name {
    font-size: 1.7rem;
  }
}
</style>