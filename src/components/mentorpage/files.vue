<script setup>
import { ref, onMounted } from "vue";
import { useDropZone } from "@vueuse/core";
import axios from "axios";
import api from "@/axios.js"; // Adjust the path as necessary
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

// axios.defaults.withCredentials = true;
// axios.defaults.withXSRFToken = true;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const uploadFiles = async () => {
  try {
    const formData = new FormData();
    files.value.forEach((file) => {
      formData.append("files[]", file);
    });
    const response = await api
      .post("/api/mentor/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        createToast("File uploaded successfully!", {
          position: "bottom-right",
          type: "success",
          transition: "slide",
          timeout: 2000,
          showIcon: true,
          toastBackgroundColor: "#319cb0",
        });
        files.value = []; // Clear the files after upload
      });
  } catch (error) {}
};

const fileInput = ref(null);
const files = ref([]);
const dropZoneRef = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const removeFile = (index) => {
  files.value = files.value.filter((_, i) => i !== index);
};

const getFileIcon = (fileType, fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();

  // Image files
  if (
    fileType.includes("image") ||
    ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension)
  ) {
    return "https://cdn-icons-png.flaticon.com/512/1829/1829548.png";
  }
  // PDF files
  else if (fileType.includes("pdf") || extension === "pdf") {
    return "https://cdn-icons-png.flaticon.com/512/2921/2921222.png";
  }
  // Word documents
  else if (
    fileType.includes("word") ||
    fileType.includes("document") ||
    ["doc", "docx"].includes(extension)
  ) {
    return "https://cdn-icons-png.flaticon.com/512/281/281760.png";
  }
  // Excel files
  else if (
    fileType.includes("spreadsheet") ||
    fileType.includes("excel") ||
    ["xls", "xlsx", "csv"].includes(extension)
  ) {
    return "https://cdn-icons-png.flaticon.com/512/281/281778.png";
  }
  // PowerPoint files
  else if (
    fileType.includes("presentation") ||
    fileType.includes("powerpoint") ||
    fileType.includes("ppt") ||
    ["ppt", "pptx"].includes(extension)
  ) {
    return "https://cdn-icons-png.flaticon.com/512/888/888879.png";
  }
  // Video files
  else if (
    fileType.includes("video") ||
    ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm"].includes(extension)
  ) {
    return "https://cdn-icons-png.flaticon.com/512/2965/2965300.png";
  }
  // Zip/compressed files
  else if (
    fileType.includes("zip") ||
    fileType.includes("compressed") ||
    ["zip", "7z", "rar", "tar", "gz"].includes(extension)
  ) {
    return "https://cdn-icons-png.flaticon.com/512/888/888879.png";
  }
  // Text files
  else if (
    fileType.includes("text") ||
    ["txt", "md", "log", "ini", "conf"].includes(extension)
  ) {
    return "https://cdn-icons-png.flaticon.com/512/1250/1250615.png";
  }
  // Code files
  else if (
    [
      "js",
      "ts",
      "py",
      "java",
      "cs",
      "cpp",
      "c",
      "h",
      "php",
      "html",
      "css",
      "scss",
      "json",
      "xml",
      "yaml",
      "yml",
    ].includes(extension)
  ) {
    return "https://cdn-icons-png.flaticon.com/512/2881/2881142.png";
  }
  // Default icon
  else {
    return "https://cdn-icons-png.flaticon.com/512/25/25657.png";
  }
};

const onFileInputChange = (event) => {
  const selectedFiles = Array.from(event.target.files);
  if (selectedFiles.length > 0) {
    handleFiles(selectedFiles);
  }
  event.target.value = "";
};

const handleFiles = (newFiles) => {
  if (!newFiles || newFiles.length === 0) return;

  // Prevent duplicate files
  const existingFileNames = files.value.map((file) => file.name);
  const uniqueFiles = newFiles.filter(
    (file) => !existingFileNames.includes(file.name)
  );

  files.value = [...files.value, ...uniqueFiles];
};

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: (droppedFiles) => {
    if (droppedFiles) {
      handleFiles(Array.from(droppedFiles));
    }
  },
});

onMounted(() => {
  // files.value = props.files;
});
</script>

<template>
  <div class="files-wrapper">
    <!-- Header Section -->
    <div class="table-header">
      <h2 class="table-title">
        <i class="fas fa-folder-open header-icon"></i>
        Files and Documents
      </h2>
    </div>

    <!-- Main Content Section -->
    <div class="lower-element">
      <div class="lower-grid">
        <!-- File Upload Section -->
        <div class="upload-file">
          <div
            ref="dropZoneRef"
            class="drop-zone"
            :class="{ 'drop-zone-active': isOverDropZone }"
            @click="triggerFileInput"
            @dragover.prevent
            @dragenter.prevent
          >
            <font-awesome-icon
              icon="fa-file-arrow-up"
              size="8x"
              :style="{
                color: isOverDropZone ? '#066678' : '#a6a6a6',
                opacity: isOverDropZone ? '0.3' : '0.1',
              }"
            />
            <p>
              {{
                isOverDropZone
                  ? "Drop Files Here"
                  : "Click or Drag Files to Upload"
              }}
            </p>
          </div>

          <div class="browse-file">
            <input
              type="file"
              ref="fileInput"
              class="file-upload"
              @change="onFileInputChange"
              multiple
              accept="*"
              style="display: none"
            />
          </div>

          <button @click="triggerFileInput" class="custom-file-upload">
            <i class="fas fa-folder-open"></i> Browse Files
          </button>
        </div>

        <!-- Uploaded Files Display Section -->
        <div class="displayed-files">
          <div class="files-header">
            <h3><i class="fas fa-file-alt"></i> Uploaded Files</h3>
            <div class="file-count">{{ files.length }} files</div>
          </div>

          <div class="displayed-container">
            <template v-if="files.length > 0">
              <div
                v-for="(file, index) in files"
                :key="index"
                class="file-item"
              >
                <div class="file-content">
                  <img :src="getFileIcon(file.type, file.name)" alt="file" />
                  <div class="file-info">
                    <p class="file-name" :title="file.name">{{ file.name }}</p>
                    <span class="file-type">{{
                      file.type || getFileExtension(file.name)
                    }}</span>
                  </div>
                </div>
                <div class="file-actions">
                  <button @click="removeFile(index)" class="delete-btn">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </template>
            <div v-else class="no-files">
              <p>No files uploaded yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Button -->
    <div class="upload-button">
      <button @click="uploadFiles" class="upload-btn">
        <i class="fas fa-upload"></i> Upload Files
      </button>
    </div>
  </div>
