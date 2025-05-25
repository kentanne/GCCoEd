<template>
  <div class="table-container">
    <div class="table-header">
      <h2 class="table-title">
        <i class="fas fa-folder-open header-icon"></i>
        Uploaded Files
      </h2>

      <div class="search-container">
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search files..."
            class="search-input"
            @input="handleSearch"
          />
        </div>
      </div>
    </div>

    <div class="table-scroll-container">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sortFiles('file_name')" class="sortable-header">
              FILE NAME
              <span
                v-if="sortKey === 'file_name'"
                :class="{
                  'sort-arrow': true,
                  'sort-arrow-desc': sortOrder === 'desc',
                }"
              >
                ▲
              </span>
            </th>
            <th @click="sortFiles('created_at')" class="sortable-header">
              DATE
              <span
                v-if="sortKey === 'created_at'"
                :class="{
                  'sort-arrow': true,
                  'sort-arrow-desc': sortOrder === 'desc',
                }"
              >
                ▲
              </span>
            </th>
            <th>
              <div class="th-content">
                <span>FILE TYPE</span>
                <i
                  class="fas fa-filter filter-icon"
                  @click.stop="toggleTypeFilter"
                ></i>
                <div v-if="showTypeFilter" class="type-filter-dropdown">
                  <select
                    v-model="selectedFileType"
                    @change="handleFileTypeFilter"
                    @click.stop
                    class="header-filter"
                  >
                    <option
                      v-for="type in uniqueFileTypes"
                      :key="type"
                      :value="type"
                    >
                      {{
                        type === "all"
                          ? "All Types"
                          : type.charAt(0).toUpperCase() + type.slice(1)
                      }}
                    </option>
                  </select>
                </div>
              </div>
            </th>
            <th @click="sortFiles('file_size')" class="sortable-header">
              FILE SIZE
              <span
                v-if="sortKey === 'file_size'"
                :class="{
                  'sort-arrow': true,
                  'sort-arrow-desc': sortOrder === 'desc',
                }"
              >
                ▲
              </span>
            </th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in filteredFiles" :key="file.id">
            <td>{{ file.file_name }}</td>
            <td>{{ formatDate(file.created_at) }}</td>
            <td>
              <span class="file-type-badge">{{ file.File_type }}</span>
            </td>
            <td>{{ file.file_size }} KB</td>
            <td>
              <button
                @click="openFileActions(file, $event)"
                class="details-btn"
              >
                <i class="fas fa-ellipsis-v"></i> <span>Actions</span>
              </button>
            </td>
          </tr>
          <tr v-if="filteredFiles.length === 0">
            <td colspan="5" class="no-files">No files found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="fade" mode="out-in">
      <div
        v-if="showFileActions"
        class="modal-overlay"
        @click.self="closeFileActions"
      >
        <div class="file-modal">
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fas fa-file-alt"></i> File Actions
            </h3>
            <button class="close-btn" @click="closeFileActions">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="file-info">
              <div class="file-icon">
                <i :class="getFileIcon(selectedFile.File_type)"></i>
              </div>
              <div class="file-details">
                <h4>{{ selectedFile.file_name }}</h4>
                <p>
                  {{ selectedFile.File_type }} • {{ selectedFile.file_size }} KB
                  • {{ formatDate(selectedFile.created_at) }}
                </p>
              </div>
            </div>

            <div class="action-buttons">
              <button @click="viewFile(selectedFile)" class="action-btn view">
                <i class="fas fa-eye"></i> View
              </button>
              <button
                @click="downloadFile(selectedFile)"
                class="action-btn download"
              >
                <i class="fas fa-download"></i> Download
              </button>
              <button
                @click="deleteFile(selectedFile)"
                class="action-btn delete"
              >
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/api/api.js";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faSearch);

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

const props = defineProps({
  files: {
    type: Array,
    default: () => [],
  },
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const files = ref([]);
const isFile = ref(false);
const showFileActions = ref(false);
const selectedFile = ref(null);
const popupPosition = ref({ top: 0, left: 0 });

// Sorting and filtering
const sortKey = ref("");
const sortOrder = ref("asc");
const selectedFileType = ref("all");
const searchQuery = ref("");
const uniqueFileTypes = ref([]);
const showTypeFilter = ref(false);

const filteredFiles = computed(() => {
  let result = [...files.value];

  // Apply type filter
  if (selectedFileType.value !== "all") {
    result = result.filter((file) => file.File_type === selectedFileType.value);
  }

  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (file) =>
        file.file_name.toLowerCase().includes(query) ||
        file.File_type.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  if (sortKey.value) {
    result.sort((a, b) => {
      let compareA =
        sortKey.value === "file_size"
          ? Number(a[sortKey.value])
          : a[sortKey.value];
      let compareB =
        sortKey.value === "file_size"
          ? Number(b[sortKey.value])
          : b[sortKey.value];

      if (sortKey.value === "created_at") {
        compareA = new Date(a[sortKey.value]);
        compareB = new Date(b[sortKey.value]);
      }

      if (compareA < compareB) return sortOrder.value === "asc" ? -1 : 1;
      if (compareA > compareB) return sortOrder.value === "asc" ? 1 : -1;
      return 0;
    });
  }

  return result;
});

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const openFileActions = (file, event) => {
  selectedFile.value = file;
  showFileActions.value = true;
  const buttonRect = event.target.getBoundingClientRect();
  popupPosition.value = {
    top: buttonRect.bottom + window.scrollY + 5,
    left: buttonRect.left + window.scrollX,
  };
};

const closeFileActions = () => {
  showFileActions.value = false;
  selectedFile.value = null;
};

const viewFile = (file) => {
  console.log("Viewing file:", file);
  api
    .get("/api/preview/file/" + file.id, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    })
    .then((response) => {
      console.log("File URL:", response.data.url);
      window.open(response.data.webViewLink, "_blank");
    })
    .catch((error) => {
      console.error("Error fetching file URL:", error);
    });
  closeFileActions();
};

const downloadFile = (file) => {
  console.log("Downloading file:", file.id);
  api
    .get("/api/download/file/" + file.id, {
      responseType: "blob",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    })
    .then((response) => {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      console.log("File downloaded successfully.");
    })
    .catch((error) => {
      console.error("Error downloading file:", error);
    });
  closeFileActions();
};

const deleteFile = (file) => {
  console.log("Deleting file:", file.id);
  api
    .delete("/api/mentor/file/delete/" + file.id, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    })
    .then((response) => {
      console.log("File deleted successfully:", response.data);
      files.value = files.value.filter((f) => f.id !== file.id);
    })
    .catch((error) => {
      console.error("Error deleting file:", error);
    });
  closeFileActions();
};

