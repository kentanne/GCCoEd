<template>
  <div class="table-container">
    <div class="table-header">
      <h2 class="table-title">
        <i class="fas fa-users header-icon"></i>
        Users
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
          :class="{ active: activeFilter === 'mentors' }"
          @click="activeFilter = 'mentors'"
        >
          Mentors
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: activeFilter === 'learners' }"
          @click="activeFilter = 'learners'"
        >
          Learners
        </button>
      </div>

      <div class="search-container">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search users..."
            class="search-input"
          >
        </div>
        <button class="export-btn" @click="exportUsersToCSV">
          <i class="fas fa-download"></i> Export
        </button>
      </div>
    </div>
    
    <div class="table-scroll-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Year</th>
            <th>Program</th>
            <th>Role</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in displayedUsers" :key="user.id">
            <td><span class="id-badge">{{ user.id }}</span></td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.year || 'N/A' }}</td>
            <td>{{ user.program || 'N/A' }}</td>
            <td>
              <span :class="`role-badge ${user.role.toLowerCase()}`">
                {{ user.role }}
              </span>
            </td>
            <td>
              <button class="details-btn" @click="showUserDetails(user)">
                <i class="fas fa-eye"></i> <span>View</span>
              </button>
            </td>
          </tr>
          <tr v-if="displayedUsers.length === 0">
            <td colspan="7" class="no-users">
              No users to display
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- User Details Modal -->
    <div v-if="showUserModal" class="modal-overlay" @click.self="hideUserDetails">
      <div class="user-modal">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-content">
            <i class="fas fa-user modal-title-icon"></i>
            <h3 class="modal-title">User Details</h3>
          </div>
          <button class="close-btn" @click="hideUserDetails">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body">
          <!-- User Profile Section -->
          <div class="user-profile">
            <div class="profile-image-container">
              <img :src="currentUser.image" :alt="`Portrait of ${currentUser.name}`" class="profile-image"/>
              <div class="role-badge-large" :class="currentUser.role.toLowerCase()">
                {{ currentUser.role }}
              </div>
            </div>
            
            <div class="profile-info">
              <h4 class="user-name">{{ currentUser.name }}</h4>
              <hr class="divider" />
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label"><i class="fas fa-envelope"></i> Email</span>
                  <span class="info-value">{{ currentUser.email }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"><i class="fas fa-phone"></i> Contact Number</span>
                  <span class="info-value">{{ currentUser.phone || 'Not provided' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"><i class="fas fa-calendar-alt"></i> Year Level</span>
                  <span class="info-value">{{ currentUser.year || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"><i class="fas fa-graduation-cap"></i> Program</span>
                  <span class="info-value">{{ currentUser.program || 'N/A' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"><i class="fas fa-university"></i> Department</span>
                  <span class="info-value">{{ currentUser.department || 'College of Computer Studies' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"><i class="fas fa-venus-mars"></i> Gender</span>
                  <span class="info-value">{{ currentUser.gender || 'Not specified' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"><i class="fas fa-map-marker-alt"></i> Address</span>
                  <span class="info-value">{{ currentUser.address || 'Not provided' }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Role-Specific Details Section -->
          <div class="details-section">
            <!-- Mentor Specific Information -->
            <template v-if="currentUser.role === 'Mentor'">
              <div class="details-card">
                <h4 class="section-title">
                  <i class="fas fa-chalkboard-teacher"></i> Teaching Information
                </h4>
                <hr class="divider2" />
                <div class="details-content">
                  <div class="detail-item">
                    <span class="detail-label">Teaching Modality:</span>
                    <span class="detail-value">{{ currentUser.teachingModality || 'Not specified' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Days of Availability:</span>
                    <span class="detail-value">{{ currentUser.availability || 'Not specified' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Proficiency Level:</span>
                    <span class="detail-value">{{ currentUser.proficiency || 'Not specified' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Teaching Style:</span>
                    <span class="detail-value">{{ currentUser.teachingStyle || 'Not specified' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Preferred Session Duration:</span>
                    <span class="detail-value">{{ currentUser.sessionDuration || 'Not specified' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Course Offered:</span>
                    <span class="detail-value">{{ currentUser.coursesOffered || 'Not specified' }}</span>
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
                    <span class="detail-label">Short Bio:</span>
                    <span class="detail-value2">{{ currentUser.bio || 'No bio provided' }}</span>
                  </div>
                  <div class="detail-item2">
                    <span class="detail-label">Tutoring Experience:</span>
                    <span class="detail-value2">{{ currentUser.experience || 'No experience provided' }}</span>
                  </div>
                </div>
              </div>

              <!-- Credentials Section -->
              <div class="credentials-section" v-if="currentUser.credentialsFiles">
                <h4 class="section-title">
                  <i class="fas fa-file-alt"></i> Credentials
                </h4>
                <div class="credentials-grid">
                  <div v-for="(file, index) in currentUser.credentialsFiles" :key="index" class="credential-card">
                    <div class="file-icon">
                      <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="file-info">
                      <span class="file-name">{{ file.name }}</span>
                      <div class="file-actions">
                        <button class="action-btn preview">
                          <i class="fas fa-eye"></i> Preview
                        </button>
                        <button class="action-btn download" @click="downloadFile(file)">
                          <i class="fas fa-download"></i> Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Learner Specific Information -->
            <template v-else-if="currentUser.role === 'Learner'">
              <div class="details-card">
                <h4 class="section-title">
                  <i class="fas fa-book-open"></i> Learning Preferences
                </h4>
                <hr class="divider2" />
                <div class="details-content">
                  <div class="detail-item">
                    <span class="detail-label">Learning Modality:</span>
                    <span class="detail-value">{{ currentUser.learningModality || 'Not specified' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Days of Availability:</span>
                    <span class="detail-value">{{ currentUser.availability || 'Not specified' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Learning Style:</span>
                    <span class="detail-value">{{ currentUser.learningStyle || 'Not specified' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Preferred Session Duration:</span>
                    <span class="detail-value">{{ currentUser.sessionDuration || 'Not specified' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Subject of Interest:</span>
                    <span class="detail-value">{{ currentUser.subjectsInterest || 'Not specified' }}</span>
                  </div>
                </div>
              </div>
              
              <div class="bio-card">
                <h4 class="section-title">
                  <i class="fas fa-user-edit"></i> Bio & Goals
                </h4>
                <hr class="divider2" />
                <div class="bio-content">
                  <div class="detail-item2">
                    <span class="detail-label">Short Bio:</span>
                    <span class="detail-value2">{{ currentUser.bio || 'No bio provided' }}</span>
                  </div>
                  <div class="detail-item2">
                    <span class="detail-label">Learning Goals:</span>
                    <span class="detail-value2">{{ currentUser.learningGoals || 'No goals provided' }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="modal-footer">
          <div class="footer-actions">
            <button class="footer-btn back" @click="hideUserDetails">
              <i class="fas fa-arrow-left"></i> Back to Users
            </button>
            <button class="footer-btn export" @click="exportUserToPDF(currentUser)">
              <i class="fas fa-file-pdf"></i> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed } from 'vue';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import logoGccoed from '@/assets/logo_gccoed.png';

export default {
  setup() {
    const searchQuery = ref('');
    const activeFilter = ref('all');
    const showUserModal = ref(false);
    const currentUser = ref({});

    const allUsers = ref([
      { 
        id: 1, 
        name: 'Mark Luis Torre', 
        email: 'mark.torre@example.com',
        year: '2nd Year',
        program: 'BSIT',
        role: 'Mentor',
        phone: '+1 (555) 123-4567',
        image: 'https://storage.googleapis.com/a1aa/image/4f0273a6-c19f-4d79-805a-06a27be15e04.jpg',
        department: 'College of Computer Studies',
        gender: 'Male',
        address: '123 Main St, Olongapo City',
        teachingModality: 'Online and In-Person',
        availability: 'Monday, Wednesday, Friday',
        proficiency: 'Advanced',
        teachingStyle: 'Interactive',
        sessionDuration: '1-2 hours',
        coursesOffered: 'Web Development, Database Management',
        bio: 'Passionate tutor with a love for helping students excel in technology and programming.',
        experience: '2 years of experience in tutoring web development and database management.',
        credentialsFiles: [
          { name: 'Web Development Certificate.pdf', url: '#' },
          { name: 'Teaching Credentials.pdf', url: '#' },
          { name: 'Microsoft Certified.pdf', url: '#' }
        ]
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        email: 'jane.smith@example.com',
        year: '3rd Year',
        program: 'BSCS',
        role: 'Learner',
        phone: '+1 (555) 987-6543',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        department: 'College of Computer Studies',
        gender: 'Female',
        address: '456 Oak St, Subic',
        learningModality: 'Online Only',
        availability: 'Tuesday, Thursday',
        learningStyle: 'Visual',
        sessionDuration: '1 hour',
        subjectsInterest: 'Data Structures, Algorithms',
        bio: 'Enthusiastic learner interested in computer science concepts.',
        learningGoals: 'Master data structures and algorithms for competitive programming.'
      }
    ]);

    const displayedUsers = computed(() => {
      let users = [...allUsers.value];
      
      if (activeFilter.value === 'mentors') {
        users = users.filter(user => user.role === 'Mentor');
      } else if (activeFilter.value === 'learners') {
        users = users.filter(user => user.role === 'Learner');
      }

      return users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.program?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.year?.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const showUserDetails = (user) => {
      currentUser.value = user;
      showUserModal.value = true;
    };

    const hideUserDetails = () => {
      showUserModal.value = false;
    };

    const exportUsersToCSV = () => {
      const data = displayedUsers.value.map(user => ({
        ID: user.id,
        Name: user.name,
        Email: user.email,
        Year: user.year || 'N/A',
        Program: user.program || 'N/A',
        Role: user.role,
        Phone: user.phone || 'N/A',
        Department: user.department || 'N/A',
        Gender: user.gender || 'N/A',
        Address: user.address || 'N/A'
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      
      const colWidths = [
        { wch: 8 }, { wch: 25 }, { wch: 30 }, 
        { wch: 10 }, { wch: 20 }, { wch: 12 },
        { wch: 20 }, { wch: 25 }, { wch: 10 }, 
        { wch: 30 }
      ];
      worksheet['!cols'] = colWidths;
      
      const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
      for(let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({r: headerRange.s.r, c: C});
        if(!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = { 
          font: { bold: true },
          alignment: { horizontal: 'center' },
          fill: { fgColor: { rgb: "D3D3D3" } }
        };
      }
      
      for(let R = headerRange.s.r + 1; R <= headerRange.e.r; ++R) {
        worksheet['!rows'] = worksheet['!rows'] || [];
        worksheet['!rows'][R] = { hpx: 20 };
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      
      let reportType = 'users';
      if (activeFilter.value === 'mentors') reportType = 'mentors';
      if (activeFilter.value === 'learners') reportType = 'learners';
      const formattedDate = new Date().toISOString().slice(0, 10);
      
      XLSX.writeFile(workbook, `${reportType}_report_${formattedDate}.xlsx`);
    };

    const exportUserToPDF = async (user) => {
      const element = document.createElement('div');
      
      // Convert logo to base64
      const getBase64Logo = () => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.src = logoGccoed;
        });
      };

      const logoBase64 = await getBase64Logo();

      element.innerHTML = `
        <style>
          .pdf-header {
            text-align: center; 
            margin-bottom: 20px;
          }
          .logo-container {
            display: flex; 
            justify-content: center; 
            align-items: center; 
            margin-bottom: 10px;
          }
          .logo {
            height: 80px;
            margin-right: 20px;
          }
          .institution-name {
            margin: 0; 
            color: #0B3E8A; 
            font-size: 24px;
          }
          .institution-sub {
            margin: 0; 
            color: #3B9AA9; 
            font-size: 20px;
          }
          .report-title {
            color: #0B3E8A; 
            border-top: 2px solid #0B3E8A; 
            border-bottom: 2px solid #0B3E8A; 
            padding: 5px 0; 
            margin: 0 auto; 
            width: 80%;
          }
          .user-title {
            color: #3B9AA9; 
            border-bottom: 2px solid #3B9AA9; 
            padding-bottom: 5px; 
            margin-top: 20px;
          }
          .section-title {
            color: #0B3E8A; 
            margin-top: 20px;
          }
          .info-table {
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px;
          }
          .info-table td {
            padding: 8px; 
            border: 1px solid #ddd;
          }
          .info-label {
            width: 30%; 
            font-weight: bold; 
            background-color: #f5f5f5;
          }
          .pdf-footer {
            margin-top: 40px; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
            border-top: 1px solid #eee; 
            padding-top: 10px;
          }
        </style>

        <div class="pdf-header">
          <div class="logo-container">
            <img src="${logoBase64}" alt="GCCOED Logo" class="logo">
            <div>
              <h1 class="institution-name">GCCoEd</h1>
              <h2 class="institution-sub">College of Computer Studies</h2>
            </div>
          </div>
          <h3 class="report-title">User Report</h3>
        </div>
        
        <h2 class="user-title">
          ${user.name} <span style="font-size: 16px; color: #666;">(${user.role})</span>
        </h2>
        
        <h3 class="section-title">Basic Information</h3>
        <table class="info-table">
          <tr>
            <td class="info-label">Email</td>
            <td>${user.email}</td>
          </tr>
          <tr>
            <td class="info-label">Contact Number</td>
            <td>${user.phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td class="info-label">Year Level</td>
            <td>${user.year || 'N/A'}</td>
          </tr>
          <tr>
            <td class="info-label">Program</td>
            <td>${user.program || 'N/A'}</td>
          </tr>
          <tr>
            <td class="info-label">Department</td>
            <td>${user.department || 'College of Computer Studies'}</td>
          </tr>
          <tr>
            <td class="info-label">Gender</td>
            <td>${user.gender || 'Not specified'}</td>
          </tr>
          <tr>
            <td class="info-label">Address</td>
            <td>${user.address || 'Not provided'}</td>
          </tr>
        </table>
        
        ${user.role === 'Mentor' ? `
        <h3 class="section-title">Teaching Information</h3>
        <table class="info-table">
          <tr>
            <td class="info-label">Teaching Modality</td>
            <td>${user.teachingModality || 'Not specified'}</td>
          </tr>
          <tr>
            <td class="info-label">Days of Availability</td>
            <td>${user.availability || 'Not specified'}</td>
          </tr>
          <tr>
            <td class="info-label">Proficiency Level</td>
            <td>${user.proficiency || 'Not specified'}</td>
          </tr>
          <tr>
            <td class="info-label">Teaching Style</td>
            <td>${user.teachingStyle || 'Not specified'}</td>
          </tr>
          <tr>
            <td class="info-label">Preferred Session Duration</td>
            <td>${user.sessionDuration || 'Not specified'}</td>
          </tr>
          <tr>
            <td class="info-label">Course Offered</td>
            <td>${user.coursesOffered || 'Not specified'}</td>
          </tr>
        </table>
        
        <h3 class="section-title">Bio & Experience</h3>
        <p style="margin-bottom: 10px;"><strong>Short Bio:</strong></p>
        <p style="margin-bottom: 20px;">${user.bio || 'No bio provided'}</p>
        <p style="margin-bottom: 10px;"><strong>Tutoring Experience:</strong></p>
        <p>${user.experience || 'No experience provided'}</p>
        ` : ''}
        
        ${user.role === 'Learner' ? `
        <h3 class="section-title">Learning Preferences</h3>
        <table class="info-table">
          <tr>
            <td class="info-label">Learning Modality</td>
            <td>${user.learningModality || 'Not specified'}</td>
          </tr>
          <tr>
            <td class="info-label">Days of Availability</td>
            <td>${user.availability || 'Not specified'}</td>
          </tr>
          <tr>
            <td class="info-label">Learning Style</td>
            <td>${user.learningStyle || 'Not specified'}</td>
          </tr>
          <tr>
            <td class="info-label">Preferred Session Duration</td>
            <td>${user.sessionDuration || 'Not specified'}</td>
          </tr>
          <tr>
            <td class="info-label">Subjects of Interest</td>
            <td>${user.subjectsInterest || 'Not specified'}</td>
          </tr>
        </table>
        
        <h3 class="section-title">Bio & Goals</h3>
        <p style="margin-bottom: 10px;"><strong>Short Bio:</strong></p>
        <p style="margin-bottom: 20px;">${user.bio || 'No bio provided'}</p>
        <p style="margin-bottom: 10px;"><strong>Learning Goals:</strong></p>
        <p>${user.learningGoals || 'No goals provided'}</p>
        ` : ''}
        
        <div class="pdf-footer">
          <p>GCCoEd</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      `;

      const opt = {
        margin: 10,
        filename: `user_${user.id}_${user.name.replace(' ', '_')}_report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          logging: true,
          useCORS: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      html2pdf().from(element).set(opt).save();
    };

    const downloadFile = (file) => {
      alert(`Downloading file: ${file.name}`);
    };

    return {
      searchQuery,
      activeFilter,
      displayedUsers,
      showUserDetails,
      hideUserDetails,
      showUserModal,
      currentUser,
      exportUsersToCSV,
      exportUserToPDF,
      downloadFile
    };
  }
};
</script>


<style scoped>
:root {
  --primary: #3B9AA9;
  --primary-light: #6DD1E3;
  --primary-dark: #0B3E8A;
  --secondary: #FFC107;
  --danger: #F44336;
  --success: #4CAF50;
  --warning: #FFA000;
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

.table-title {
  margin: 0;
  font-size: 1.5rem;
  color: rgb(18, 44, 84);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  font-size: 1.2rem;
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
  color: rgba(39, 74, 148, 0.9); 
}

.filter-btn:hover:nth-child(2) {
  background: rgba(156, 173, 255, 0.5);
}

.filter-btn:nth-child(3) { 
  color: rgba(19, 74, 26, 0.9);
}

.filter-btn:hover:nth-child(3) {
  background: rgba(192, 255, 156, 0.5);
}

.search-container {
  margin-left: auto;
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

.table-scroll-container {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
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
  border-bottom: 1px solid #eee;
}

.data-table tr:hover {
  background-color: rgba(59, 154, 169, 0.05);
}

.id-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background-color: rgba(59, 154, 169, 0.1);
  color: var(--primary);
  font-weight: 500;
}

.role-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.role-badge.mentor {
  background-color: #3B9AA9;
}

.role-badge.learner {
  background-color: #4CAF50;
}

.details-btn {
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

.details-btn:hover {
  background-color: rgba(59, 154, 169, 0.2);
}

.no-users {
  text-align: center;
  padding: 1rem;
  color: var(--text-dark);
}

/* Modal Styles */
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

.user-modal {
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

.modal-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #0B3E8A, #3B9AA9);
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

.modal-body {
  padding: 1.5rem;
}

.user-profile {
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

.role-badge-large {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transform: translateY(25%);
}

.role-badge-large.mentor {
  background-color: #3B9AA9;
}

.role-badge-large.learner {
  background-color: #4CAF50;
}

.profile-info {
  flex-grow: 1;
}

.user-name {
  margin: 0.6rem 0 1.5rem 0;
  font-size: 1.6rem;
  color: #0b2548;
  font-weight: 700;
  text-align: left;
}

.divider {
  border: none;
  border-top: 4px solid #8a8a8f;
  margin-bottom: 1rem;
  margin-top: -1rem;
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

.details-card, .bio-card {
  background: #f9fafb;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.section-title {
  margin: 0 0 1.25rem 0;
  font-size: 1.1rem;
  color: #0B3E8A;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.section-title i {
  font-size: 1rem;
}

.divider2 {
  border: none;
  border-top: 1px solid #8a8a8f;
  margin-bottom: 1.5rem;
  margin-top: -0.5rem;
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

.detail-item2 {
  margin-bottom: 1.5rem;
}

.detail-value2 {
  display: block;
  margin-top: 0.5rem;
  line-height: 1.5;
}

/* Credentials Section */
.credentials-section {
  margin-top: 1.5rem;
  grid-column: span 2;
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
  color: #0B3E8A;
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
  justify-content: space-between;
  align-items: center;
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

.mentor-actions {
  display: flex;
  gap: 0.75rem;
  margin-right: auto;
}

.footer-btn.back {
  background-color: transparent;
  color: #6b7280;
}

.footer-btn.back:hover {
  background-color: #e5e7eb;
}

.footer-btn.warning {
  background-color: rgba(255, 193, 7, 0.1);
  color: #FFA000;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.footer-btn.warning:hover {
  background-color: rgba(255, 193, 7, 0.2);
}

.footer-btn.suspend {
  background-color: rgba(244, 67, 54, 0.1);
  color: #D32F2F;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.footer-btn.suspend:hover {
  background-color: rgba(244, 67, 54, 0.2);
}

.export-btn {
  padding: 0.5rem 1rem;
  background-color: #203d4d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
  transition: background-color 0.3s;
}

.export-btn:hover {
  background-color: #366177;
}

.search-container {
  display: flex;
  align-items: center;
}

.footer-btn.export {
  background-color: #e53935;
  color: white;
  border: none;
}

.footer-btn.export:hover {
  background-color: #c62828;
}

/* Action Modal */
.action-modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.action-modal .modal-header {
  padding: 1.25rem;
  background: linear-gradient(135deg, #0B3E8A, #3B9AA9);
  color: white;
  text-align: center;
}

.action-modal .modal-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.action-modal .modal-body {
  padding: 1.5rem;
}

.action-modal .modal-body p {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-group select {
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}

.modal-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.modal-btn.cancel {
  background-color: #f5f5f5;
  color: #555;
}

.modal-btn.cancel:hover {
  background-color: #eee;
}

.modal-btn.confirm {
  background-color: var(--primary);
  color: white;
}

.modal-btn.confirm:hover {
  background-color: var(--primary-dark);
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
  
  .user-profile {
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
  
  .credentials-section {
    grid-column: span 1;
  }
  
  .info-value {
    margin-left: 0;
    text-align: left;
  }

  .mentor-actions {
    flex-direction: column;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .footer-btn.warning,
  .footer-btn.suspend {
    width: 100%;
    justify-content: center;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
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
  
  .modal-body {
    padding: 1rem;
  }
  
  .user-profile {
    gap: 1.5rem;
  }
  
  .profile-image {
    width: 100px;
    height: 100px;
  }
  
  .details-card, .bio-card {
    padding: 1rem;
  }
  
  .credential-card {
    flex-direction: column;
    text-align: center;
  }
  
  .file-actions {
    justify-content: center;
  }
}
</style>