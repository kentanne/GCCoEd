<template>
  <div class="reset-password">
    <h2>Reset Password</h2>
    <form @submit.prevent="resetUserPass" v-if="!error">
      <div class="form-group">
        <label for="password">New Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          minlength="8"
        />
      </div>

      <div class="form-group">
        <label for="password_confirmation">Confirm Password</label>
        <input
          type="password"
          id="password_confirmation"
          v-model="password_confirmation"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Resetting..." : "Reset Password" }}
      </button>
    </form>

    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-if="success" class="success">
      {{ success }}
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
.reset-password {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
</style>