const sortFiles = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const handleSearch = () => {
  // The computed filteredFiles will automatically update
};

const handleFileTypeFilter = () => {
  showTypeFilter.value = false;
  // The computed filteredFiles will automatically update
};

const toggleTypeFilter = (event) => {
  event.stopPropagation();
  showTypeFilter.value = !showTypeFilter.value;
};

const getFileIcon = (fileType) => {
  const type = fileType.toLowerCase();
  if (type.includes("pdf")) return "fas fa-file-pdf";
  if (type.includes("word")) return "fas fa-file-word";
  if (type.includes("excel")) return "fas fa-file-excel";
  if (type.includes("image")) return "fas fa-file-image";
  if (type.includes("video")) return "fas fa-file-video";
  return "fas fa-file";
};

onMounted(() => {
  files.value = props.files;
  uniqueFileTypes.value = [
    "all",
    ...new Set(files.value.map((file) => file.File_type)),
  ];
  console.log(files.value);

  document.addEventListener("click", (event) => {
    if (showTypeFilter.value) {
      showTypeFilter.value = false;
    }
  });
});
</script>

<style scoped>
/* Base Styles */
:root {
  --primary: #3b9aa9;
  --primary-light: #6dd1e3;
  --primary-dark: #0b3e8a;
  --secondary: #ffc107;
  --danger: #f44336;
  --success: #4caf50;
  --warning: #ffa000;
  --text-dark: #0b2548;
  --text-light: #f5f7fa;
  --bg-light: #ffffff;
  --border: #e1e4e8;
}

.table-container {
  background: var(--bg-light);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(26, 79, 159, 0.5);
  width: 90%;
  margin-top: 2rem;
  margin-left: 2.5rem;
  padding: 0 1rem;
  text-align: center;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  height: 37.4rem;
  max-height: 37.4rem;
  overflow-y: scroll;
}

.table-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  gap: 1rem;
  flex-wrap: wrap;
  color: #0b2548;
  position: sticky;
  top: 0;
  z-index: 20;
}

.table-title {
  margin: 0;
  font-size: 1.6rem;
  color: var(--text-light);
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.header-icon {
  font-size: 1.4rem;
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

.sortable-header {
  cursor: pointer;
  transition: background-color 0.2s;
}

.sortable-header:hover {
  background-color: rgba(59, 154, 169, 0.1);
}

.sort-arrow {
  display: inline-block;
  margin-left: 5px;
  transition: transform 0.2s ease;
  font-size: 0.8em;
}

.sort-arrow-desc {
  transform: rotate(180deg);
}

.data-table td {
  padding: 0.8rem;
  vertical-align: middle;
  border-bottom: 1px solid #eee;
}

.data-table tr:hover {
  background-color: rgba(59, 154, 169, 0.05);
}

.file-type-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: rgba(59, 154, 169, 0.1);
  color: var(--primary-dark);
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

.no-files {
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

.file-modal {
  background: white;
  border-radius: 12px;
  width: 350px;
  max-width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-dark), var(--primary));
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  width: 32px;
  height: 32px;
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

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.file-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: rgba(59, 154, 169, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--primary);
}

.file-details h4 {
  margin: 0 0 0.25rem 0;
  color: var(--text-dark);
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.file-details p {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.action-btn.view {
  background-color: rgba(59, 154, 169, 0.1);
  color: var(--primary-dark);
}

.action-btn.view:hover {
  background-color: rgba(59, 154, 169, 0.2);
}

.action-btn.download {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
}

.action-btn.download:hover {
  background-color: rgba(76, 175, 80, 0.2);
}

.action-btn.delete {
  background-color: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
}

.action-btn.delete:hover {
  background-color: rgba(244, 67, 54, 0.2);
}

/* Type Filter Dropdown */
.th-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
}

.filter-icon {
  cursor: pointer;
  color: var(--primary);
  font-size: 0.9em;
  transition: transform 0.2s ease;
}

.filter-icon:hover {
  transform: scale(1.1);
}

.type-filter-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 0.5rem;
  min-width: 120px;
}

.header-filter {
  width: 100%;
  background: white;
  border: 1px solid var(--border);
  color: var(--text-dark);
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.header-filter:hover {
  background-color: rgba(59, 154, 169, 0.1);
  border-color: var(--primary);
}

.header-filter:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 154, 169, 0.2);
}

/* Transition Effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

  .type-filter-dropdown {
    left: 0;
    transform: none;
    right: auto;
  }
}

@media (max-width: 480px) {
  .data-table {
    display: block;
    overflow-x: auto;
  }

  .details-btn span {
    display: none;
  }
}
</style>
