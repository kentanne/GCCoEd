<template>
	<div class="files-wrapper">
	  <!-- Header Section -->
	  <div class="top-element">
		<font-awesome-icon icon="fa-file-lines" size="3x" style="color: #fff" />
		<h1>FILES AND DOCUMENTS</h1>
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
				size="10x"
				:style="{
				  color: isOverDropZone ? '#066678' : '#a6a6a6',
				  opacity: isOverDropZone ? '0.3' : '0.1',
				}"
			  />
			  <p>
				{{ isOverDropZone ? "Drop Files Here" : "Click or Drag Files to Upload" }}
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
			
			<div @click="triggerFileInput" class="custom-file-upload">
			  <h1>Browse Files</h1>
			</div>
		  </div>
		  
		  <!-- Uploaded Files Display Section -->
		  <div class="displayed-files">
			<h1>Uploaded Files</h1>
			<div class="displayed-container">
			  <template v-if="files.length > 0">
				<div
				  v-for="(file, index) in files"
				  :key="index"
				  class="files"
				>
				  <div class="file-content">
					<img :src="getFileIcon(file.type, file.name)" alt="file" />
					<p class="file-name" :title="file.name">{{ file.name }}</p>
				  </div>
				  <div>
					<font-awesome-icon
					  icon="fa-xmark"
					  size="2x"
					  style="color: #066678; cursor: pointer"
					  @click="removeFile(index)"
					/>
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
		<button @click="uploadFiles" class="upload-btn">Upload Files</button>
	  </div>
	</div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useDropZone } from "@vueuse/core";
  import axios from "axios";

  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  function getCookie(name){
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
}

  const uploadFiles = async () => {
    try {
      const formData = new FormData();
      files.value.forEach((file) => {
        formData.append("files[]", file);
      });
      const response = await axios.post(
        "http://localhost:8000/api/mentor/file/upload",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
          },
        })
		.then((response) => {
			console.log("File upload response:", response.data);
			files.value = []; // Clear the files after upload
		});
    } catch (error) {
      console.error("Error uploading files:", error);
    }
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
      ["js", "ts", "py", "java", "cs", "cpp", "c", "h", "php", "html", "css", "scss", "json", "xml", "yaml", "yml"].includes(
        extension
      )
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
    console.log("Files received:", uniqueFiles);
  };

  const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop: (droppedFiles) => {
      if (droppedFiles) {
        handleFiles(Array.from(droppedFiles));
      }
    },
    onEnter: () => console.log("Files entered drop zone"),
    onLeave: () => console.log("Files left drop zone"),
  });

  onMounted(() => {
	// files.value = props.files;
	console.log(files);	
  });
  </script>
  
<style scoped>
  /* Layout Styles */
  .files-wrapper {
	display: flex;
	justify-content: center;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
  }
  
  .lower-element {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 10px;
	background-color: #fff;
	border-radius: 0 0 20px 20px;
	overflow: hidden;
	border: 3px solid #0c434d;
	height: 542px;
  }
  
  .lower-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 50px;
	width: 100%;
	height: 100%;
  }
  
  /* Header Styles */
  .top-element {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	gap: 17px;
	background-color: #0c434d;
	padding: 18px 30px;
	border-radius: 20px 20px 0 0;
  }
  
  .top-element h1 {
	color: #fff;
	font-size: 1.8rem;
	font-weight: 600;
  }
  
  /* Upload Section Styles */
  .upload-file {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 20px;
  }
  
  .drop-zone {
	border-right: 3px dashed #a6a6a6;
	border-top: 3px dashed #a6a6a6;
	border-left: 3px dashed #a6a6a6;
	width: 90%;
	height: 65%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	cursor: pointer;
	transition: all 0.2s ease;
	position: relative;
  }
  
  .drop-zone > * {
	pointer-events: none;
  }
  
  .file-upload {
	pointer-events: auto;
  }
  
  .drop-zone p {
	color: #a6a6a6;
	font-size: 1.5rem;
	font-weight: 400;
	margin-top: 30px;
	user-select: none;
  }
  
  .drop-zone-active {
	background-color: rgba(6, 102, 120, 0.1) !important;
	border: 3px dashed #066678 !important;
  }
  
  .drop-zone:hover {
	background-color: rgba(6, 102, 120, 0.05);
	border-color: #066678 !important;
  }
  
  .custom-file-upload {
	background-color: #0c434d;
	color: #fff;
	width: 91%;
	height: 20%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	user-select: none;
	transition: background-color 0.2s ease;
  }
  
  .custom-file-upload:hover {
	background-color: #066678;
  }
  
  /* Files Display Section Styles */
  .displayed-files {
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding-right: 15px;
	width: 100%;
  }
  
  .displayed-files h1 {
	color: #066678;
	font-size: 1.5rem;
	font-weight: 600;
	margin-bottom: 2px;
	margin-top: 15px;
  }
  
  .displayed-container {
	height: 450px;
	overflow-y: auto;
	padding-right: 1px;
  }
  
  .files {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #f5f5f5;
	padding: 8px 12px;
	border-radius: 5px;
	border-left: 4px solid #066678;
	min-height: 40px;
	width: 100%;
	box-sizing: border-box;
	font-size: 0.8rem;
	margin-bottom: 2px;
  }
  
  .file-content {
	display: flex;
	align-items: center;
	gap: 10px;
	flex: 1;
	min-width: 0;
  }
  
  .file-name {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 300px;
  }
  
  .no-files {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	color: #a6a6a6;
  }
  
  .displayed-files img {
	width: 20px;
	height: 20px;
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
  
  /* Add styles for the upload button */
  .upload-button {
	display: flex;
	justify-content: center;
	margin-top: 20px;
  }
  
  .upload-btn {
	background-color: #0c434d;
	color: #fff;
	padding: 10px 20px;
	font-size: 1rem;
	font-weight: bold;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.2s ease;
  }
  
  .upload-btn:hover {
	background-color: #066678;
  }
</style>