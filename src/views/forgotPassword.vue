<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

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
    await axios
      .post(
        "http://localhost:8000/api/forgot-password",
        verificationData.value,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        console.log(
          "Password reset request sent successfully: ",
          response.data
        );
        if (response.status === 200) {
          success.value =
            "Verification successful. Check your email for password reset instructions.";
          setTimeout(() => {
            alert("Please check your email for the password reset link");
            router.push("/");
          }, 2000);
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
  }
};
</script>

<template>
  <div class="forgot-password-container">
    <div class="learning-element"></div>
    <div class="learning-element"></div>
    <div class="learning-element"></div>
    <div class="learning-element"></div>

    <header class="brand-header">
      <img src="/src/assets/logo_gccoed.png" alt="GCCoed Logo" class="logo-img">
      <span class="brand-name">GCCoed</span>
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


html, body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
}

.forgot-password-container {
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

input, select {
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
  bottom: -1rem;
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
    margin: 20px 10px;
    padding: 14px;
  }
  .brand-name {
    font-size: 1.7rem;
  }
    button {
    padding: 8px;
    bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .form-wrapper {
    padding: 12px;
    width: 80%;
  }
  .input-with-icon input,
  .input-with-icon select {
    font-size: 0.85rem;
    padding: 6px 28px 6px 8px;
  }
  .input-icon {
    right: 6px;
    font-size: 0.85rem;
  }
  button {
    font-size: 0.85rem;
    padding: 8px;
    bottom: 1rem;
  }

  .brand-name{
    font-size: 1.7rem;
  }
}

</style>