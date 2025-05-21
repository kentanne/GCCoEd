<template>
  <div class="signup-container">
    <button @click="scrollToGetStarted" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clip-rule="evenodd"/>
      </svg>
      Back
    </button>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="modal-overlay">
      <div class="confirmation-modal">
        <h3>Confirm Your Role</h3>
        <p>You've selected to proceed as <strong>{{ selectedRole.toUpperCase() }}</strong>. Is this correct?</p>
        <div class="modal-actions">
          <button @click="cancelSelection" class="cancel-btn">Cancel</button>
          <button @click="confirmSelection" class="confirm-btn">Confirm</button>
        </div>
      </div>
    </div>

    <div class="header-text">
      <h1>Complete Your Account</h1>
      <p>Pick a role to proceed with your profile setup</p>
    </div>
    
    <section class="join-section" id="get-started">
      <div class="join-card learner-card" @click="initiateSignUp('learner')">
        <div class="card-content">
          <div class="role-title">
            <span>PROCEED AS</span>
            <h3>LEARNER</h3>
            <hr class="divider">
          </div>
          <div class="card-icon">
           <img src="@/assets/learners.png" alt="Learner Icon" />
          </div>
          <button class="join-btn">
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="join-card mentor-card" @click="initiateSignUp('mentor')">
        <div class="card-content">
          <div class="role-title">
            <span>PROCEED AS</span>
            <h3>MENTOR</h3>
            <hr class="divider">
          </div>
          <div class="card-icon">
            <img src="@/assets/mentors.png" alt="Mentor Icon" />
          </div>
          <button class="join-btn">
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { registrationStore } from "@/stores/registrationStore";

export default {
  name: "SignupComponent",
  data() {
    return {
      showConfirmationModal: false,
      selectedRole: '',
      passwordVisible: false,
      confirmPasswordVisible: false
    };
  },
  methods: {
    scrollToGetStarted() {
    this.$router.push("/#get-started");
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    },
    initiateSignUp(role) {
      this.selectedRole = role;
      this.showConfirmationModal = true;
    },
    confirmSelection() {
      this.showConfirmationModal = false;
      const store = registrationStore();
      store.passAndMail({
        role: this.selectedRole,
      });

      if (this.selectedRole === "learner") {
        this.$router.push("/learner-info");
      } else {
        this.$router.push("/mentor-info");
      }
    },
    cancelSelection() {
      this.showConfirmationModal = false;
      this.selectedRole = '';
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    toggleConfirmPasswordVisibility() {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    },
  }
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

html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.signup-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  position: relative;
}

.back-btn {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(44, 62, 80, 0.1);
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  color: #2c3e50;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.back-btn svg {
  width: 1.2rem;
  height: 1.2rem;
  transition: transform 0.3s ease;
}

.back-btn:hover {
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  transform: translateX(-2px);
}

.back-btn:hover svg {
  transform: translateX(-4px);
}

.header-text {
  text-align: center;
  margin: 1rem 0;
  max-width: 800px;
}

.header-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.header-text p {
  font-size: 1.2rem;
  color: #7f8c8d;
  font-weight: 400;
}

.join-section {
  display: flex;
  justify-content: center;
  gap: 3rem;
  width: 100%;
  max-width: 1200px;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.join-card {
  width: 350px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.join-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.role-title {
  text-align: center;
  margin-bottom: 1rem;
}

.role-title span {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.role-title h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mentor-card .role-title h3 {
  color: #ff7e5f;
}

.divider {
  border: 0;
  height: 2px;
  margin: 1.5rem auto;
  width: 300px;
  background: linear-gradient(
    90deg,
    rgba(44, 62, 80, 0) 0%,
    rgba(44, 62, 80, 0.3) 50%,
    rgba(44, 62, 80, 0) 100%
  );
}

.mentor-card .divider {
  background: linear-gradient(
    90deg,
    rgba(255, 126, 95, 0) 0%,
    rgba(255, 126, 95, 0.3) 50%,
    rgba(255, 126, 95, 0) 100%
  );
}

.card-content p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  text-align: center;
}

.card-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}

.card-icon img {
  width: 230px;
  height: auto;
  object-fit: contain;
  transition: all 0.3s ease;
}


.join-btn {
  margin-top: auto;
  background: linear-gradient(135deg, #02475e 0%, #037a96 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.mentor-card .join-btn {
  background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
}

.join-btn svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.join-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.join-btn:hover svg {
  transform: translateX(3px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.confirmation-modal {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  border: 1px solid rgba(0,0,0,0.1);
}

.confirmation-modal h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.confirmation-modal p {
  color: #7f8c8d;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.modal-actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cancel-btn {
  background: #e8e6e6;
  color: #7f8c8d;
}

.cancel-btn:hover {
  background: #babbbd;
  color: #5d6d7e;
}

.confirm-btn {
  background: linear-gradient(135deg, #02475e 0%, #037a96 100%);
  color: white;
}

.confirm-btn:hover {
  background: linear-gradient(135deg, #037a96 0%, #02475e 100%);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-text h1 {
    font-size: 2rem;
  }
  
  .header-text p {
    font-size: 1rem;
  }
  
  .join-section {
    flex-direction: column;
    align-items: center;
  }
  
  .join-card {
    width: 100%;
    max-width: 350px;
  }

    .card-icon img {
    width: 200px;
    }

  .back-btn {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .confirmation-modal {
    padding: 1.75rem;
  }
  
  .confirmation-modal h3 {
    font-size: 1.3rem;
  }
  
  .confirmation-modal p {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .header-text {
    margin: 2rem 0;
  }

  .header-text h1 {
    font-size: 1.8rem;
  }
  
  .confirmation-modal {
    padding: 1.5rem;
  }
  
  .confirmation-modal h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .confirmation-modal p {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
  
  .modal-actions {
    flex-direction: row;
    gap: 0.75rem;
  }
  
  .modal-actions button {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }

  .back-btn {
    top: 0.8rem;
    left: 0.8rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style>