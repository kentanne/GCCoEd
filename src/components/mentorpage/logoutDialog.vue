<script setup>
import { ref } from "vue";
import { removeToken } from "@/axios.js";
import axios from "axios";
import api from "@/axios.js"; // Adjust the path as necessary
import router from "@/router";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

// axios.defaults.withCredentials = true;
// axios.defaults.withCredentials = true;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const logOut = async () => {
  const response = await api
    .post("/api/logout", {
      withCredentials: true,
      headers: {
        // "X-CSRFToken": getCookie("csrftoken"),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        createToast("Logout successful!", {
          position: "bottom-right",
          type: "success",
          transition: "slide",
          timeout: 2000,
          showIcon: true,
          toastBackgroundColor: "#319cb0",
        });

        emit("logout");
        removeToken();
        router.push("/#/login");
      } else {
        createToast("Logout successful!", {
          position: "bottom-right",
          type: "error",
          transition: "slide",
          timeout: 2000,
          showIcon: true,
        });
      }
    })
    .catch((error) => {});
};

const emit = defineEmits(["logout", "close"]);

// const logout = () => {
//   emit("logout");
// };

const close = () => {
  emit("close");
};
</script>

<template>
  <div class="wrapper">
    <div class="upper-element">
      <font-awesome-icon
        icon="fa-xmark"
        class="logout-icon"
        size="2x"
        color="white"
        style="cursor: pointer"
        @click="close"
      />
    </div>
    <div class="lower-element">
      <div>
        <h1>Are you sure you want to log out?</h1>
      </div>
      <div class="logout-buttons">
        <button @click="logOut" class="confirm-button">Yes</button>
        <button class="cancel-button" @click="close">No</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 200px;
  padding: 20px;
  overflow: hidden;
}

.upper-element {
  display: flex;
  flex-direction: row;
  background-color: #0c434d;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  border-radius: 20px 20px 0 0;
  padding: 10px 10px 10px 0;
  overflow: hidden;
}

.lower-element {
  display: flex;
  justify-content: center;
  background-color: #fff;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  height: 100%;
  width: inherit;
  border: 5px solid #0c434d;
  flex-direction: column;
}

.lower-element h1 {
  margin-top: 20px;
  font-size: 1.5rem;
  color: #0c434d;
  font-weight: 600;
  text-align: center;
}

.logout-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.confirm-button {
  background-color: #0c434d;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.mosha__toast .mosha__toast__content {
  font-family: "Montserrat", sans-serif;
  font-size: 0.5rem;
}

.mosha__toast .mosha__toast__content .mosha__toast__content__text {
  padding: 0.5rem;
}

@media (max-width: 768px) {
  .wrapper {
    height: auto;
    min-height: 180px;
    padding: 15px;
  }

  .upper-element {
    padding: 8px 8px 8px 0;
  }

  .logout-icon {
    font-size: 1.5rem !important;
    margin-right: 15px; /* Added right margin to close icon */
  }

  .lower-element h1 {
    font-size: 1.2rem;
    margin-top: 15px;
    padding: 0 10px;
  }

  .logout-buttons {
    display: flex;
    justify-content: center; /* Center buttons horizontally */
    gap: 15px; /* Space between buttons */
    margin: 20px auto; /* Center the button group with auto margins */
    width: 90%;
    max-width: 300px; /* Limit maximum width */
  }

  .confirm-button,
  .cancel-button {
    width: 45%; /* Make buttons slightly smaller than full width */
    padding: 10px 0;
    font-size: 0.9rem;
    margin-right: 10px; /* Added right margin to buttons */
  }
}

@media (max-width: 480px) {
  .wrapper {
    padding: 10px;
    width: 250px;
    margin-right: 30px;
  }

  .lower-element h1 {
    font-size: 1rem;
    margin-top: 10px;
  }

  .logout-buttons {
    flex-direction: row; /* Keep buttons in row even on small screens */
    gap: 10px;
    width: 95%;
  }

  .confirm-button,
  .cancel-button {
    width: 45%;
    margin-right: 5px; /* Smaller right margin on very small screens */
  }
}
</style>
