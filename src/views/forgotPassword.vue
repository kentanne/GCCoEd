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
    <div class="form-wrapper">
      <!-- Step 1 -->
      <div v-if="step === 1" class="step-container">
        <h2>Forgot Password</h2>

        <form @submit.prevent="handleStep1">
          <div class="form-group">
            <input
              v-model="identifier"
              :placeholder="'Enter your Login Credential'"
              type="text"
              required
            />
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ? "Checking..." : "Continue" }}
          </button>
        </form>
      </div>

      <!-- Step 2 -->
      <div v-else-if="step === 2" class="step-container">
        <h2>Forgot Password</h2>
        <p>Please verify your identity</p>

        <form @submit.prevent="handleStep2">
          <div class="form-group">
            <input
              v-model="verificationData.id"
              placeholder="ID Number"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <input
              v-model="verificationData.name"
              placeholder="Full Name"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <input
              v-model="verificationData.email"
              placeholder="Email"
              type="email"
              required
            />
          </div>

          <div class="form-group">
            <select v-model="verificationData.role" required>
              <option value="">Select Primary Role</option>
              <option v-for="role in roles" :key="role" :value="role">
                {{ role.charAt(0).toUpperCase() + role.slice(1) }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <select v-model="verificationData.secondaryRole">
              <option value="">Select Secondary Role (Optional)</option>
              <option v-for="role in roles" :key="role" :value="role">
                {{ role.charAt(0).toUpperCase() + role.slice(1) }}
              </option>
            </select>
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
.forgot-password-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
}

.form-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step-container {
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #349eb1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
}

.success-message {
  color: #28a745;
  margin-top: 1rem;
}
</style>
