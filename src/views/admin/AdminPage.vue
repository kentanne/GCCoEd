<template>
  <div class="learnerinfo-container">
    <header class="page-header">
      <h1>LEARNER INFO</h1>
      <p>Complete your profile to start learning.</p>
    </header>

    <div class="form-container">
      <!-- Step 1 Content -->
      <div v-if="currentStep === 1">
        <h2 class="title">I. PERSONAL INFORMATION</h2>
        <div class="personal-grid">
          <div class="personal-col">
            <div class="personal-field">
              <label class="personal-label" for="full-name">FULL NAME</label>
              <input type="text" id="full-name" v-model="fullName" placeholder="Enter your full name (FN MI LN)" class="personal-input" />
            </div>
            <div class="personal-field">
              <label class="personal-label" for="address">ADDRESS</label>
              <input type="text" id="address" v-model="address" placeholder="Enter your Address" class="personal-input" />
            </div>
            <div class="personal-field">
              <label class="personal-label" for="gender">GENDER</label>
              <div class="gender-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('gender')">
                  <input type="text" v-model="gender" placeholder="Select your gender" class="personal-input" readonly />
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.gender" class="dropdown-options">
                  <div class="dropdown-option" @click="selectGender('Female')">Female</div>
                  <div class="dropdown-option" @click="selectGender('Male')">Male</div>
                  <div class="dropdown-option" @click="selectGender('Non-binary')">Non-binary</div>
                  <div class="dropdown-option" @click="selectGender('Other')">Other</div>
                </div>
              </div>
              <div v-if="gender === 'Other'" class="other-gender-input">
                <label class="personal-label">Please specify: </label>
                <input type="text" v-model="otherGender" class="gender-specify" placeholder="Specify your gender" />
              </div>
            </div>
          </div>
          <div class="personal-col">
            <div class="personal-field">
              <label class="personal-label" for="year-level">YEAR LEVEL </label>
              <div class="year-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('yearLevel')">
                  <input type="text" v-model="yearLevel" placeholder="Select your year level" class="personal-input" readonly />
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.yearLevel" class="dropdown-options">
                  <div class="dropdown-option" @click="selectYearLevel('1st Year')">1st Year</div>
                  <div class="dropdown-option" @click="selectYearLevel('2nd Year')">2nd Year</div>
                  <div class="dropdown-option" @click="selectYearLevel('3rd Year')">3rd Year</div>
                  <div class="dropdown-option" @click="selectYearLevel('4th Year')">4th Year</div>
                </div>
              </div>
            </div>
            <div class="personal-field">
              <label class="personal-label" for="program">PROGRAM </label>
              <div class="program-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('program')">
                  <input type="text" v-model="program" placeholder="Select your program" class="personal-input" readonly/>
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.program" class="dropdown-options">
                  <div class="dropdown-option" @click="selectProgram('Bachelor of Science in Information Technology (BSIT)')">Bachelor of Science in Information Technology (BSIT)</div>
                  <div class="dropdown-option" @click="selectProgram('Bachelor of Science in Computer Science (BSCS)')">Bachelor of Science in Computer Science (BSCS)</div>
                  <div class="dropdown-option" @click="selectProgram('Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)')">Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)</div>
                </div>
              </div>
            </div>
            <div class="personal-field">
              <label class="personal-label" for="contact-number">CONTACT NUMBER </label>
              <input type="text" id="contact-number" v-model="contactNumber" @input="validateContactNumber" placeholder="Enter your contact number (11 digits)" class="personal-input" maxlength="11"/>
              <small v-if="contactNumber.length > 0 && contactNumber.length < 11" class="validation-error">Contact number must be 11 digits</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2 Content -->
      <div v-if="currentStep === 2">
        <h2 class="title">II. PROFILE INFORMATION</h2>
        
        <div class="profile-grid">
          <div class="profile-col">
            <div class="profile-field">
              <label class="profile-label" for="subjects">SUBJECTS OF INTEREST</label>
              <div class="subj-dropdown">
              <div class="dropdown-container" @click="toggleDropdown('subjects')">
                <input type="text" v-model="selectedSubjectCategory" placeholder="Select subject category" class="profile-input" readonly />
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </div>
              <div v-if="dropdownOpen.subjects" class="dropdown-options">
                <div class="dropdown-option" @click="openSubjectsModal('core')">Core Subjects</div>
                <div class="dropdown-option" @click="openSubjectsModal('gec')">General Education Course</div>
                <div class="dropdown-option" @click="openSubjectsModal('peNstp')">Physical Education & NSTP</div>
              </div>
            </div>
            </div>
            <div class="profile-field">
              <label class="profile-label" for="availability-days">DAYS OF AVAILABILITY</label>
              <div class="availability-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('availability')">
                  <input type="text" id="availability-days" v-model="availabilityDaysDisplay" placeholder="Select available days" class="profile-input" readonly />
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.availability" class="dropdown-options availability-options">
                  <div v-for="day in daysOfWeek" :key="day" class="dropdown-option availability-option">
                    <input type="checkbox" :id="'day-' + day" :value="day" v-model="selectedDays" @click.stop />
                    <label :for="'day-' + day">{{ day }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="profile-field">
              <label class="profile-label" for="modality">LEARNING MODALITY</label>
              <div class="subjmodality-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('modality')">
                  <input type="text" v-model="modality" placeholder="Select learning modality" class="profile-input" readonly />
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.modality" class="dropdown-options">
                  <div class="dropdown-option" @click="selectModality('Online')">Online</div>
                  <div class="dropdown-option" @click="selectModality('In-person')">In-person</div>
                  <div class="dropdown-option" @click="selectModality('Hybrid')">Hybrid</div>
                </div>
              </div>
            </div>
            <div class="profile-field">
              <label class="profile-label" for="session-duration">PREFERRED SESSION DURATION</label>
              <div class="session-duration-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('sessionDuration')">
                  <input type="text" v-model="sessionDuration" placeholder="Select duration" class="profile-input" readonly/>
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.sessionDuration" class="dropdown-options">
                  <div class="dropdown-option" @click="selectSessionDuration('1 hour')">1 hour</div>
                  <div class="dropdown-option" @click="selectSessionDuration('2 hours')">2 hours</div>
                  <div class="dropdown-option" @click="selectSessionDuration('3 hours')">3 hours</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="profile-col">
            <div class="profile-field">
              <label class="profile-label" for="learning-style">LEARNING STYLE</label>
              <div class="learning-style-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('learningStyle')">
                  <input type="text" id="learning-style" v-model="learningStyleDisplay" placeholder="Select learning style(s)" class="profile-input" readonly />
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.learningStyle" class="dropdown-options learning-style-options">
                  <div v-for="style in sessionStyles" :key="style" class="dropdown-option learning-style-option">
                    <input type="checkbox" :id="'style-' + style" :value="style" v-model="selectedsessionStyles" @click.stop />
                    <label :for="'style-' + style">{{ style }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="profile-field">
              <label class="profile-label" for="bio">SHORT BIO</label>
              <textarea id="bio" v-model="bio" placeholder="Tell us about yourself" rows="4" class="profile-textarea"></textarea>
            </div>
            <div class="profile-field">
              <label class="profile-label" for="goals">LEARNING GOALS</label>
              <textarea id="goals" v-model="goals" placeholder="Describe your learning goals" rows="4" class="profile-textarea"></textarea>
            </div>
          </div>
        </div>

        <!-- Profile Picture Upload -->
        <div class="upload-container">
          <div class="profile-picture-upload">
            <label class="profile-label">PROFILE PICTURE</label>
            <div class="upload-controls" @click="uploadProfilePicture">
              <div class="profile-preview-container">
                <img v-if="profileImage" :src="profileImage" alt="Profile Preview" class="profile-preview" />
                <i v-else class="fas fa-user-circle default-icon"></i>
              </div>
              <div class="upload-text">
                <div class="choose-file-container">
                  <i class="fas fa-upload"></i>
                  <span>Choose File</span>
                </div>
                <input type="file" ref="profileInput" accept="image/*" style="display: none" @change="handleProfileUpload" />
                <span class="file-name" style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ profilePictureName || 'No file chosen' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subjects Modal -->
      <div v-if="showSubjectsModal" class="SJmodal-overlay" @click="closeSubjectsModal">
        <div class="SJmodal-content" @click.stop>
          <h3>Select Subjects</h3>
          <hr>
          <div class="subjects-container">
            <div v-if="selectedSubjectCategory === 'core'" class="subjects-column">
              <h4>Core Subjects</h4>
              <div v-for="(subject, index) in availableSubjects.coreSubjects" :key="index" class="checkbox-container">
                <input type="checkbox" :id="'core-' + subject" :value="subject" v-model="selectedSubjects" />
                <label :for="'core-' + subject">{{ subject }}</label>
              </div>
            </div>
            <div v-if="selectedSubjectCategory === 'gec'" class="subjects-column">
              <h4>General Education Course</h4>
              <div v-for="(subject, index) in availableSubjects.gecSubjects" :key="index" class="checkbox-container">
                <input type="checkbox" :id="'gec-' + subject" :value="subject" v-model="selectedSubjects" />
                <label :for="'gec-' + subject">{{ subject }}</label>
              </div>
            </div>
            <div v-if="selectedSubjectCategory === 'peNstp'" class="subjects-column">
              <h4>Physical Education & NSTP</h4>
              <div v-for="(subject, index) in availableSubjects.peNstpSubjects" :key="index" class="checkbox-container">
                <input type="checkbox" :id="'pe-' + subject" :value="subject" v-model="selectedSubjects" />
                <label :for="'pe-' + subject">{{ subject }}</label>
              </div>
            </div>
          </div>
          <button class="done-button" @click="confirmSubjects">Done</button>
        </div>
      </div>

      <!-- Step Indicator -->
      <div class="step-indicator-container">
        <div class="step-indicator">
          <div v-for="step in totalSteps" :key="step" :class="['step', { 'active': step === currentStep, 'completed': step < currentStep }]" @click="goToStep(step)"></div>
        </div>
      </div>
    </div>
    <button class="next-button" @click="nextStep">
      {{ currentStep === totalSteps ? 'SUBMIT' : 'NEXT' }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1,
      totalSteps: 2,
      fullName: '',
      gender: '',
      otherGender: '',
      yearLevel: '',
      program: '',
      contactNumber: '',
      address: '',
      selectedSubjects: [],
      availableSubjects: {
        coreSubjects: [],
        gecSubjects: [],
        peNstpSubjects: []
      },
      modality: '',
      selectedDays: [],
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      bio: '',
      selectedsessionStyles: [],
      sessionStyles: ['Lecture-Based', 'Interactive Discussion (hands-on)', 'Q&A Session', 'Demonstration', 'Project-based', 'Step-by-step process'],
      sessionDuration: '',
      goals: '',
      profileImage: null,
      profilePictureName: '',
      showSubjectsModal: false,
      selectedSubjectCategory: '',
      dropdownOpen: {
        gender: false,
        yearLevel: false,
        program: false,
        modality: false,
        availability: false,
        learningStyle: false,
        sessionDuration: false,
        subjects: false,
      },
      programs: [
        "Bachelor of Science in Information Technology (BSIT)",
        "Bachelor of Science in Computer Science (BSCS)",
        "Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)"
      ],
    };
  },
  computed: {
    availabilityDaysDisplay() {
      return this.selectedDays.join(', ') || 'Select available days';
    },
    learningStyleDisplay() {
      return this.selectedsessionStyles.join(', ') || 'Select learning style(s)';
    }
  },
  methods: {
    validateForm() {
      const errors = [];
      
      if (this.currentStep === 1) {
        if (!this.fullName) errors.push('Full Name is required');
        if (!this.gender) errors.push('Gender is required');
        if (this.gender === 'Other' && !this.otherGender) errors.push('Please specify your gender');
        if (!this.yearLevel) errors.push('Year Level is required');
        if (!this.program) errors.push('Program is required');
        if (!this.contactNumber || this.contactNumber.length < 11) errors.push('Valid Contact Number is required (11 digits)');
        if (!this.address) errors.push('Address is required');
      }
      
      if (this.currentStep === 2) {
        if (this.selectedSubjects.length === 0) errors.push('At least one subject is required');
        if (!this.modality) errors.push('Learning Modality is required');
        if (this.selectedDays.length === 0) errors.push('At least one day of availability is required');
        if (this.selectedsessionStyles.length === 0) errors.push('At least one learning style is required');
        if (!this.sessionDuration) errors.push('Preferred Session Duration is required');
        if (!this.bio) errors.push('Short Bio is required');
        if (!this.goals) errors.push('Learning goals is required');
        if (!this.profileImage) errors.push('Profile Picture is required');
      }
      
      return errors;
    },

    toggleDropdown(type) {
      for (const key in this.dropdownOpen) {
        this.dropdownOpen[key] = key === type ? !this.dropdownOpen[key] : false;
      }
    },
    selectGender(selectedGender) {
      this.gender = selectedGender;
      this.dropdownOpen.gender = false;
    },
    selectYearLevel(selectedYear) {
      this.yearLevel = selectedYear;
      this.dropdownOpen.yearLevel = false;
    },
    selectProgram(selectedProgram) {
      this.program = selectedProgram;
      this.dropdownOpen.program = false;
      this.updateAvailableSubjects();
    },
    selectModality(selectedModality) {
      this.modality = selectedModality;
      this.dropdownOpen.modality = false;
    },
    selectSessionDuration(duration) {
      this.sessionDuration = duration;
      this.dropdownOpen.sessionDuration = false;
    },
    nextStep() {
      if (this.currentStep < this.totalSteps) {
        const validationErrors = this.validateForm();
        
        if (validationErrors.length > 0) {
          alert('Please complete all required fields before proceeding:\n\n' + validationErrors.join('\n'));
          return;
        }
        
        this.currentStep++;
      } else {
        this.submitLearnerInfo();
      }
    },
    goToStep(step) {
      if (step <= this.currentStep) {
        this.currentStep = step;
      }
    },
    uploadProfilePicture() {
      this.$refs.profileInput.click();
    },
    handleProfileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePictureName = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    openSubjectsModal(category) {
      this.selectedSubjectCategory = category;
      this.showSubjectsModal = true;
    },
    closeSubjectsModal() {
      this.showSubjectsModal = false;
    },
    confirmSubjects() {
      this.closeSubjectsModal();
    },
    updateAvailableSubjects() {
      switch (this.program) {
        case "Bachelor of Science in Information Technology (BSIT)":
          this.availableSubjects = {
            coreSubjects: ["Application Development and Emerging Technologies", "Business Analytics", "Computer Programming 1", "Computer Programming 2", 
              "Data Structures and Algorithms", "Digital Design with Multimedia Systems", "Discrete Structures 1", "Event Driven Programming", 
              "Fundamentals of Database Systems", "Information Assurance and Security 1", "Information Assurance and Security 2", 
              "Information Management 1", "Integrative Programming and Technologies", "Introduction to Computing", 
              "Introduction to Human-Computer Interaction", "IT Elective 1", "IT Elective 2", "IT Elective 3", "IT Elective 4", 
              "IT Elective 5", "IT Research Methods", "IT Seminars and Educational Trips", "Networking 1", "Networking 2", 
              "Object-Oriented Programming", "PC Troubleshooting with Basic Electronics", "Platform Technologies", 
              "Quantitative Methods (Inc. Modelling & Simulation)", "Social Issues and Professional Practice in Computing", 
              "System Administration and Maintenance", "Systems Integration and Architecture 1"
            ],
            gecSubjects: ["Art Appreciation", "Ethics", "Mathematics in the Modern World", "People and Earth's Ecosystem", 
              "Purposive Communication", "Reading Visual Arts", "Readings in Philippine History with Indigenous People Studies", 
              "Science, Technology and Society", "The Contemporary World with Peace Studies", "The Entrepreneurial Mind", 
              "The Life and Works of Rizal", "Understanding the Self"
            ],
            peNstpSubjects: ["National Service Training Program with Anti-Smoking and Environmental Education", 
              "National Service Training Program with GAD and Peace Education", 
              "Physical Activities Toward Health and Fitness 1 (PATHFit 1): Movement Competency", 
              "Physical Activities Toward Health and Fitness 2 (PATHFit 2): Exercise-Based Fitness Activities", 
              "Physical Activities Toward Health and Fitness 3 (PATHFit 3)", 
              "Physical Activities Toward Health and Fitness 4 (PATHFit 4)"]
          };
          break;

        case "Bachelor of Science in Computer Science (BSCS)":
          this.availableSubjects = {
            coreSubjects: ["Algorithms", "Operating Systems", "Software Engineering"],
            gecSubjects: ["Ethics", "Critical Thinking"],
            peNstpSubjects: ["National Service Training Program", "Physical Education"]
          };
          break;

        case "Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)":
          this.availableSubjects = {
            coreSubjects: ["Game Development", "Animation", "Multimedia Design"],
            gecSubjects: ["Art Appreciation", "Digital Media"],
            peNstpSubjects: ["National Service Training Program", "Physical Education"]
          };
          break;

        default:
          this.availableSubjects = {
            coreSubjects: [],
            gecSubjects: [],
            peNstpSubjects: []
          };
      }
    },
    validateContactNumber() {
      this.contactNumber = this.contactNumber.replace(/\D/g, '');
      if (this.contactNumber.length > 11) {
        this.contactNumber = this.contactNumber.slice(0, 11);
      }
    },
    async submitLearnerInfo() {
      try {
        const formData = {
          personalInfo: {
            fullName: this.fullName,
            gender: this.gender === 'Other' ? this.otherGender : this.gender,
            yearLevel: this.yearLevel,
            program: this.program,
            contactNumber: this.contactNumber,
            address: this.address,
            subjects: this.selectedSubjects
          },
          profileInfo: {
            modality: this.modality,
            availabilityDays: this.selectedDays,
            bio: this.bio,
            learningStyles: this.selectedsessionStyles, 
            sessionDuration: this.sessionDuration,
            goals: this.goals,
            profileImage: this.profileImage
          }
        };

        console.log('Learner data collected:', formData);
        this.$router.push('/login');

      } catch (error) {
        console.error('Data collection error:', error);
      }
    }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

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
  color: white;
}

/* Container */
.learnerinfo-container {
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
  align-items: center;
  padding-top: 30px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #02475E;
  text-shadow: 1px 1px 2px rgba(255,255,255,0.3);
}

.page-header p {
  color: #02475E;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-container {
  position: relative;
  width: 100%;
  max-width: 1100px;
  height: 70vh;
  min-height: 550px;
  max-height: 650px;
  padding: 1.5rem;
  background: rgba(6, 102, 120, 0.5);
  border-radius: 40px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 8px rgba(170, 10, 10, 0.1);
  display: flex;
  flex-direction: column;
}

/* Personal Information Step */
.title {
  color: #02475E;
  font-size: 1.6rem;
  margin-bottom: 2.5rem;
  margin-left: 2rem;
}

.personal-grid {
  display: flex;
  gap: 4rem;
  width: 95%;
  margin-left: 2rem;
  flex: 1;
}

.personal-col {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 3.2rem;
  padding: 0 1rem;
}

.personal-field {
  display: flex;
  flex-direction: column;
}

.personal-label {
  color: #02475E;
  font-weight: 500;
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
  margin-left: 0.rem;
}

.personal-input,
.profile-input,
.gender-specify {
  padding: 0.7rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgb(255, 255, 255);
  width: 100%;
  transition: all 0.2s ease;
  text-align: left;
}

.personal-input::placeholder,
.profile-input::placeholder,
.gender-specify::placeholder {
  color: rgba(30, 72, 108, 0.683);
  font-size: 0.80rem;
}

.personal-input:focus,
.profile-input:focus,
.gender-specify:focus {
  outline: none;
  border-color: rgba(2, 71, 94, 0.8);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
}

/* Dropdown Styles */
.gender-dropdown,
.year-dropdown,
.program-dropdown,
.subjmodality-dropdown,
.availability-dropdown,
.learning-style-dropdown,
.session-duration-dropdown,
.subj-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.dropdown-container input {
  padding: 0.7rem 30px 0.7rem 0.7rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgb(255, 255, 255);
  font-size: 0.85rem;
  width: 100%;
  transition: all 0.2s ease;
}

.dropdown-options {
  position: absolute;
  background: rgba(255, 255, 255);
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  font-size: 0.85rem;
}

.dropdown-option {
  padding: 0.5rem;
  cursor: pointer;
  color: #32809a;
  transition: background-color 0.2s;
}

.dropdown-option:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.dropdown-icon {
  color: white;
  font-size: 10px;
  position: absolute;
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
}

/* Checkbox Dropdown */
.availability-options,
.learning-style-options {
  padding: 0.5rem;
  width: 100%;
}

.availability-option,
.learning-style-option {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: #02475E;
}

.availability-option input[type="checkbox"],
.learning-style-option input[type="checkbox"] {
  margin-right: 0.5rem;
}

.availability-option label,
.learning-style-option label {
  cursor: pointer;
  color: #02475E;
  font-size: 0.85rem;
}

/* Profile Information Step*/
.profile-grid {
  display: flex;
  gap: 2rem;
  width: 90%;
  margin-left: 3rem;
  flex: 1;
}

.profile-col {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1.5rem;
  padding: 0 1rem;
}

.profile-field {
  display: flex;
  flex-direction: column;
}

.profile-label {
  color: #02475E;
  font-weight: 500;
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
  margin-left: 0.5rem;
}

.profile-input {
  padding: 0.7rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(219, 220, 224, 0.382);
  color: white;
  font-size: 0.85rem;
  width: 100%;
  transition: all 0.2s ease;
  text-align: left;
}

.profile-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.profile-input:focus {
  outline: none;
  border-color: rgba(2, 71, 94, 0.8);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
}

.profile-textarea {
  min-height: 70px;
  resize: none;
  padding: 0.7rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(219, 220, 224, 0.382);
  color: white;
  font-size: 0.85rem;
  width: 100%;
}

.profile-textarea:focus {
  outline: none;
  border-color: rgba(2, 71, 94, 0.8);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
}

.profile-bottom {
  width: 90%;
  margin-left: 3rem;
  margin-top: 1rem;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
}

.profile-bottom-grid {
  display: flex;
  gap: 2.5rem;
}

.profile-bottom-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
}

