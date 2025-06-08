<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/axios.js";
import "mosha-vue-toastify/dist/style.css";
import { createToast } from "mosha-vue-toastify";

const router = useRouter();

const step = ref(1);
const loading = ref(false);
const error = ref("");
const success = ref("");

// Step 1 data
const identifier = ref("");
// const identifierType = computed(() => {
//   if (identifier.value.includes("@")) return "email";
//   if (/^\d+$/.test(identifier.value)) return "id";
//   return "name";
// });

// Step 2 data
const verificationData = ref({
  pre_cred: "",
  //   type: "",
  id: "",
  name: "",
  email: "",
  role: "",
  secondary_role: "",
});

const roles = ["learner", "mentor"];

const handleStep1 = async () => {
  if (!identifier.value) {
    error.value = "Please enter your email, ID number, or account name";
    return;
  }

  loading.value = true;
  error.value = "";

  // Store the identifier and type for step 2
  verificationData.value.pre_cred = identifier.value;
  //   verificationData.value.type = identifierType.value;

  // Move to step 2 without making API call
  step.value = 2;
  loading.value = false;
};

const handleStep2 = async () => {
  // Validate required fields
  const required = ["id", "name", "email", "role"];
  const missing = required.filter((field) => !verificationData.value[field]);

  if (missing.length > 0) {
    error.value = `Please fill in all required fields: ${missing.join(", ")}`;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await api
      .post("/api/forgot-password", verificationData.value, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.log(
          "Password reset request sent successfully: ",
          response.data
        );
        if (response.status === 200) {
          createToast("Password reset link sent!", {
            position: "bottom-right",
            type: "success",
            transition: "slide",
            timeout: 2000,
            showIcon: true,
            toastBackgroundColor: "#319cb0",
          });
        }
      });
  } catch (error) {
    console.error("Error sending password reset request:", error);
    error.value = error.response?.data?.message || "Verification failed";
    if (error.response?.status === 422) {
      step.value = 1;
    }
  } finally {
    loading.value = false;
    router.push("/#/login");
  }
};
</script>

<template>
  <div class="forgot-password-container">
    <header class="brand-header">
      <img
        src="/src/assets/logo_gccoed.png"
        alt="GCCoed Logo"
        class="logo-img"
      />
      <span class="brand-name">GCCoEd</span>
    </header>
    <div class="form-wrapper">
      <!-- Step 1 -->
      <div v-if="step === 1" class="step-container-1">
        <h2>Forgot Password</h2>

        <form @submit.prevent="handleStep1">
          <div class="form-group">
            <div class="input-with-icon">
              <input
                v-model="identifier"
                placeholder="Enter your Login Credential"
                type="text"
                required
              />
              <span class="input-icon">👤</span>
            </div>
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ? "Checking..." : "Continue" }}
          </button>
        </form>
      </div>

      <!-- Step 2 -->
      <div v-else-if="step === 2" class="step-container-2">
        <h2>Forgot Password</h2>
        <p>Please verify your identity</p>

        <form @submit.prevent="handleStep2">
          <div class="form-group">
            <div class="input-with-icon">
              <input
                v-model="verificationData.id"
                placeholder="ID Number"
                type="text"
                required
              />
              <span class="input-icon">🇮🇩</span>
            </div>
          </div>

          <div class="form-group">
            <div class="input-with-icon">
              <input
                v-model="verificationData.name"
                placeholder="Full Name"
                type="text"
                required
              />
              <span class="input-icon">👤</span>
            </div>
          </div>

          <div class="form-group">
            <div class="input-with-icon">
              <input
                v-model="verificationData.email"
                placeholder="Email"
                type="email"
                required
              />
              <span class="input-icon">🖂</span>
            </div>
          </div>

          <div class="form-group">
            <div class="input-with-icon">
              <select v-model="verificationData.role" required>
                <option value="">Select Primary Role</option>
                <option v-for="role in roles" :key="role" :value="role">
                  {{ role.charAt(0).toUpperCase() + role.slice(1) }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <div class="input-with-icon">
              <select v-model="verificationData.secondary_role">
                <option value="">Select Secondary Role</option>
                <option v-for="role in roles" :key="role" :value="role">
                  {{ role.charAt(0).toUpperCase() + role.slice(1) }}
                </option>
              </select>
            </div>
            <small style="">*If applicable</small>
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ? "Verifying..." : "Verify Identity" }}
          </button>
        </form>
      </div>

      <!-- Error and Success Messages -->
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>
    </div>
  </div>
