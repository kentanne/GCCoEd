<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const props = defineProps({
	files: {
		type: Array,
		default: () => [],
	},
});

function getCookie(name){
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const files = ref([]);

const isFile = ref(false);

const showFileActions = ref(false);
const selectedFile = ref(null);
const popupPosition = ref({ top: 0, left: 0 });

const openFileActions = (file, event) => {
  selectedFile.value = file;
  showFileActions.value = true;

  // Get the position of the button
  const buttonRect = event.target.getBoundingClientRect();
  popupPosition.value = {
    top: buttonRect.bottom + window.scrollY + 5, // Position below the button
    left: buttonRect.left + window.scrollX, // Align with the button's left edge
  };
};

const closeFileActions = () => {
  showFileActions.value = false;
  selectedFile.value = null;
};

const viewFile = (file) => {
  console.log("Viewing file:", file);
  const response = axios.get("http://localhost:8000/api/preview/file/" + file.id, {
	withCredentials: true,
	headers: {
	  "Content-Type": "application/json",
	  'Accept': "application/json",
	  "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
	},
  }).then((response) => {
	  console.log("File URL:", response.data.url);
	  window.open(response.data.webViewLink, "_blank");
  }).catch((error) => {
	  console.error("Error fetching file URL:", error);
  });
};

const downloadFile = (file) => {
  console.log("Downloading file:", file.id);

  axios.get("http://localhost:8000/api/download/file/" + file.id, {
      responseType: "blob", // Ensure the response is treated as a binary blob
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
      },
    })
    .then((response) => {
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: response.headers["content-type"] });

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); // Create a URL for the blob
      link.download = file.file_name; // Set the file name for the download
      document.body.appendChild(link); // Append the link to the document
      link.click(); // Trigger the download
      document.body.removeChild(link); // Remove the link after triggering the download
      URL.revokeObjectURL(link.href); // Revoke the blob URL to free memory

      console.log("File downloaded successfully.");
    })
    .catch((error) => {
      console.error("Error downloading file:", error);
    });
};

const deleteFile = (file) => {
  console.log("Deleting file:", file.id);
  const response = axios.delete("http://localhost:8000/api/mentor/file/delete/" + file.id, {
	withCredentials: true,
	headers: {
	  "Content-Type": "application/json",
	  'Accept': "application/json",
	  "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
	},
  }).then((response) => {
	console.log("File deleted successfully:", response.data);
	files.value = files.value.filter((f) => f.id !== file.id);
	// Optionally, refresh the file list or remove the file from the UI
  }).catch((error) => {
	console.error("Error deleting file:", error);
  });
  closeFileActions();
};7

onMounted(() => {
	files.value = props.files;
	console.log(files.value);
});

</script>

<template>
	<div class="files-wrapper">
		<div class="top-element">
			<font-awesome-icon icon="fa-book" size="3x" color="#fff" />
			<h1>Uploaded Files</h1>
		</div>
		
		<div class="lower-element">
			<table>
				<thead>
					<tr>
						<th>FILE NAME</th>
                        <th>DATE</th>
                        <th>FILE TYPE</th>
                        <th>FILE SIZE</th>
                        <th>ACTIONS</th>
					</tr>
				</thead>
				<tbody>
					<!-- Create a row for each file -->
					<tr
						v-for="file in files"
						:key="file.id"
					>
						<td>{{ file.file_name }}</td>
                        <td>{{ file.created_at.split('T')[0] }}</td>
                        <td>{{ file.File_type }}</td>
                        <td>{{ file.file_size }} KB</td>
                        <td>
                            <button @click="openFileActions(file, $event)">More Action</button>
                        </td>
					</tr>
				</tbody>
			</table>
		</div>

		<transition name="fade" mode="out-in">
			<div v-if="showFileActions" class="file-action-popup" :style="{ top: popupPosition.top + 'px', left: popupPosition.left + 'px' }">
				<div class="popup-content">
					<h2>File Actions</h2>
					<button @click="viewFile(selectedFile)">View</button>
					<button @click="downloadFile(selectedFile)">Download</button>
					<button @click="deleteFile(selectedFile)">Delete</button>
					<button @click="closeFileActions">Close</button>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.file-action-popup {
  position: absolute; /* Use absolute positioning */
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popup-content h2 {
  margin-bottom: 10px;
}

.popup-content button {
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.popup-content button:hover {
  background-color: #f0f0f0;
}

.action-btn {
  background-color: #066678;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.action-btn:hover {
  background-color: #0c434d;
}
.files-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
}

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
    font-size: 2rem;
    font-weight: 600;
}

.lower-element {
    display: flex;
    flex-direction: column; /* Ensure proper alignment */
    justify-content: flex-start; /* Align content to the top */
    align-items: stretch; /* Stretch content to fill the width */
    background-color: #fff;
    border-radius: 0 0 20px 20px;
    overflow: hidden;
    border: 3px solid #0c434d;
    padding: 0; /* Remove padding to make the table snap */
    height: auto; /* Adjust height dynamically based on content */
}

table {
    width: 100%; /* Make the table take up the full width */
    border-collapse: collapse; /* Remove gaps between table cells */
    color: #066678;
    margin: 0; /* Remove all margins */
}

thead {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: white;
}

th {
    padding: 10px;
    text-align: center;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
    background-color: #f5f5f5;
}

tbody {
    display: block;
    overflow-y: auto;
    max-height: 400px; /* Adjust height to fit within the container */
    width: 100%;
}

thead,
tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
}

td {
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.stars {
    display: flex;
    justify-content: center;
    align-items: center;
}

.star {
    font-size: 1.2rem;
    color: #ccc;
}

.filled {
    color: #ffd700;
}

td button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    color: #066678;
}

/* pop-up */

.feedback-pop-up {
	position: fixed;
	top: 50%;
	left: 55%;
	transform: translate(-50%, -50%);
	width: 375px;
	height: 450px;
	background-color: #006981;
	padding: 15px 20px 30px 20px;
	overflow: hidden;
	z-index: 1000;
	border-radius: 20px;
}

.feedback-upper,
.feedback-lower {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 10px;
	padding: 20px;
	position: relative;
}

.feedback-upper img {
	width: 110px;
	height: 110px;
	object-fit: cover;
	border-radius: 50%;
}

.feedback-upper h1 {
	color: #fff;
	font-size: 1.4rem;
	font-weight: 600;
}

.feedback-upper::after {
	content: "";
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 90%;
	height: 3px;
	background-color: #a6a6a6;
}

.feedback-upper h2 {
	color: #fff;
	font-size: 1.2rem;
	font-weight: 400;
}

.feedback-lower {
	display: flex;
	flex-direction: column;
	flex: 1;
}

.feedback-lower h1 {
	color: #fff;
	font-size: 1.1rem;
	font-weight: 400;
}

.feedback-content {
	padding: 10px 20px;
	background-color: #fff;
	border-radius: 10px;
	width: 100%;
	height: 160px;
	max-height: 160px;
	overflow-y: auto;
	word-wrap: break-word;
}

.feedback-content p {
	color: #066678;
	font-size: 0.9rem;
	font-weight: 400;
	text-align: justify;
}

.feedback-content::-webkit-scrollbar {
	width: 8px;
}

.exit-feedback {
	position: fixed;
	top: 20px;
	right: 20px;
}
</style>