</template>

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

.files-wrapper {
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

/* Main Content Styles */
.lower-element {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: #fff;
  overflow: hidden;
  height: 542px;
  padding: 1rem;
}

.lower-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 50px;
  width: 100%;
  height: 100%;
}

/* Upload Section Styles */
.upload-file {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-right: 1px solid var(--border);
}

.drop-zone {
  border: 3px dashed #a6a6a6;
  width: 90%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border-radius: 12px;
  background-color: rgba(59, 154, 169, 0.05);
}

.drop-zone > * {
  pointer-events: none;
}

.file-upload {
  pointer-events: auto;
}

.drop-zone p {
  color: gray;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 30px;
  user-select: none;
}

.drop-zone-active {
  background-color: rgba(6, 102, 120, 0.1) !important;
  border: 3px dashed var(--primary) !important;
}

.drop-zone:hover {
  background-color: rgba(6, 102, 120, 0.05);
  border-color: var(--primary) !important;
}

.custom-file-upload {
  background-color: rgb(40, 70, 86);
  color: white;
  width: 91%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
  border: none;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 1rem;
  gap: 0.5rem;
}

.custom-file-upload:hover {
  background-color: rgb(54, 87, 105);
}

/* Files Display Section Styles */
.displayed-files {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 15px;
  width: 100%;
  height: 100%;
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 5px solid rgb(26, 71, 112);
  padding-bottom: 1rem;
}

.files-header h3 {
  color: rgb(40, 70, 86);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.file-count {
  background-color: rgba(59, 154, 169, 0.1);
  color: var(--primary-dark);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.displayed-container {
  height: 100%;
  overflow-y: auto;
  padding-right: 5px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  min-height: 60px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  border-left: 4px solid var(--primary);
}

.file-item:hover {
  background-color: rgba(59, 154, 169, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.file-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.file-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.file-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  font-weight: 500;
  color: var(--text-dark);
  margin: 0;
  text-align: left;
}

.file-type {
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  font-size: 1rem;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s;
}

.delete-btn:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

.no-files {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #a6a6a6;
  font-size: 1rem;
}

.displayed-files img {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.displayed-container::-webkit-scrollbar {
  width: 6px;
}

.displayed-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.displayed-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.displayed-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Upload Button Styles */
.upload-button {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  background-color: #f5f7fa;
  border-top: 1px solid var(--border);
}

.upload-btn {
  background-color: rgb(209, 207, 207);
  color: rgb(40, 70, 86);
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upload-btn:hover {
  background-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 154, 169, 0.5);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .lower-grid {
    grid-template-columns: 1fr;
    grid-gap: 20px;
  }

  .upload-file {
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding-bottom: 2rem;
  }

  .lower-element {
    height: auto;
  }
}

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
}

@media (max-width: 480px) {
  .files-wrapper {
    width: 95%;
  }

  .file-name {
    max-width: 180px;
  }
}
.mosha__toast .mosha__toast__content {
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
}

.mosha__toast .mosha__toast__content .mosha__toast__content__text {
  padding: 0.5rem;
}

@media (max-width: 1200px) {
  .files-wrapper {
    width: 95%;
    margin-left: 1rem;
  }
}

@media (max-width: 1024px) {
  .lower-grid {
    grid-template-columns: 1fr;
    grid-gap: 20px;
  }

  .upload-file {
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding-bottom: 2rem;
    height: 300px;
  }

  .lower-element {
    height: auto;
    padding: 1rem 0.5rem;
  }

  .displayed-files {
    padding: 0 5px;
  }
}

@media (max-width: 768px) {
  .files-wrapper {
    width: 100%;
    margin-left: 0;
    height: auto;
    max-height: none;
  }

  .table-header {
    padding: 1rem;
  }

  .drop-zone {
    height: 250px;
  }

  .file-item {
    padding: 10px;
  }

  .file-name {
    max-width: 200px;
  }
}

@media (max-width: 576px) {
  .table-title {
    font-size: 1.3rem;
  }

  .drop-zone {
    height: 200px;
  }

  .drop-zone p {
    font-size: 0.9rem;
  }

  .custom-file-upload {
    height: 45px;
    font-size: 0.9rem;
  }

  .file-name {
    max-width: 150px;
    font-size: 0.9rem;
  }

  .upload-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 400px) {
  .table-title {
    font-size: 1.05rem;
  }

  .header-icon {
    font-size: 1.1rem;
  }

  .file-name {
    max-width: 120px;
  }

  .file-content img {
    width: 28px;
    height: 28px;
  }

  .file-type {
    font-size: 0.7rem;
  }
}
</style>
