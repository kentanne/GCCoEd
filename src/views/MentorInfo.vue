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
              <label class="personal-label" for="city">CITY/MUNICIPALITY</label>
              <input type="text" id="city" v-model="city" placeholder="Enter your city/municipality" class="personal-input" />
            </div>
            <div class="personal-field">
              <label class="personal-label" for="barangay">BARANGAY</label>
              <input type="text" id="barangay" v-model="barangay" placeholder="Enter your barangay" class="personal-input" />
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
              <label class="personal-label" for="department">DEPARTMENT </label>
              <div class="department-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('department')">
                  <input type="text" v-model="department" placeholder="Select your department" class="personal-input" readonly />
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.department" class="dropdown-options">
                  <div class="dropdown-option" @click="selectDepartment('College of Allied Health Studies (CAHS)')">College of Allied Health Studies (CAHS)</div>
                  <div class="dropdown-option" @click="selectDepartment('College of Business and Accountancy (CBA)')">College of Business and Accountancy (CBA)</div>
                  <div class="dropdown-option" @click="selectDepartment('College of Computer Studies (CCS)')">College of Computer Studies (CCS)</div>
                  <div class="dropdown-option" @click="selectDepartment('College of Education, Arts, and Sciences (CEAS)')">College of Education, Arts, and Sciences (CEAS)</div>
                  <div class="dropdown-option" @click="selectDepartment('College of Hospitality and Tourism Management (CHTM)')">College of Hospitality and Tourism Management (CHTM)</div>
                </div>
              </div>
            </div>
            <div class="personal-field">
              <label class="personal-label" for="program">PROGRAM </label>
              <div class="program-dropdown">
                <div class="dropdown-container" @click="toggleDropdown('program')" :disabled="!department">
                  <input type="text" v-model="program" placeholder="Select your program" class="personal-input" readonly :disabled="!department" />
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
              <button @click="openSubjectsModal" class="profile-input" :disabled="!program">Select Subjects</button>
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
                <div class="dropdown-container" @click="toggleDropdown('teachingStyle')">
                  <input type="text" id="teaching-style" v-model="teachingStyleDisplay" placeholder="Select teaching style(s)" class="profile-input" readonly />
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div v-if="dropdownOpen.teachingStyle" class="dropdown-options teaching-style-options">
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

      <!-- Subjects Modal -->
      <div v-if="showSubjectsModal" class="SJmodal-overlay" @click="closeSubjectsModal">
        <div class="SJmodal-content" @click.stop>
          <h3>Select Subjects</h3>
          <div class="subjects-container">
            <div class="subjects-column">
              <h4>Core Subjects</h4>
              <div v-for="(subject, index) in availableSubjects.coreSubjects" :key="index" class="checkbox-container">
                <input type="checkbox" :id="'core-' + subject" :value="subject" v-model="selectedSubjects" />
                <label :for="'core-' + subject">{{ subject }}</label>
              </div>
            </div>
            <div class="subjects-column">
              <h4>General Education Course</h4>
              <div v-for="(subject, index) in availableSubjects.gecSubjects" :key="index" class="checkbox-container">
                <input type="checkbox" :id="'gec-' + subject" :value="subject" v-model="selectedSubjects" />
                <label :for="'gec-' + subject">{{ subject }}</label>
              </div>
            </div>
            <div class="subjects-column">
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
export default {
  data() {
    return {
      currentStep: 1,
      totalSteps: 2,
      fullName: '',
      gender: '',
      otherGender: '',
      yearLevel: '',
      department: '',
      program: '',
      contactNumber: '',
      city: '',
      barangay: '',
      selectedSubjects: [],
      availableSubjects: [],
      modality: '',
      selectedDays: [],
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      bio: '',
      proficiency: '',
      selectedsessionStyles: [],
      sessionStyles: ['Lecture-Based', 'Interactive Discussion (hands-on)','Q&A Session','Demonstration', 'Project-based', 'Step-by-step process'],

      sessionDuration: '',
      experience: '',
      profileImage: null,
      profilePictureName: '',
      credentials: [],
      showFileList: false,
      showSubjectsModal: false,
      showStatusPopup: false,
      isSubmitted: false,
      dropdownOpen: {
        gender: false,
        yearLevel: false,
        department: false,
        program: false,
        modality: false,
        proficiency: false,
        availability: false,
        teachingStyle: false,
        sessionDuration: false,
      },
      programs: [],
      coreSubjects: [],
      gecSubjects: [],
      peNstpSubjects: [],
    };
  },
  computed: {
    availabilityDaysDisplay() {
      return this.selectedDays.join(', ') || 'Select available days';
    },
    teachingStyleDisplay() {
      return this.selectedsessionStyles.join(', ') || 'Select teaching style(s)';
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
        if (!this.department) errors.push('Department is required');
        if (!this.program) errors.push('Program is required');
        if (!this.contactNumber || this.contactNumber.length < 11) errors.push('Valid Contact Number is required (11 digits)');
        if (!this.city) errors.push('City/Municipality is required');
        if (!this.barangay) errors.push('Barangay is required');
      }
      
      if (this.currentStep === 2) {
        if (this.selectedSubjects.length === 0) errors.push('At least one subject is required');
        if (!this.modality) errors.push('Teaching Modality is required');
        if (this.selectedDays.length === 0) errors.push('At least one day of availability is required');
        if (!this.proficiency) errors.push('Proficiency Level is required');
        if (this.selectedsessionStyles.length === 0) errors.push('At least one teaching style is required');
        if (!this.sessionDuration) errors.push('Preferred Session Duration is required');
        if (!this.bio) errors.push('Short Bio is required');
        if (!this.experience) errors.push('Tutoring Experience is required');
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
    selectDepartment(selectedDepartment) {
      this.department = selectedDepartment;
      this.dropdownOpen.department = false;
      this.updatePrograms();
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
    handleGenderChange() {
      if (this.gender === 'Other') {
        this.otherGender = '';
      } else {
        this.otherGender = '';
      }
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
      this.showFileList = true;
    },
    closeFileList() {
      this.showFileList = false;
    },
    openSubjectsModal() {
      if (!this.program) {
        alert("Please select a program first.");
        return;
      }
      this.showSubjectsModal = true;
    },
    closeSubjectsModal() {
      this.showSubjectsModal = false;
    },
    confirmSubjects() {
      this.closeSubjectsModal();
    },
    updatePrograms() {
      switch (this.department) {
        case "College of Allied Health Studies (CAHS)": 
          this.programs = ["Bachelor of Science in Nursing", "Bachelor of Science in Midwifery"]; break;
        case "College of Business and Accountancy (CBA)": 
          this.programs = ["Bachelor of Science in Accountancy", "Bachelor of Science in Business Administration Major in Financial Management", "Bachelor of Science in Business Administration Major in Human Resource Management", "Bachelor of Science in Business Administration Major in Marketing Management", "Bachelor of Science in Customs Administration"]; break;
        case "College of Computer Studies (CCS)": 
          this.programs = ["Bachelor of Science in Computer Science", "Bachelor of Science in Entertainment and Multimedia Computing", "Bachelor of Science in Information Technology"]; break;
        case "College of Education, Arts, and Sciences (CEAS)": 
          this.programs = ["Bachelor of Arts in Communication", "Bachelor of Early Childhood Education", "Bachelor of Culture and Arts Education", "Bachelor of Physical Education", "Bachelor of Elementary Education (General Education)", "Bachelor of Secondary Education major in English", "Bachelor of Secondary Education major in Filipino", "Bachelor of Secondary Education major in Mathematics", "Bachelor of Secondary Education major in Social Studies", "Bachelor of Secondary Education major in Sciences", "Teacher Certificate Program (TCP)"]; break;
        case "College of Hospitality and Tourism Management (CHTM)": 
          this.programs = ["Bachelor of Science in Hospitality Management", "Bachelor of Science in Tourism Management"];
          break;
        default:
          this.programs = [];
      }
      this.program = '';
    },
    updateAvailableSubjects() {
      switch (this.program) {
        case "Bachelor of Science in Nursing":
          this.availableSubjects = {
            coreSubjects: [
              "Anatomy", "Physiology", "Nursing Fundamentals", "Pharmacology", 
              "Medical-Surgical Nursing", "Pediatric Nursing", "Maternal and Child Nursing", 
              "Community Health Nursing", "Mental Health Nursing"
            ],
            gecSubjects: [
              "Art Appreciation", "Ethics", "Psychology"
            ],
            peNstpSubjects: [
              "National Service Training Program", "Physical Activities Toward Health and Fitness 1"
            ]
          };
          break;

        case "Bachelor of Science in Midwifery":
          this.availableSubjects = {
            coreSubjects: [
              "Midwifery Theory", "Maternal Health", "Newborn Care"
            ],
            gecSubjects: [
              "Ethics", "Health Education"
            ],
            peNstpSubjects: [
              "National Service Training Program", "Physical Activities Toward Health and Fitness 2"
            ]
          };
          break;

        case "Bachelor of Science in Accountancy":
          this.availableSubjects = {
            coreSubjects: [
              "Financial Accounting", "Cost Accounting", "Taxation"
            ],
            gecSubjects: [
              "Business Law", "Economics"
            ],
            peNstpSubjects: [
              "National Service Training Program", "Physical Activities Toward Health and Fitness 3"
            ]
          };
          break;

        case "Bachelor of Science in Business Administration Major in Financial Management":
          this.availableSubjects = {
            coreSubjects: [
              "Financial Management", "Investment Analysis", "Corporate Finance"
            ],
            gecSubjects: [
              "Marketing Principles", "Business Ethics"
            ],
            peNstpSubjects: [
              "National Service Training Program", "Physical Activities Toward Health and Fitness 4"
            ]
          };
          break;

        case "Bachelor of Science in Business Administration Major in Human Resource Management":
          this.availableSubjects = {
            coreSubjects: [
              "Human Resource Management", "Organizational Behavior", "Labor Relations"
            ],
            gecSubjects: [
              "Business Communication", "Psychology"
            ],
            peNstpSubjects: [
              "National Service Training Program", "Physical Activities Toward Health and Fitness 1"
            ]
          };
          break;

        case "Bachelor of Science in Business Administration Major in Marketing Management":
          this.availableSubjects = {
            coreSubjects: [
              "Marketing Principles", "Consumer Behavior", "Digital Marketing"
            ],
            gecSubjects: [
              "Advertising", "Sales Management"
            ],
            peNstpSubjects: [
              "National Service Training Program", "Physical Activities Toward Health and Fitness 2"
            ]
          };
          break;

        case "Bachelor of Science in Customs Administration":
          this.availableSubjects = {
            coreSubjects: [
              "Customs Laws", "Tariff and Trade", "Customs Procedures"
            ],
            gecSubjects: [
              "International Trade", "Business Law"
            ],
            peNstpSubjects: [
              "National Service Training Program", "Physical Activities Toward Health and Fitness 3"
            ]
          };
          break;

        case "Bachelor of Science in Computer Science":
          this.availableSubjects = {
            coreSubjects: [
              "Data Structures", "Algorithms", "Database Management"
            ],
            gecSubjects: [
              "Software Engineering", "Web Development"
            ],
            peNstpSubjects: [
              "National Service Training Program", "Physical Activities Toward Health and Fitness 4"
            ]
          };
          break;

        case "Bachelor of Science in Entertainment and Multimedia Computing":
          this.availableSubjects = {
            coreSubjects: [
              "Game Development", "Animation", "Multimedia Design"
            ],
            gecSubjects: [
              "Digital Media", "Graphic Design"
            ],
            peNstpSubjects: [
              "National Service Training Program", "Physical Activities Toward Health and Fitness 1"
            ]
          };
          break;
        case "Bachelor of Science in Information Technology":
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
            gecSubjects: [
              "Art Appreciation", "Ethics", "Mathematics in the Modern World", "People and Earth's Ecosystem", 
              "Purposive Communication", "Reading Visual Arts", "Readings in Philippine History with Indigenous People Studies", 
              "Science, Technology and Society", "The Contemporary World with Peace Studies", "The Entrepreneurial Mind", 
              "The Life and Works of Rizal", "Understanding the Self"
            ],
            peNstpSubjects: [
              "National Service Training Program with Anti-Smoking and Environmental Education", 
              "National Service Training Program with GAD and Peace Education", 
              "Physical Activities Toward Health and Fitness 1 (PATHFit 1): Movement Competency", 
              "Physical Activities Toward Health and Fitness 2 (PATHFit 2): Exercise-Based Fitness Activities", 
              "Physical Activities Toward Health and Fitness 3 (PATHFit 3)", 
              "Physical Activities Toward Health and Fitness 4 (PATHFit 4)"
            ]
          };
          break;
        case "Bachelor of Arts in Communication":
          this.availableSubjects = {
            coreSubjects: ["Public Speaking", "Media Studies", "Interpersonal Communication"],
            gecSubjects: ["Ethics", "Digital Media"],
            peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 1"]
          };
          break;

        case "Bachelor of Early Childhood Education":
          this.availableSubjects = {
            coreSubjects: ["Child Development", "Curriculum Planning", "Classroom Management"],
            gecSubjects: ["Family and Community Relations", "Creative Arts"],
            peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 2"]
          };
          break;

        case "Bachelor of Culture and Arts Education":
          this.availableSubjects = {
            coreSubjects: ["Art Education", "Cultural Studies", "Creative Arts"],
            gecSubjects: ["History of Art", "Music Appreciation"],
            peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 3"]
          };
          break;

        case "Bachelor of Physical Education":
          this.availableSubjects = {
            coreSubjects: ["Sports Science", "Physical Fitness", "Coaching"],
            gecSubjects: ["Health Education", "Recreation Management"],
            peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 4"]
          };
          break;

        case "Bachelor of Elementary Education (General Education)":
          this.availableSubjects = {
            coreSubjects: ["Teaching Strategies", "Child Psychology", "Literacy Education"],
            gecSubjects: ["Mathematics for Teachers", "Science for Teachers"],
            peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 1"]
          };
          break;

        case "Bachelor of Secondary Education major in English":
          this.availableSubjects = {
            coreSubjects: ["Teaching English", "Literature", "Language Arts"],
            gecSubjects: ["Creative Writing","Literature", "Language Arts"]
          };
            break;

case "Bachelor of Secondary Education major in Filipino":
  this.availableSubjects = {
    coreSubjects: ["Teaching Filipino", "Filipino Literature", "Language and Culture"],
    gecSubjects: ["Translation Studies", "Filipino History"],
    peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 3"]
  };
  break;

case "Bachelor of Secondary Education major in Mathematics":
  this.availableSubjects = {
    coreSubjects: ["Teaching Mathematics", "Statistics", "Calculus"],
    gecSubjects: ["Mathematics for Teachers", "Mathematical Reasoning"],
    peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 4"]
  };
  break;

case "Bachelor of Secondary Education major in Social Studies":
  this.availableSubjects = {
    coreSubjects: ["Teaching Social Studies", "History", "Geography"],
    gecSubjects: ["Civics", "Economics"],
    peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 1"]
  };
  break;

case "Bachelor of Secondary Education major in Sciences":
  this.availableSubjects = {
    coreSubjects: ["Teaching Science", "Biology", "Chemistry"],
    gecSubjects: ["Environmental Science", "Physics for Teachers"],
    peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 2"]
  };
  break;

case "Teacher Certificate Program (TCP)":
  this.availableSubjects = {
    coreSubjects: ["Teaching Methodologies", "Classroom Management", "Assessment"],
    gecSubjects: ["Educational Psychology", "Curriculum Development"],
    peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 3"]
  };
  break;

case "Bachelor of Science in Hospitality Management":
  this.availableSubjects = {
    coreSubjects: ["Food and Beverage Management", "Hotel Operations", "Event Management"],
    gecSubjects: ["Marketing Principles", "Business Law"],
    peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 4"]
  };
  break;

case "Bachelor of Science in Tourism Management":
  this.availableSubjects = {
    coreSubjects: ["Tourism Planning", "Travel Management", "Sustainable Tourism"],
    gecSubjects: ["Hospitality Marketing", "Cultural Heritage Management"],
    peNstpSubjects: ["National Service Training Program", "Physical Activities Toward Health and Fitness 1"]
  };
  break;
default:
  this.availableSubjects = [];
}
},
validateContactNumber() {
this.contactNumber = this.contactNumber.replace(/\D/g, '');
if (this.contactNumber.length > 11) {
this.contactNumber = this.contactNumber.slice(0, 11);
}
},


async submitApplication() {
const validationErrors = this.validateForm();

if (validationErrors.length > 0) {
alert('Please complete all required fields:\n\n' + validationErrors.join('\n'));
return;
}

try {
const formData = {
  personalInfo: {
    fullName: this.fullName,
    gender: this.gender === 'Other' ? this.otherGender : this.gender,
    yearLevel: this.yearLevel,
    department: this.department,
    program: this.program,
    contactNumber: this.contactNumber,
    city: this.city,
    barangay: this.barangay,
    subjects: this.selectedSubjects
  },
  profileInfo: {
    modality: this.modality,
    availabilityDays: this.selectedDays,
    bio: this.bio,
    proficiency: this.proficiency,
    sessionStyles: this.selectedsessionStyles,
    sessionDuration: this.sessionDuration,
    experience: this.experience,
    profileImage: this.profileImage,
    credentials: this.credentials
  }
};

console.log('Form submitted', formData);

this.sendEmailToAdmin(formData);

this.showStatusPopup = true;
this.isSubmitted = true;

} catch (error) {
console.error('Error submitting application:', error);
alert('There was an error submitting your application. Please try again.');
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
}
};
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
  gap: 2rem;
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
  margin-left: 0.5rem;
}

.personal-input,
.profile-input,
.gender-specify {
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

.personal-input::placeholder,
.profile-input::placeholder,
.gender-specify::placeholder {
  color: rgba(255, 255, 255, 0.6);
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
.department-dropdown,
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
  background: rgba(219, 220, 224, 0.382);
  color: white;
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
  color: #02475E;
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
  gap: 1rem;
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

/* Profile Picture and Credentials Upload */
.upload-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  margin-left: 1.5rem;
  gap: 2.5rem;
}

/* Profile Picture Upload */
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
  gap: 1rem;
}

.profile-preview-container {
  width: 60px;
  height: 60px;
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
  gap: 0.8rem;
  cursor: pointer;
}

.choose-file-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  transition: background-color 1s;
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

/* File List */
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
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

.file-name {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Credentials Modal */
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
  width: 400px;
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

.close-button {
  background-color: #155577;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 120px;
  align-self: flex-end;
  margin-top: 20px;
}

.close-button:hover {
  background-color: #032c58;
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
  border-radius: 10px;
  width: 800px;
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
  font-size: 0.7rem;
}

.subjects-column h4 {
  margin-bottom: 10px;
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
  font-size: 0.7rem;
}

.done-button {
  background-color: #155577;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 120px;
  align-self: flex-end;
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


/* Status Popup */
.status-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.status-popup-content {
  background: white;
  border: 1px solid #02475E;
  border-radius: 10px;
  width: 500px;
  max-width: 500px;
  max-height: 250px;
  height: 250px;
  color: #02475E;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.status-popup-content h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #ffffff;
  font-size: 1.2rem;
  background-color: #02475E;
  border-radius: 6px;
  padding: 9px;
}

.status-text {
  margin-top: 50px;
  font-style: italic;
  color: #155577;
  padding-left: 30px;
  padding-right: 30px;
  text-align: center;
  font-size: 15px;
}

.proceed-button {
  background-color: #19638b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  width: 200px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 50px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.proceed-button:hover {
  background-color: #033140;
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