/* Profile Picture Upload */
.upload-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  margin-left: 4rem;
  gap: 2.5rem;
}

.profile-picture-upload {
  flex: 1;
}

.profile-picture-upload .profile-label {
  display: block;
  margin-bottom: 0.8rem;
}

.upload-controls {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.profile-preview-container {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-icon {
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.5);
}

.upload-text {
  display: flex;
  align-items: center;
  gap: 1.3rem;
  cursor: pointer;
  color:#ffffff
}
.file-name{
  font-size: 15px;
}

.choose-file-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  transition: background-color 5s;
  color: #f9fbfb;
  background: linear-gradient(to bottom, #02475E, #066678);
}

.choose-file-container:hover {
  background: rgba(12, 32, 87, 0.568);
}
/* Subjects Modal */
.SJmodal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.SJmodal-content {
  background: white;
  padding: 20px;
  border-radius: 15px;
  width: 350px;
  max-height: 80%;
  overflow-y: auto;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.SJmodal-content h3 {
  text-align: center;
  color: rgb(9, 9, 80);
  margin-bottom: 10px;
}

.subjects-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 20px 0;
}

.subjects-column {
  flex: 1;
  margin: 0 15px;
  color: #155577;
  font-size: 0.8rem;
}

.subjects-column h4 {
  margin-bottom: 18px;
  text-align: center;
  text-transform: uppercase;
  color: #155577;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.checkbox-container input {
  margin-right: 8px;
}

.checkbox-container label {
  color: #155577;
  font-size: 0.8rem;
}

.done-button {
  background-color: #155577;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 120px;
  align-self: center;
  margin-top: 20px;
}

.done-button:hover {
  background-color: #032c58;
}

/* Step Indicator */
.step-indicator-container {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 2;
}

.step-indicator {
  display: flex;
  gap: 15px;
}

.step {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.step.active {
  background-color: #02475E;
  transform: scale(1.2);
}

.step.completed {
  background-color: rgba(2, 71, 94, 0.6);
}

/* Next/Submit Button */
.next-button { 
  position: fixed;
  bottom: 15px;
  right: 30px;
  background-color: #155577;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 130px;
  font-weight: 600;
  font-size: 0.9rem;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.next-button:hover {
  background-color: #032c58;
}

.next-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.fas {
  font-family: 'Font Awesome 5 Free' !important;
  font-weight: 900;
}

/* Pahabol kjfhhksvbfsv */
.gender-specify {
  padding: 0.7rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(55, 61, 86, 0.242);
  color: white;
  font-size: 0.85rem;
  width: 50%;
  height: 30%;
  transition: all 0.2s ease;
  margin-top: 0.6rem;
  margin-left: 0.8rem;
}

.gender-specify:focus {
  outline: none;
  border-color: rgba(2, 71, 94, 0.8);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
}

</style>