</template>

<style scoped>
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

.forgot-password-container {
  background-image: url("@/assets/bg.png");
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
}

.form-wrapper {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(52, 158, 177, 0.5);
  width: 350px;
  padding: 2rem;
  border: 1px solid rgba(230, 240, 255, 0.6);
  border-top: 9px solid rgb(42, 60, 92);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  transition: all 0.3s ease;
}

.form-wrapper:hover {
  transform: translate(-50%, -50%) translateY(-1px);
  box-shadow: 0 8px 24px rgba(52, 158, 177, 0.5);
}

.step-container {
  animation: gentleAppear 0.5s ease-out;
  width: 100%;
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

.step-container-1 {
  animation: gentleAppear 0.5s ease-out;
  width: 100%;
}

.step-container-2 {
  animation: gentleAppear 0.5s ease-out;
  width: 100%;
}

h2 {
  color: #2d3748;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.2px;
}

p {
  color: #4a5568;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
  line-height: 1.4;
}

.form-group {
  margin-bottom: 1.2rem;
}

input:focus,
select:focus {
  outline: none;
  border-color: #349eb1;
  box-shadow: 0 0 0 3px rgba(52, 158, 177, 0.1);
  background-color: white;
}

input::placeholder {
  color: #a0aec0;
  opacity: 1;
}

select:hover {
  border-color: #cbd5e0;
}

select:has(option[value=""]:checked) {
  color: rgb(159, 157, 168);
}

.input-with-icon {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 1.1rem;
}

small {
  display: block;
  text-align: right;
  color: rgb(242, 18, 18);
  font-style: italic;
  font-family: sans-serif;
  margin-top: 4px;
  font-size: 0.75em;
}

input,
select {
  width: 100%;
  padding: 0.8rem 2.5rem 0.8rem 0.8rem;
  border: 1.5px solid #d2d8e0;
  border-radius: 18px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background-color: #f0f5fa;
  height: 45px;
  box-sizing: border-box;
}

select {
  padding-right: 2.2rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234a5568'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
  cursor: pointer;
}

button {
  width: 50%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #0b2b31, #2b737e);
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
  bottom: -1rem;
}

button:hover {
  background: linear-gradient(135deg, #2b737e, #0b2b31);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 158, 177, 0.25);
}

button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(52, 158, 177, 0.25);
}

button::after {
  content: "";
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

/* Ultra-Compact Mobile Responsiveness */
@media (max-width: 480px) {
  .forgot-password-container {
    padding: 0.5rem;
    justify-content: flex-start;
  }

  .brand-header {
    margin-bottom: 0.5rem;
  }

  .logo-img {
    height: 40px;
    margin: 0.5rem;
  }

  .brand-name {
    font-size: 1.5rem;
    margin-top: 0.8rem;
  }

  .form-wrapper {
    width: 95%;
    padding: 1rem;
    border-radius: 15px;
    border-top-width: 6px;
  }

  h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 0.8rem;
  }

  input,
  select {
    height: 38px;
    padding: 0.6rem 1.8rem 0.6rem 0.7rem;
    font-size: 0.8rem;
    border-radius: 15px;
  }

  .input-icon {
    font-size: 0.9rem;
    right: 10px;
  }

  button {
    width: 70%;
    padding: 0.7rem;
    font-size: 0.85rem;
    margin: 1rem auto 0;
    bottom: -0.5rem;
  }

  small {
    font-size: 0.65em;
  }

  .error-message,
  .success-message {
    padding: 0.6rem;
    font-size: 0.75rem;
    margin-top: 1rem;
  }
}

@media (max-width: 360px) {
  .form-wrapper {
    padding: 0.8rem;
  }

  input,
  select {
    height: 36px;
    padding: 0.5rem 1.6rem 0.5rem 0.6rem;
  }

  button {
    width: 80%;
    padding: 0.6rem;
  }
}

@media (max-width: 768px) {
  .forgot-password-container {
    background-attachment: scroll;
    background-position: 60% center;
  }
}

@media (max-width: 480px) {
  .forgot-password-container {
    background-position: 70% center;
  }
}

/* @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .forgot-password-container {
  }
} */

.mosha__toast .mosha__toast__content {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
}

.mosha__toast .mosha__toast__content .mosha__toast__content__text {
  padding: 0.5rem;
}
</style>
