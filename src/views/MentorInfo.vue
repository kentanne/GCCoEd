<template>
  <div class="mentorinfo-container">
    <header class="page-header">
      <h1>MENTOR INFO</h1>
      <p>Complete your profile to start mentoring.</p>
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
              <input type="text" id="address" v-model="address" placeholder="Enter your address" class="personal-input" />
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
                  <input type="text" v-model="program" placeholder="Select your program" class="personal-input" readonly />
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.program" class="dropdown-options">
                  <div v-for="prog in programs" :key="prog" class="dropdown-option" @click="selectProgram(prog)">{{ prog }}</div>
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
              <label class="profile-label" for="subjects">SUBJECTS OFFERED</label>
              <div class="dropdown-wrapper">
                <div class="dropdown-trigger" @click="toggleSubjectDropdown">
                  <input type="text" 
                        v-model="selectedSubjectCategory" 
                        placeholder="Select subject category" 
                        class="profile-input"
                        readonly />
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-show="showCategories" class="dropdown-menu categories">
                  <div v-for="category in categories" 
                      :key="category.type"
                      @click="selectCategory(category)"
                      @mouseenter="showSubjects(category.type)"
                      class="dropdown-item">
                    {{ category.name }}
                    <span class="count-badge" v-if="selectedSubjectsCount[category.type] > 0">
                      ({{ selectedSubjectsCount[category.type] }})
                    </span>
                  </div>
                </div>
                
                <div v-show="showSubjectsDropdown" 
                    class="dropdown-menu subjects"
                    @mouseleave="showSubjectsDropdown = false">
                  <div v-if="currentSubjects.length > 0">
                    <div v-for="subject in currentSubjects" 
                        :key="subject" 
                        class="dropdown-item subject-item">
                      <input type="checkbox" 
                            :id="'subject-'+subject" 
                            :value="subject" 
                            v-model="selectedSubjects"
                            @click.stop />
                      <label :for="'subject-'+subject">{{ subject }}</label>
                    </div>
                  </div>
                  <div v-else class="dropdown-item no-subjects">
                    No subjects available
                  </div>
                </div>
              </div>
            </div>
            <div class="profile-field">
              <label class="profile-label" for="modality">TEACHING MODALITY </label>
              <div class="subjmodality-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('modality')">
                  <input type="text" v-model="modality" placeholder="Select teaching modality" class="profile-input" readonly />
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
              <label class="profile-label" for="availability-days">DAYS OF AVAILABILITY </label>
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
          </div>
          <div class="profile-col">
            <div class="profile-field">
              <label class="profile-label" for="proficiency">PROFICIENCY LEVEL </label>
              <div class="proficiency-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('proficiency')">
                  <input type="text" v-model="proficiency" placeholder="Select proficiency level" class="profile-input" readonly />
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.proficiency" class="dropdown-options">
                  <div class="dropdown-option" @click="selectProficiency('Beginner')">Beginner</div>
                  <div class="dropdown-option" @click="selectProficiency('Intermediate')">Intermediate</div>
                  <div class="dropdown-option" @click="selectProficiency('Advanced')">Advanced</div>
                </div>
              </div>
            </div>
            <div class="profile-field">
              <label class="profile-label" for="teaching-style">TEACHING STYLE </label>
              <div class="teaching-style-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('learningStyle')">
                  <input type="text" id="teaching-style" v-model="learningStyleDisplay" placeholder="Select teaching style(s)" class="profile-input" readonly />
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.learningStyle" class="dropdown-options teaching-style-options">
                  <div v-for="style in sessionStyles" :key="style" class="dropdown-option teaching-style-option">
                    <input type="checkbox" :id="'style-' + style" :value="style" v-model="selectedsessionStyles" @click.stop />
                    <label :for="'style-' + style">{{ style }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="profile-field">
              <label class="profile-label" for="session-duration">PREFERRED SESSION DURATION </label>
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
        </div> 
        <div class="profile-bottom">
          <div class="profile-bottom-grid">
            <div class="profile-bottom-col">
              <div class="profile-field">
                <label class="profile-label" for="bio">SHORT BIO</label>
                <textarea id="bio" v-model="bio" placeholder="Tell us about yourself" rows="2" class="profile-textarea"></textarea>
              </div>
            </div>
            <div class="profile-bottom-col">
              <div class="profile-field">
                <label class="profile-label" for="experience">TUTORING EXPERIENCE</label>
                <textarea id="experience" v-model="experience" placeholder="Describe your tutoring experience" rows="2" class="profile-textarea"></textarea>
              </div>
            </div>
          </div>

          <!-- Profile Picture and Credentials Upload -->
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

            <div class="credentials-upload">
              <label class="profile-label">CREDENTIALS</label>
              <div class="upload-controls">
                <div class="choose-file-container" @click="uploadCredentials">
                  <i class="fas fa-file-upload"></i>
                  <span>Upload Credentials</span>
                </div>
                <input type="file" ref="credentialInput" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" style="display: none" @change="handleCredentialUpload" />
                <a href="#" @click.prevent="toggleFileList" class="file-link">View Uploaded Files ({{ credentials.length }})</a>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- File List Modal -->
      <div v-if="showFileList" class="Credmodal-overlay" @click="closeFileList">
        <div class="Credmodal-content" @click.stop>
          <h3>Uploaded Files</h3>
          <ul class="file-list">
            <li v-for="(file, index) in credentials" :key="index">
              <span class="file-info">
                <i class="fas fa-file-alt"></i>
                {{ file.name }}
              </span>
              <button @click.stop="deleteCredential(index)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </li>
          </ul>
          <div style="display: flex; justify-content: center; width: 100%;">
            <button class="close-button" @click="closeFileList">Close</button>
          </div>
        </div>
      </div>

      <!-- Application Status Popup -->
      <div v-if="showStatusPopup" class="status-popup-overlay">
        <div class="status-popup-content">
          <h3>APPLICATION STATUS</h3>
          <p class="status-text">Your mentor application is under review. You will receive an email once it's approved. Wait for 1-3 working days. Thank you!</p>
          <button class="proceed-button" @click="proceedToHome">PROCEED TO HOME</button>
        </div>
      </div>

      <!-- Step Indicator -->
      <div class="step-indicator-container">
        <div class="step-indicator">
          <div v-for="step in totalSteps" :key="step" :class="['step', { 'active': step === currentStep, 'completed': step < currentStep }]" @click="goToStep(step)"></div>
        </div>
      </div>
    </div>
    <button class="next-button" @click="nextStep" :disabled="isSubmitted">
      {{ isSubmitted ? 'SUBMITTED' : (currentStep === totalSteps ? 'SUBMIT' : 'NEXT') }}
    </button>
  </div>
</template>

<script>
import { registrationStore } from '@/stores/registrationStore.js'; // Adjust the import path as necessary
import axios, { Axios } from 'axios';

axios.default.withCredentials = true; // Enable sending cookies with requests
axios.default.withXSRFToken = true; // Enable CSRF token handling

function getCookie(name){
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

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
      proficiency: '', 
      selectedsessionStyles: [],
      sessionStyles: ['Lecture-Based', 'Interactive Discussion (hands-on)', 'Q&A Session', 'Demonstration', 'Project-based', 'Step-by-step process'],
      sessionDuration: '',
      experience: '', 
      profileImage: null,
      profilePictureName: '',
      credentials: [], 
      showFileList: false, 
      
      categories: [
        { type: 'core', name: 'Core Subjects' },
        { type: 'gec', name: 'General Education Course' },
        { type: 'peNstp', name: 'Physical Education & NSTP' }
      ],
      showCategories: false,
      showSubjectsDropdown: false,
      currentSubjects: [],
      selectedSubjectCategory: '',
      selectedSubjectsCount: {
        core: 0,
        gec: 0,
        peNstp: 0
      },

      dropdownOpen: {
        gender: false,
        yearLevel: false,
        program: false,
        modality: false,
        proficiency: false, 
        availability: false,
        learningStyle: false,
        sessionDuration: false
      },
      programs: [
        "Bachelor of Science in Information Technology (BSIT)",
        "Bachelor of Science in Computer Science (BSCS)",
        "Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)"
      ],
      showStatusPopup: false, 
      isSubmitted: false 
    };
  },

  computed: {
    availabilityDaysDisplay() {
      return this.selectedDays.join(', ') || 'Select available days';
    },
    learningStyleDisplay() { 
      return this.selectedsessionStyles.join(', ') || 'Select teaching style(s)';
    },
    isFormComplete() {
      if (this.currentStep === 1) {
        return this.fullName.trim() && 
               this.gender && 
               (this.gender !== 'Other' || this.otherGender.trim()) && 
               this.yearLevel && 
               this.program && 
               this.contactNumber?.length === 11 && 
               this.address.trim();
      }
      return this.selectedSubjects.length > 0 && 
             this.modality && 
             this.selectedDays.length > 0 && 
             this.selectedsessionStyles.length > 0 && 
             this.proficiency &&
             this.sessionDuration && 
             this.bio.trim() && 
             this.experience.trim() && 
             this.profileImage &&
             this.credentials.length > 0; 
    }
  },

  methods: {
    async csrf(){
      await axios.get('http://localhost:8000/sanctum/csrf-cookie').then(response => {
        console.log("CSRF cookie set");
      }).catch(error => {
        console.error("Error setting CSRF cookie:", error);
      });
    },
    toggleSubjectDropdown() {
      this.showCategories = !this.showCategories;
      this.showSubjectsDropdown = false;
    },
    
    selectCategory(category) {
      this.selectedSubjectCategory = category.name;
      this.showCategories = false;
      this.showSubjects(category.type);
      this.updateSelectedCounts();
    },
    
    showSubjects(categoryType) {
      switch(categoryType) {
        case 'core':
          this.currentSubjects = this.availableSubjects.coreSubjects;
          break;
        case 'gec':
          this.currentSubjects = this.availableSubjects.gecSubjects;
          break;
        case 'peNstp':
          this.currentSubjects = this.availableSubjects.peNstpSubjects;
          break;
      }
      this.showSubjectsDropdown = true;
    },

    updateSelectedCounts() {
      this.selectedSubjectsCount.core = this.selectedSubjects.filter(sub => 
        this.availableSubjects.coreSubjects.includes(sub)
      ).length;
      
      this.selectedSubjectsCount.gec = this.selectedSubjects.filter(sub => 
        this.availableSubjects.gecSubjects.includes(sub)
      ).length;
      
      this.selectedSubjectsCount.peNstp = this.selectedSubjects.filter(sub => 
        this.availableSubjects.peNstpSubjects.includes(sub)
      ).length;
    },

    validateForm() {
      const errors = [];
      
      if (this.currentStep === 1) {
        if (!this.fullName.trim()) errors.push('Full Name is required');
        if (!this.gender) errors.push('Gender is required');
        if (this.gender === 'Other' && !this.otherGender.trim()) errors.push('Please specify your gender');
        if (!this.yearLevel) errors.push('Year Level is required');
        if (!this.program) errors.push('Program is required');
        if (!this.contactNumber || this.contactNumber.length !== 11) errors.push('Valid Contact Number is required (11 digits)');
        if (!this.address.trim()) errors.push('Address is required');
      }
      
      if (this.currentStep === 2) {
        if (this.selectedSubjects.length === 0) errors.push('At least one subject is required');
        if (!this.modality) errors.push('Teaching Modality is required');
        if (this.selectedDays.length === 0) errors.push('At least one day of availability is required');
        if (this.selectedsessionStyles.length === 0) errors.push('At least one teaching style is required');
        if (!this.proficiency) errors.push('Proficiency level is required'); 
        if (!this.sessionDuration) errors.push('Preferred Session Duration is required');
        if (!this.bio.trim()) errors.push('Short Bio is required');
        if (!this.experience.trim()) errors.push('Tutoring experience is required');
        if (!this.profileImage) errors.push('Profile Picture is required');
        if (this.credentials.length === 0) errors.push('At least one credential is required'); 
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
    
    selectProficiency(selectedProficiency) { 
      this.proficiency = selectedProficiency;
      this.dropdownOpen.proficiency = false;
    },
    
    selectSessionDuration(duration) {
      this.sessionDuration = duration;
      this.dropdownOpen.sessionDuration = false;
    },
    
    nextStep() {
      const validationErrors = this.validateForm();
      
      if (validationErrors.length > 0) {
        alert('Please complete all required fields before proceeding:\n\n' + validationErrors.join('\n'));
        return;
      }
      
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      } else {
        this.submitApplication(); 
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
        if (!file.type.match('image.*')) {
          alert('Please select an image file');
          return;
        }
        
        if (file.size > 2000000) {
          alert('File size should be less than 2MB');
          return;
        }
        
        this.profilePictureName = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    
    uploadCredentials() { 
      this.$refs.credentialInput.click();
    },
    
    handleCredentialUpload(event) { 
      const files = Array.from(event.target.files);
      this.credentials.push(...files);
    },
    
    deleteCredential(index) { 
      this.credentials.splice(index, 1);
    },
    
    toggleFileList() { 
      this.showFileList = !this.showFileList;
    },
    
    closeFileList() { 
      this.showFileList = false;
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
            coreSubjects: ["Computer Programming 1", "Computer Programming 2",  "Introduction to Computing", 
              "PC Troubleshooting with Basic Electronics","Data Structures and Algorithms",
              "Algorithms and Complexity 1", "Software Engineering 1", "Software Engineering 2",
              "Operating Systems", "Object-Oriented Programming", "Information Management 1",
              "Discrete Structures 1", "Discrete Structures 2", "Principles of Statistics and Probability",
              "Graphics and Visual Computing", "Automata Theory", "Intelligent Systems",
              "Programming Languages", "Parallel and Distributed Computing",
              "Architecture and Organization", "Information Assurance and Security",
              "CS Thesis Writing 1", "CS Thesis Writing 2", 
              "CS Elective 1", "CS Elective 2", "CS Elective 3", "CS Elective 4", "CS Elective 5",
              "CS Seminars and Educational Trips"
             ],
            gecSubjects: ["Art Appreciation", "Ethics", "Mathematics in the Modern World", "People and Earth's Ecosystem", 
              "Purposive Communication", "Reading Visual Arts", "Readings in Philippine History with Indigenous People Studies", 
              "Science, Technology and Society", "The Contemporary World with Peace Studies", "The Entrepreneurial Mind", 
              "The Life and Works of Rizal", "Understanding the Self"
          ],
            peNstpSubjects: ["National Service Training Program 1",
              "National Service Training Program 2",
              "Physical Activities Toward Health and Fitness 1 (PATHFit 1): Movement Competency",
              "Physical Activities Toward Health and Fitness 2 (PATHFit 2): Exercise-Based Fitness Activities",
              "Physical Activities Toward Health and Fitness 3 (PATHFit 3)",
              "Physical Activities Toward Health and Fitness 4 (PATHFit 4)"]
          };
          break;

        case "Bachelor of Science in Entertainment and Multimedia Computing (BSEMC)":
          this.availableSubjects = {
            coreSubjects: ["Introduction to EM Computing", "Computer Programming 1", "PC Troubleshooting with Basic Electronics", "Computer Programming 2", 
            "Usability, HCI, UI Design", "Free Hand and Digital Drawing", "Data Structures and Algorithms", "Information Management 1", "Introduction to Game Design and Development", 
            "Computer Graphics Programming", "Image and Video Processing", "Script Writing and Storyboard Design", "Applications Development and Emerging Technologies",
            "Principles of 2D Animation", "Audio Design and Sound Engineering Modelling and Rigging", "Texture and Mapping", "Social Issues and Professional Practice in Computing", 
            "Lighting and Effects", "Principles of 3D Animation", "Design and Production Process", "Advanced Sound Production", "Advanced 2D Animation", "EMC Professional Elective 1",
            "Research Methods", "Advanced 3D Animation and Scripting", "Compositing and Rendering", "EMC Professional Elective 2", "Animation Design and Production", "EMC Professional Elective 3",
            "Computing Seminars and Educational Trips"
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

        default:
          this.availableSubjects = {
            coreSubjects: [],
            gecSubjects: [],
            peNstpSubjects: []
          };
      }
      this.updateSelectedCounts();
    },
    
    validateContactNumber() {
      this.contactNumber = this.contactNumber.replace(/\D/g, '');
      
      if (this.contactNumber.length > 11) {
        this.contactNumber = this.contactNumber.slice(0, 11);
      }
    },
    
    async submitApplication() {
      const finalValidationErrors = this.validateForm();
      const store = registrationStore();
      // console.log("Store data:", store.registrationData);

      if (finalValidationErrors.length > 0) {
        alert('Please complete all required fields before submitting:\n\n' + finalValidationErrors.join('\n'));
        return;
      }


      try {
        const formData = new FormData(); // Use FormData for file uploads
        formData.append('email', store.registrationData.email); // Corrected property
        formData.append('password', store.registrationData.password); // Corrected property
        formData.append('password_confirmation', store.registrationData.password_confirmation); // Corrected property
        formData.append('role', store.registrationData.role); // Corrected property
        formData.append('name', this.fullName);
        formData.append('gender', this.gender === 'Other' ? this.otherGender : this.gender);
        formData.append('year', this.yearLevel);
        formData.append('course', this.program);
        formData.append('phoneNum', this.contactNumber);
        formData.append('address', this.address);
        formData.append('subjects', JSON.stringify(this.selectedSubjects)); // Convert array to JSON string
        formData.append('learn_modality', this.modality);
        formData.append('availability', JSON.stringify(this.selectedDays)); // Convert array to JSON string
        formData.append('bio', this.bio);
        formData.append('teach_sty', JSON.stringify(this.selectedsessionStyles)); // Convert array to JSON string
        formData.append('prefSessDur', this.sessionDuration);
        formData.append('exp', this.goals);
        formData.append('proficiency', this.proficiency); // Added proficiency level
        formData.append('credentials', JSON.stringify(this.credentials.map(file => file.name))); // Convert array to JSON string

        // Ensure profileImage is a file
        if (this.$refs.profileInput.files[0]) {
          formData.append('image', this.$refs.profileInput.files[0]);
        } else {
          throw new Error('Profile image is missing or invalid.');
        }

        this.credentials.forEach((file, index) => {
          formData.append(`credentials[${index}]`, file);
        });

        await axios.post('http://localhost:8000/api/mentor/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': 'application/json',
            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
          }})
        .then(response => {
          console.log('ge')
        })
        .catch(error => {
          console.error(error);
        });

        // console.log('Mentor application submitted:', formData);
        this.sendEmailToAdmin(formData);
        this.showStatusPopup = true;
        this.isSubmitted = true;

      } catch (error) {
        console.error('Application submission error:', error);
        alert('An error occurred while submitting your application. Please try again.');
      }
    },
    
    sendEmailToAdmin(formData) { 
      console.log('Sending email to admin with application data:', formData);
    },
    
    closeStatusPopup() { 
      this.showStatusPopup = false;
    },
    
    proceedToHome() {
      this.$router.push('/');
    }
  },

  mounted(){
    this.csrf();
  },

  watch: {
    selectedSubjects: {
      handler() {
        this.updateSelectedCounts();
      },
      deep: true
    },
    
    program(newVal) {
      if (newVal) {
        this.updateAvailableSubjects();
      }
    },
    
    gender(newVal) {
      if (newVal !== 'Other') {
        this.otherGender = '';
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

.mentorinfo-container {
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
  background: rgba(0, 89, 105, 0.546);
  border-radius: 40px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 8px rgba(170, 10, 10, 0.1);
  display: flex;
  flex-direction: column;
}

.title {
  color: #02475E;
  font-size: 1.6rem;
  margin-bottom: 2rem;
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
  margin-bottom: 0.6rem;
  margin-left: 0.3rem;
}

.personal-input,
.profile-input,
.gender-specify {
  padding: 0.7rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(215, 217, 230, 0.293);
  width: 100%;
  transition: all 0.2s ease;
  text-align: left;
  color: white;
  font-weight: 600;
}

.personal-input::placeholder,
.profile-input::placeholder,
.gender-specify::placeholder {
  color: rgba(255, 250, 250, 0.683);
  font-size: 0.80rem;
}

.personal-input:focus,
.profile-input:focus,
.gender-specify:focus {
  outline: none;
  border-color: rgba(2, 71, 94, 0.8);
  box-shadow: 0 0 0 2px rgba(2, 71, 94, 0.2);
}

.gender-dropdown,
.year-dropdown,
.program-dropdown,
.subjmodality-dropdown,
.proficiency-dropdown,
.availability-dropdown,
.teaching-style-dropdown,
.session-duration-dropdown {
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
  background: rgba(215, 217, 230, 0.293);
  font-size: 0.85rem;
  width: 100%;
  transition: all 0.2s ease;
  color: white;
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
  font-size: 0.90rem;
}

.dropdown-option {
  padding: 7px 13px;
  cursor: pointer;
  color: #02475E;
  transition: background-color 0.2s;
  display: flex;
  align-items: center; 
  gap: 13px; 
}

.dropdown-option:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.dropdown-icon {
  color: white;
  font-size: 10px;
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

/* Double Dropdown Styles */
.dropdown-wrapper {
  position: relative;
  width: 100%;
}

.dropdown-trigger {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
}

.dropdown-trigger input {
  border: none;
  outline: none;
  width: 100%;
  cursor: pointer;
  background: transparent;
  padding: 0.7rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(215, 217, 230, 0.293);
  color: white;
  font-size: 0.85rem;
  text-align: left;
}

.dropdown-trigger input::placeholder {
  color: rgba(255, 250, 250, 0.683);
}

.dropdown-menu {
  position: absolute;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
}

.categories {
  width: 100%;
  top: 100%;
  left: 0;
  margin-top: 1px;
  font-size: 13px
}

.subjects {
  width: 300px;
  top: 0;
  left: calc(100% + 2px);
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s;
  color: #02475E;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.subject-item {
  display: flex;
  align-items: center;
  font-size: 10px;
}

.subject-item input[type="checkbox"] {
  margin-right: 10px;
  cursor: pointer;
}

.subject-item label {
  cursor: pointer;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-subjects {
  color: #999;
  font-style: italic;
}

.dropdown-menu {
  z-index: 1000;
}

.count-badge {
  background-color: #02475E;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.7em;
  margin-left: 5px;
}

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
  background: rgba(215, 217, 230, 0.293);
  color: white;
  font-size: 0.85rem;
  width: 100%;
  transition: all 0.2s ease;
  text-align: left;
}

.profile-input::placeholder {
  color: rgba(255, 250, 250, 0.683);
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
  background: rgba(215, 217, 230, 0.293);
  color: white;
  font-size: 0.85rem;
  width: 100%;
}

.profile-textarea::placeholder{
  color: rgba(255, 250, 250, 0.683);
  font-weight: 500;
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

/* Profile Picture and Credentials Upload */
.upload-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  margin-left: 2.5rem;
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

.file-name {
  font-size: 15px;
}

.choose-file-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  transition: background-color 2s;
  color: #f9fbfb;
  background: linear-gradient(to bottom, #02475E, #066678);
}

.choose-file-container:hover {
  background: rgba(12, 32, 87, 0.568);
}

/* Credentials Upload */
.credentials-upload {
  flex: 1;
}

.credentials-upload .profile-label {
  display: block;
  margin-bottom: 0.8rem;
}

.credentials-upload .upload-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.credentials-upload .upload-controls .file-link {
  color: #e9ecee;
  text-decoration: underline;
  cursor: pointer;
  font-size: 13px;
}

/* File List Modal */
.Credmodal-overlay {
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

.Credmodal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
  max-height: 80%;
  overflow-y: auto;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.Credmodal-content h3 {
  text-align: center;
  color: rgb(9, 9, 80);
  margin-bottom: 10px;
}

.file-list {
  margin-top: 0.5rem;
  list-style: none;
  padding: 0;
}

.file-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #02475E;
}

.file-list button {
  background: transparent;
  border: none;
  color: rgba(255, 100, 100, 0.8);
  cursor: pointer;
  padding: 0.2rem;
}

.file-list button:hover {
  color: #ff4d4d;
}

.close-button {
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

.close-button:hover {
  background-color: #032c58;
}

/* Status Popup */
.status-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 40px;
  z-index: 1000;
}

.status-popup-content {
  background: white;
  border-radius: 8px;
  width: 500px;
  height: 220px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.status-popup-content h3 {
  text-align: center;
  color: white;
  background-color: #02475E;
  padding: 10px;
  border-radius:5px;
  margin-bottom: 23px;
}

.status-text {
  color: #02475E;
  text-align: center;
  margin-bottom: 30px;
  padding: 0 20px;
  line-height: 1.5;
}

.proceed-button {
  background-color: #02475E;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  font-weight: 500;
  transition: background-color 0.3s;
}

.proceed-button:hover {
  background-color: #033140;
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

.validation-error {
  color: #ff6b6b;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 0.5rem;
}

.availability-options,
.teaching-style-options {
  padding: 0.5rem;
  width: 100%;
}

.availability-option,
.teaching-style-option {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: #02475E;
}

.availability-option input[type="checkbox"],
.teaching-style-option input[type="checkbox"] {
  margin-right: 0.5rem;
}

.availability-option label,
.teaching-style-option label {
  cursor: pointer;
  color: #02475E;
  font-size: 0.85rem;
}
</style>