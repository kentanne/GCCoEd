<script setup>
import { ref } from "vue";
import { useDropZone } from "@vueuse/core";

const emit = defineEmits(["close"]);

const fileInput = ref(null);
const files = ref([]);
const dropZoneRef = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const onFileInputChange = (event) => {
  const selectedFiles = Array.from(event.target.files);
  handleFiles(selectedFiles);
  event.target.value = "";
};

const handleFiles = (newFiles) => {
  if (!newFiles || newFiles.length === 0) return;

  if (files.value.length + newFiles.length > 5) {
    alert("You can only upload a maximum of 5 files.");
    return;
  }

  files.value = [...files.value, ...newFiles];
  console.log("Files received:", newFiles);
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: handleFiles,
  multiple: true,
});
</script>

<template>
  <div class="message-popup-right">
    <div class="wrapper">
      <div class="upper-element">
        <h1>Leave us a Message</h1>
        <font-awesome-icon
          icon="fa-xmark"
          size="2x"
          color="white"
          style="cursor: pointer"
          @click="$emit('close')"
        />
      </div>
      <div class="lower-element">
        <div class="name">
          <label>Your name (Optional)</label>
          <input type="text" />
        </div>
        <div class="email-address">
          <label>Email Address</label>
          <input type="email" />
        </div>
        <div class="help-section">
          <label>How can we help you?</label>
          <textarea></textarea>
        </div>
        <div class="files">
          <label>Attachment</label>
          <div
            ref="dropZoneRef"
            @click="triggerFileInput"
            class="custom-file-upload"
            :class="{ 'drop-active': isOverDropZone }"
          >
            <div class="drag-drop-area">
              <font-awesome-icon
                icon="fa-link"
                size="1x"
                :style="{
                  color: isOverDropZone ? '#066678' : '#a6a6a6',
                  opacity: isOverDropZone ? '0.3' : '0.8',
                }"
              />
              <p>{{ isOverDropZone ? 'Drop Files Here' : 'Add up to 5 files' }}</p>
            </div>
            <input
              type="file"
              ref="fileInput"
              @change="onFileInputChange"
              style="display: none"
              multiple
            />
          </div>
          <div class="file-list">
            <span v-for="(file, index) in files" :key="index" class="file-item">
              <span class="file-name">{{ file.name }}</span>
              <button @click="removeFile(index)" class="remove-button">x</button>
            </span>
          </div>
        </div>
        <div class="footer">
          <p>GCCoEd</p>
          <button>Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-popup-right {
  position: fixed;
  top: 60%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1000;
}

.wrapper {
  display: flex;
  flex-direction: column;
  width: 300px;
  max-height: 600px;
  overflow: hidden;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.upper-element {
  background-color: #309cb0;
  padding: 13px;
  display: flex;
  justify-content: space-between;
  border-radius: 20px 20px 0 0;
  align-items: center;
  height: 25px;
}

.upper-element h1 {
  color: white;
  font-size: 1.20rem;
  font-weight: 600;
  text-align: center;
}

.lower-element {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #fff;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  padding: 15px;
}

.name,
.email-address,
.help-section,
.files {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
}

label {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #0c434d;
}

textarea {
  resize: none;
  height: 80px;
  border: 1px solid #ccc;
  padding: 5px;
}

input {
  height: 25px;
  border: 1px solid #ccc;
  padding: 5px;
}

.footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-top: 10px;
}

.footer p {
  color: #0c434d;
  font-weight: 600;
}

button {
  background-color: #066678;
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.custom-file-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  border: 2px dashed #066678;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: rgba(6, 102, 120, 0.05);
}

.drop-active {
  background-color: rgba(6, 102, 120, 0.1);
  border-color: #309cb0;
  transform: scale(1.01);
}

.drag-drop-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 5px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 3px 0;
}

.file-name {
  color: #066678;
  font-style: italic;
  text-decoration: underline;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

.remove-button {
  font-size: 0.7rem;
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  padding: 0 5px;
}
</style>