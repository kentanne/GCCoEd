<template>
  <div class="table-container">
    <div class="table-header">
      <h2 class="table-title">
        <i class="fas fa-file-alt header-icon"></i>
        Applications
      </h2>

      <div class="filter-buttons">
        <button
          class="filter-btn"
          :class="{ active: activeFilter === 'all' }"
          @click="activeFilter = 'all'"
        >
          All
        </button>
        <button
          class="filter-btn"
          :class="{ active: activeFilter === 'approved' }"
          @click="activeFilter = 'approved'"
        >
          Approved
        </button>
        <button
          class="filter-btn"
          :class="{ active: activeFilter === 'rejected' }"
          @click="activeFilter = 'rejected'"
        >
          Rejected
        </button>
        <button
          class="filter-btn"
          :class="{ active: activeFilter === 'pending' }"
          @click="activeFilter = 'pending'"
        >
          pending
        </button>
        <!-- <button
          class="filter-btn"
          :class="{ active: activeFilter === 'resubmission' }"
          @click="activeFilter = 'resubmission'"
        >
          Resubmission
        </button> -->
      </div>

      <div class="search-container">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search applications..."
            class="search-input"
          />
        </div>
      </div>
    </div>

    <div class="table-scroll-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Applicant</th>
            <th>Program</th>
            <th>Date</th>
            <th>Credentials</th>
            <th v-if="activeFilter === 'all'">Actions</th>
            <th v-else>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in filteredApplicants" :key="app.application_id">
            <td>
              <span class="id-badge">{{ app.user_id }}</span>
            </td>
            <td>{{ app.name }}</td>
            <td>{{ app.course.match(/\(([^)]+)\)/)?.[1] || app.course }}</td>
            <td>
              <span class="date-badge">{{ formatDate(app.applied_on) }}</span>
            </td>
            <td>
              <button
                class="credentials-btn"
                @click="showCredentials(app.user_id)"
              >
                <i class="fas fa-eye"></i> <span>View</span>
              </button>
            </td>
            <td v-if="activeFilter === 'all'" class="action-buttons">
              <button
                class="action-btn accept"
                :class="{ active: app.status === 'approved' }"
                @click="showConfirmation(app.user_id, 'Approved')"
                :disabled="
                  app.status === 'approved' || app.status === 'rejected'
                "
              >
                <i class="fas fa-check"></i>
                <span>{{
                  app.status === "approved" ? "Approved" : "Accept"
                }}</span>
              </button>
              <button
                class="action-btn reject"
                :class="{ active: app.status === 'rejected' }"
                @click="showConfirmation(app.user_id, 'Rejected')"
                :disabled="
                  app.status === 'approved' || app.status === 'rejected'
                "
              >
                <i class="fas fa-times"></i>
                <span>{{
                  app.status === "rejected" ? "Rejected" : "Reject"
                }}</span>
              </button>
            </td>
            <td v-else>
              <span :class="`status-text ${app.status.toLowerCase()}`">
                {{ capitalizeFirstLetter(app.status) }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredApplicants.length === 0">
            <td
              :colspan="activeFilter === 'all' ? 6 : 6"
              class="no-applications"
            >
              No applications to display
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="hideConfirmation">
      <div class="modal">
        <h3>Confirm Action</h3>
        <hr />
        <p>
          Are you sure you want to mark this application as
          <strong>{{ actionToConfirm }}</strong
          >?
        </p>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="hideConfirmation">
            Cancel
          </button>
          <button class="modal-btn confirm" @click="confirmAction">
            Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- Credentials Modal -->
    <div
      v-if="showCredentialsModal"
      class="modal-overlay"
      @click.self="hideCredentials"
    >
      <div class="credentials-modal">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-content">
            <i class="fas fa-user-graduate modal-title-icon"></i>
            <h3 class="modal-title">Applicant Credentials</h3>
          </div>
          <button class="close-btn" @click="hideCredentials">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Applicant Profile Section -->
          <div class="applicant-profile">
            <div class="profile-image-container">
              <img
                :src="currentApp.image"
                :alt="`Portrait of ${currentApp.applicant}`"
                class="profile-image"
              />
              <div
                v-if="currentApp.status !== 'resubmission'"
                class="status-badge"
              >
                {{ currentApp.status }}
              </div>
            </div>

            <div class="profile-info">
              <h4 class="applicant-name">{{ currentApp.applicant }}</h4>
              <hr class="divider" />
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label"
                    ><i class="fas fa-venus-mars"></i> Gender</span
                  >
                  <span class="info-value">{{
                    currentApp.gender || "NON-BINARY"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"
                    ><i class="fas fa-calendar-alt"></i> Year</span
                  >
                  <span class="info-value">{{
                    currentApp.year || "2nd Year"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"
                    ><i class="fas fa-graduation-cap"></i> Program</span
                  >
                  <span class="info-value">{{
                    currentApp.program ||
                    "Bachelor of Science in Information Technology"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"
                    ><i class="fas fa-university"></i> College</span
                  >
                  <span class="info-value">{{
                    currentApp.college || "College of Computer Studies"
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"
                    ><i class="fas fa-map-marker-alt"></i> Location</span
                  >
                  <span class="info-value">{{
                    currentApp.city || "Olongapo City"
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Details Section -->
          <div class="details-section">
            <div class="details-card">
              <h4 class="section-title">
                <i class="fas fa-info-circle"></i> Application Details
              </h4>
              <hr class="divider2" />
              <div class="details-content">
                <div class="detail-item">
                  <span class="detail-label">Proficiency Level:</span>
                  <span class="detail-value">{{
                    currentApp.proficiency || "Advanced"
                  }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Teaching Modality:</span>
                  <span class="detail-value">{{
                    currentApp.modality || "Online and In-Person"
                  }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Teaching Style:</span>
                  <span class="detail-value">{{
                    currentApp.style || "Interactive"
                  }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Availability:</span>
                  <span class="detail-value">{{
                    currentApp.availability || "Monday, Wednesday, Friday"
                  }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Subjects Offered:</span>
                  <span class="detail-value">{{
                    currentApp.subjects ||
                    "Web Development, Database Management"
                  }}</span>
                </div>
              </div>
            </div>

            <div class="bio-card">
              <h4 class="section-title">
                <i class="fas fa-user-edit"></i> Bio & Experience
              </h4>
              <hr class="divider2" />
              <div class="bio-content">
                <div class="detail-item2">
                  <span class="detail-label">Bio:</span>
                  <span class="detail-value2">{{
                    currentApp.bio ||
                    "Passionate tutor with a love for helping students excel in technology and programming."
                  }}</span>
                </div>
                <div class="detail-item2">
                  <span class="detail-label">Tutoring Experience:</span>
                  <span class="detail-value2">{{
                    currentApp.experience ||
                    "2 years of experience in tutoring web development and database management."
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Credentials Section -->
          <div class="credentials-section">
            <h4 class="section-title">
              <i class="fas fa-file-alt"></i> Submitted Credentials
            </h4>
            <div class="credentials-grid">
              <div
                v-for="file in currentApp.files"
                :key="file.id"
                class="credential-card"
              >
                <div class="file-icon">
                  <i class="fas fa-file-pdf"></i>
                </div>
                <div class="file-info">
                  <span class="file-name">{{ file.name }}</span>
                  <div class="file-actions">
                    <button
                      @click="previewFile(file.previewLink)"
                      class="action-btn preview"
                    >
                      <i class="fas fa-eye"></i> Preview
                    </button>
                    <button
                      @click="downloadFile(file.downloadLink, file.name)"
                      class="action-btn download"
                    >
                      <i class="fas fa-download"></i> Download
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="!currentApp.files?.length" class="no-credentials">
                No credentials submitted
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <div class="footer-actions">
            <button class="footer-btn back" @click="hideCredentials">
              <i class="fas fa-arrow-left"></i> Back to Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, capitalize } from "vue";
import axios from "axios";
// import { get } from "core-js/core/dict";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const approve = async (id) => {
  try {
    const response = await axios.patch(
      `http://localhost:8000/api/admin/mentor/approve/${id}`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      }
    );

    if (response.status === 200) {
      console.log("Application approved successfully:", response.data);
      return response.data;
    }
    throw new Error(`Failed to approve application: ${response.status}`);
  } catch (error) {
    console.error("Error approving application:", error);
    throw error;
  }
};

const reject = async (id) => {
  try {
    const response = await axios.patch(
      `http://localhost:8000/api/admin/mentor/reject/${id}`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      }
    );

    if (response.status === 200) {
      console.log("Application rejected successfully:", response.data);
      return response.data;
    }
    throw new Error(`Failed to reject application: ${response.status}`);
  } catch (error) {
    console.error("Error rejecting application:", error);
    throw error;
  }
};

const getApplicantDetails = async (applicantId) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/admin/${applicantId}`,
      {
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      }
    );

    if (response.status === 200) {
      console.log("User details fetched successfully:", response.data);
      return response.data;
    }
    throw new Error(`Failed to fetch user details: ${response.status}`);
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

const getApplicantCreds = async (applicationId) => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/admin/cred/" + applicationId,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      }
    );

    if (response.status === 200) {
      console.log("Applicant credentials fetched successfully:", response.data);
      return response.data;
    }
    throw new Error(
      `Failed to fetch applicant credentials: ${response.status}`
    );
  } catch (error) {
    console.error("Error fetching applicant credentials:", error);
  }
};

// Replace the existing previewFile and downloadFile functions with these simpler versions
const previewFile = (previewLink) => {
  if (previewLink) {
    window.open(previewLink, "_blank");
  }
};

const downloadFile = (downloadLink, fileName) => {
  if (downloadLink) {
    const link = document.createElement("a");
    link.href = downloadLink;
    link.download = fileName || "credential.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Reactive refs
const searchQuery = ref("");
const activeFilter = ref("all");
const showModal = ref(false);
const showCredentialsModal = ref(false);
const currentAppId = ref(null);
const currentApp = ref({});
const actionToConfirm = ref("");

// Sample data (should be replaced with API data later)
const allApplications = ref([
  // {
  //   id: 1,
  //   applicant: "Mark Luis Torre",
  //   program: "BSIT",
  //   date: "2023-05-15",
  //   status: "resubmission",
  //   image:
  //     "https://storage.googleapis.com/a1aa/image/4f0273a6-c19f-4d79-805a-06a27be15e04.jpg",
  //   gender: "MALE",
  //   year: "2nd Year",
  //   college: "College of Computer Studies",
  //   city: "Olongapo City",
  //   barangay: "East Bajac-Bajac",
  //   proficiency: "Advanced",
  //   modality: "Online and In-Person",
  //   style: "Interactive",
  //   availability: "Monday, Wednesday, and Friday",
  //   subjects:
  //     "Web Development, Database Management, and Programming Fundamentals",
  //   bio: "Passionate tutor with a love for helping students excel in technology and programming.",
  //   experience:
  //     "2 years of experience in tutoring web development and database management.",
  //   files: [
  //     "Resume.pdf",
  //     "CertificateOfTraining.pdf",
  //     "IDProof.pdf",
  //     "ReferenceLetter.pdf",
  //     "ProficiencyCertificate.pdf",
  //     "Portfolio.pdf",
  //   ],
  // },
  // {
  //   id: 2,
  //   applicant: "Jane Smith",
  //   program: "BSCS",
  //   date: "2023-05-10",
  //   status: "resubmission",
  //   image: "https://randomuser.me/api/portraits/women/44.jpg",
  //   gender: "FEMALE",
  //   year: "3rd Year",
  //   college: "College of Computer Studies",
  //   city: "Subic",
  //   barangay: "Barretto",
  //   proficiency: "Intermediate",
  //   modality: "Online Only",
  //   style: "Demonstrative",
  //   availability: "Tuesday, Thursday",
  //   subjects: "Data Structures, Algorithms",
  //   bio: "Enthusiastic about teaching core computer science concepts.",
  //   experience: "1 year of tutoring experience",
  //   files: ["Resume.pdf", "Transcript.pdf", "IDProof.pdf"],
  // },
  // {
  //   id: 3,
  //   applicant: "John Doe",
  //   program: "BSIT",
  //   date: "2023-05-05",
  //   status: "resubmission",
  //   image: "https://randomuser.me/api/portraits/men/32.jpg",
  //   gender: "MALE",
  //   year: "4th Year",
  //   college: "College of Computer Studies",
  //   city: "Olongapo City",
  //   barangay: "Gordon Heights",
  //   proficiency: "Expert",
  //   modality: "In-Person Only",
  //   style: "Practical",
  //   availability: "Weekends",
  //   subjects: "Networking, System Administration",
  //   bio: "Industry professional with 5 years of experience in IT.",
  //   experience: "3 years of mentoring interns",
  //   files: ["Resume.pdf", "Certifications.pdf", "RecommendationLetter.pdf"],
  // },
]);

const approvedApplications = ref([]);
const rejectedApplications = ref([]);
const resubmissionApplications = ref([]);
const applicantsList = ref([]);

// Update the props definition
const props = defineProps({
  applicantsList: {
    type: Object,
    required: true,
    default: () => ({
      status: "",
      mentors: {
        pending: [],
        approved: [],
        rejected: [],
      },
    }),
  },
});

// Update the filteredApplicants computed property
const filteredApplicants = computed(() => {
  if (!props.applicantsList?.mentors) {
    return [];
  }

  let allApplicants = [
    ...props.applicantsList.mentors.pending,
    ...props.applicantsList.mentors.approved,
    ...props.applicantsList.mentors.rejected,
  ];

  // Apply status filter
  if (activeFilter.value !== "all") {
    allApplicants = props.applicantsList.mentors[activeFilter.value] || [];
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    allApplicants = allApplicants.filter(
      (app) =>
        (app.name?.toLowerCase() || "").includes(query) ||
        (app.course?.toLowerCase() || "").includes(query)
    );
  }

  return allApplicants;
});

// Add date formatter
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const capitalizeFirstLetter = (str) => {
  if (!str) return "Not specified";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Methods
const showConfirmation = (id, action) => {
  currentAppId.value = id;
  actionToConfirm.value = action;
  showModal.value = true;
};

const hideConfirmation = () => {
  showModal.value = false;
};

const confirmAction = async () => {
  try {
    if (actionToConfirm.value === "Approved") {
      await approve(currentAppId.value);
      console.log("Application approved successfully");
    } else if (actionToConfirm.value === "Rejected") {
      await reject(currentAppId.value);
      console.log("Application rejected successfully");
    }

    // Refresh the applications list or update local state
    const appIndex = props.applicantsList.applicants.findIndex(
      (app) => app.user_id === currentAppId.value
    );

    if (appIndex !== -1) {
      props.applicantsList.applicants[appIndex].status =
        actionToConfirm.value.toLowerCase();
    }

    // Close the confirmation modal
    hideConfirmation();
  } catch (error) {
    console.error(
      `Error ${actionToConfirm.value.toLowerCase()} application:`,
      error
    );
  }
};

const showCredentials = async (app) => {
  try {
    const data = await getApplicantDetails(app);
    const credentialsResponse = await getApplicantCreds(app);

    if (!data || !data.user || !data.info) {
      console.error("Invalid response data structure");
      return;
    }

    currentApp.value = {
      // ... existing user details ...
      applicant: data.user.name || "N/A",
      image: data.info.image
        ? "http://localhost:8000/api/image/" + data.info.image
        : "default-image-url",
      status:
        capitalizeFirstLetter(data.info.approval_status) ||
        data.info.approval_status,
      gender: data.info.gender?.toUpperCase() || "N/A",
      year: data.info.year || "N/A",
      program: data.info.course || "N/A",
      college: "College of Computer Studies",
      city: data.info.address || "N/A",
      proficiency: data.info.proficiency || "N/A",
      modality: data.info.learn_modality || "N/A",
      style: data.info.teach_sty
        ? JSON.parse(data.info.teach_sty).join(", ")
        : "N/A",
      availability: data.info.availability
        ? JSON.parse(data.info.availability).join(", ")
        : "N/A",
      subjects: data.info.subjects
        ? JSON.parse(data.info.subjects).join(", ")
        : "N/A",
      bio: data.info.bio || "No bio provided",
      experience: data.info.exp || "No experience provided",

      // Update the files property to use the credentials response
      files:
        credentialsResponse?.credentials?.map((cred) => ({
          id: cred.id,
          name: cred.name,
          previewLink: cred.previewLink,
          downloadLink: cred.downloadLink,
          // url: `https://drive.google.com/file/d/${cred.id}/view`,
        })) || [],
    };

    showCredentialsModal.value = true;
  } catch (error) {
    console.error("Error showing credentials:", error);
  }
};

const hideCredentials = () => {
  showCredentialsModal.value = false;
};

// Modify the onMounted hook
onMounted(async () => {
  if (props.applicantsList && props.applicantsList.applicants) {
    console.log(props.applicantsList.applicants);
  }
});

// Define props if needed
// defineProps(['propName']);

// Define emits if needed
// defineEmits(['eventName']);
</script>

<style scoped>
:root {
  --primary: #3b9aa9;
  --primary-light: #6dd1e3;
  --primary-dark: #0b3e8a;
  --secondary: #ffc107;
  --danger: #f44336;
  --success: #4caf50;
  --warning: #ffa500;
  --text-dark: #0b2548;
  --text-light: #f5f7fa;
  --bg-light: #ffffff;
  --border: #e1e4e8;
}

.table-container {
  background: var(--bg-light);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(26, 79, 159, 0.5);
  overflow: hidden;
  width: 90%;
  margin: 0 auto;
  padding: 0 1rem 0 1rem;
  text-align: center;
  max-height: 465px;
  height: 460px;
  overflow-y: auto;
  margin-top: 2rem;
}

.table-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  gap: 1rem;
  flex-wrap: wrap;
  color: #0b2548;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-grow: 1;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background: rgba(223, 223, 223, 0.5);
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  font-weight: 600;
}

.filter-btn:nth-child(2) {
  color: rgba(76, 175, 80, 0.9);
}

.filter-btn:hover:nth-child(2) {
  background: rgba(164, 255, 156, 0.5);
}

.filter-btn:nth-child(3) {
  color: rgba(244, 67, 54, 0.9);
}

.filter-btn:hover:nth-child(3) {
  background: rgba(255, 156, 156, 0.5);
}

.filter-btn:nth-child(4) {
  color: rgba(255, 165, 0, 0.9);
}

.filter-btn:hover:nth-child(4) {
  background: rgba(255, 225, 156, 0.5);
}

.table-scroll-container {
  overflow-y: auto;
}

.data-table thead th {
  position: sticky;
  top: 0;
  background-color: rgb(211, 211, 211);
  z-index: 1;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.data-table th {
  position: sticky;
  top: 0;
  background-color: #e5e5e5;
  color: var(--text-dark);
  font-weight: 600;
  padding: 0.75rem;
  border-bottom: 2px solid var(--primary);
}

.data-table td {
  padding: 0.8rem;
  vertical-align: middle;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.7rem;
  transition: all 0.2s ease;
}

.action-btn.accept {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.action-btn.reject {
  background-color: rgba(244, 67, 54, 0.1);
  color: #c62828;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.action-btn.resubmission {
  background-color: rgba(255, 165, 0, 0.1);
  color: #ef6c00;
  border: 1px solid rgba(255, 165, 0, 0.3);
}

.action-btn.accept:hover {
  background-color: rgba(76, 175, 80, 0.2);
}

.action-btn.reject:hover {
  background-color: rgba(244, 67, 54, 0.2);
}

.action-btn.resubmission:hover {
  background-color: rgba(255, 165, 0, 0.2);
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none; /* Completely disable hover */
  background-color: #f3f4f6 !important;
  border-color: #d1d5db;
  color: #9ca3af;
}

.action-btn.accept.active {
  background-color: rgba(76, 175, 80, 0.4) !important; /* Increased opacity */
  border-color: #2e7d32;
  cursor: default;
  font-weight: 700; /* Make text bolder */
  transform: scale(1.05); /* Slightly larger */
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.3); /* Add shadow */
  color: #0a6b0f;
}

.action-btn.reject.active {
  background-color: rgba(244, 67, 54, 0.4) !important; /* Increased opacity */
  border-color: #c62828;
  cursor: default;
  font-weight: 700; /* Make text bolder */
  transform: scale(1.05); /* Slightly larger */
  box-shadow: 0 2px 8px rgba(198, 40, 40, 0.3); /* Add shadow */
  color: #6b0a0a;
}

/* Disable hover effects for active buttons */
.action-btn.accept.active:hover {
  background-color: rgba(76, 175, 80, 0.4) !important;
  transform: scale(1.05);
  cursor: default;
}

.action-btn.reject.active:hover {
  background-color: rgba(244, 67, 54, 0.4) !important;
  transform: scale(1.05);
  cursor: default;
}

.action-btn i {
  font-size: 0.9rem;
}

.credentials-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--primary-dark);
  background-color: rgba(73, 152, 164, 0.103);
  color: var(--primary-dark);
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.credentials-btn:hover {
  background-color: rgba(59, 154, 169, 0.2);
}

.id-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background-color: rgba(59, 154, 169, 0.1);
  color: var(--primary);
  font-weight: 500;
}

.date-badge {
  display: inline-block;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.status-text {
  font-weight: 600;
}

.status-text.approved {
  color: #2e7d32;
}

.status-text.rejected {
  color: #c62828;
}

.status-text.resubmission {
  color: #ef6c00;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal h3 {
  margin-top: 0;
  color: var(--primary-dark);
  margin-bottom: 1rem;
}

.modal p {
  margin-bottom: 2rem;
  margin-top: 2rem;
}

.credentials-content {
  margin-bottom: 1.5rem;
}

.credentials-content p {
  margin: 0.5rem 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: -15px;
}

.modal-btn.cancel {
  color: #e5e5e5;
  background-color: #0b3e8a;
  border-radius: 10px;
}

.modal-btn.confirm {
  color: #e5e5e5;
  background-color: #2e7d32;
  border-radius: 10px;
}

.no-applications {
  text-align: center;
  padding: 1rem;
  color: var(--text-dark);
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--primary);
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid rgb(17, 17, 95);
  border-radius: 8px;
  width: 250px;
  font-size: 0.8rem;
  height: 13px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 2px 8px rgba(54, 88, 141, 0.7);
}

.table-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.table-scroll-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

.table-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(59, 154, 169, 0.3);
  border-radius: 4px;
}

/* Credentials Modal */
.credentials-modal {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

/* Modal Header */
.modal-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #0b3e8a, #3b9aa9);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-title-icon {
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Modal Body */
.modal-body {
  padding: 1.5rem;
}

/* Applicant Profile */
.applicant-profile {
  display: flex;
  gap: 3rem;
  margin-bottom: 2rem;
  align-items: flex-start;
}

.profile-image-container {
  position: relative;
  flex-shrink: 0;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e1e4e8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transform: translateY(25%);
  background-color: #ef6c00; /* Default color for pending */
}

.status-badge.approved {
  background-color: #2e7d32;
}

.status-badge.rejected {
  background-color: #c62828;
}

.status-badge.pending,
.status-badge.pending_approval {
  background-color: #ef6c00;
}

.profile-info {
  flex-grow: 1;
}

.divider {
  border: none;
  border-top: 4px solid #8a8a8f;
  margin-bottom: 1rem;
  margin-top: -1rem;
}

.divider2 {
  border: none;
  border-top: 1px solid #8a8a8f;
  margin-bottom: 1.5rem;
  margin-top: -0.5rem;
}

.applicant-name {
  margin: 0.6rem 0 1.5rem 0;
  font-size: 1.6rem;
  color: #0b2548;
  font-weight: 700;
  text-align: left;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.info-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-label i {
  width: 16px;
  text-align: center;
}

.info-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0b234a;
  margin-left: 25px;
}

/* Details Section */
.details-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.details-card,
.bio-card {
  background: #f9fafb;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.section-title {
  margin: 0 0 1.25rem 0;
  font-size: 1.1rem;
  color: #0b3e8a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.section-title i {
  font-size: 1rem;
}

.details-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;
  margin-bottom: 1.1rem;
}

.detail-item2 {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.detail-value2 {
  font-weight: 600;
  color: #1f2937;
  text-align: left;
  flex: 1;
  padding-left: 1rem;
  font-size: 0.9rem;
}

.detail-label {
  font-weight: 500;
  color: #4b5563;
  font-size: 0.85rem;
  flex: 1;
}

.detail-value {
  font-weight: 600;
  color: #1f2937;
  text-align: right;
  flex: 1;
  padding-left: 1rem;
  font-size: 0.9rem;
}

.bio-content {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #4b5563;
  text-align: left;
}

.bio-text {
  margin-bottom: 2rem;
}

.experience-text {
  font-style: italic;
  color: #6b7280;
}

/* Credentials Section */
.credentials-section {
  margin-top: 1.5rem;
}

.credentials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.credential-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s, box-shadow 0.2s;
}

.credential-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-icon {
  font-size: 2rem;
  color: #e63946;
  flex-shrink: 0;
}

.file-info {
  flex-grow: 1;
  min-width: 0;
}

.file-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1f2937;
  display: block;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s;
}

.action-btn.preview {
  background-color: rgba(59, 154, 169, 0.1);
  color: #0b3e8a;
}

.action-btn.preview:hover {
  background-color: rgba(59, 154, 169, 0.2);
}

.action-btn.download {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
}

.action-btn.download:hover {
  background-color: rgba(76, 175, 80, 0.2);
}

/* Modal Footer */
.modal-footer {
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end; /* Changed to flex-end to align right */
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.footer-btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  font-size: 0.9rem;
}
.footer-actions {
  display: flex;
  gap: 0.75rem;
}

.footer-btn.back {
  background-color: transparent;
  color: #6b7280;
}

.footer-btn.back:hover {
  background-color: #e5e7eb;
}

.footer-btn.accept {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
}

.footer-btn.accept:hover {
  background-color: rgba(76, 175, 80, 0.2);
}

.footer-btn.reject {
  background-color: rgba(244, 67, 54, 0.1);
  color: #c62828;
}

.footer-btn.reject:hover {
  background-color: rgba(244, 67, 54, 0.2);
}

.footer-btn.resubmit {
  background-color: rgba(255, 165, 0, 0.1);
  color: #ef6c00;
}

.footer-btn.resubmit:hover {
  background-color: rgba(255, 165, 0, 0.2);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .search-container {
    margin-left: 0;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
/* Responsive Design */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .search-container {
    margin-left: 0;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  /* Credentials Modal Responsive */
  .applicant-profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .details-section {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
    gap: 1rem;
  }

  .action-buttons {
    width: 100%;
    flex-direction: column;
  }

  .footer-btn {
    width: 100%;
    justify-content: center;
  }

  .credentials-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .data-table {
    display: block;
    overflow-x: auto;
  }

  .filter-buttons {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .filter-btn {
    flex-shrink: 0;
  }
}
</style>
