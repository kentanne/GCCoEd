<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import Information from "../../components/mentorpage/information.vue";
import logoutDialog from "@/components/mentorpage/logoutDialog.vue";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const loggedUserDets = async () => {
  try {
    await axios
      .get("http://localhost:8000/api/mentor/details", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("User details fetched successfully:", response.data);
        if (response.status === 200) {
          // Store data in unified userData ref
          userData.value = {
            user: response.data.user,
            ment: {
              ...response.data.ment,
              availability: JSON.parse(response.data.ment.availability),
              subjects: JSON.parse(response.data.ment.subjects),
              teach_sty: JSON.parse(response.data.ment.teach_sty),
              rating_ave: response.data.ment.rating_ave || 0, // Add this line
            },
          };
        } else {
          throw new Error("Failed to fetch user details");
        }
      });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

const learnersProfile = async () => {
  try {
    const response = await axios
      .get("http://localhost:8000/api/mentor/users", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("Learner profiles fetched successfully:", response.data);
        if (response.status === 200) {
          users.value = response.data;
          // // users.value.userName = response.data.name;
          // return response.data;
        } else {
          throw new Error("Failed to fetch learner profiles");
        }
      })
      .catch((error) => {
        console.error("Error fetching learner profiles:", error);
      });
  } catch (error) {
    console.error("Error fetching learner profiles:", error);
    return null;
  }
};

const sessionInfo = async () => {
  try {
    const sessionDeets = await axios
      .get(`http://localhost:8000/api/mentor/schedule`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("session details:", response.data);
        todaySchedule.value = response.data.schedules_today;
        upcommingSchedule.value = response.data.upcoming_schedules;
      });
  } catch (error) {
    console.error("Error fetching session details:", error);
    return null;
  }
};

const getFeedbacks = async () => {
  try {
    const response = await axios
      .get("http://localhost:8000/api/mentor/getFeedback", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("Feedbacks:", response.data);
        feedbacks.value = response.data.feedbacks;
      });
    // return response.data
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return null;
  }
};

const getFiles = async () => {
  try {
    const response = await axios
      .get("http://localhost:8000/api/mentor/files", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("Files:", response.data);
        files.value = response.data.files;
      });
    // return response.data
  } catch (error) {
    console.error("Error fetching files:", error);
    return null;
  }
};

// Replace multiple refs with a single userData ref
const userData = ref({
  user: {
    id: null,
    name: "",
    email: "",
    role: "",
  },
  ment: {
    address: "",
    proficiency: "",
    year: "",
    course: "",
    availability: [],
    prefSessDur: "",
    bio: "",
    subjects: [],
    image: "",
    phoneNum: "",
    teach_sty: [],
    credentials: [],
    exp: "",
    rating_ave: 0, // Add this default value
  },
});

// Keep other independent refs
const department = ref("College of Computer Studies");
const users = ref([]);
const todaySchedule = ref([]);
const upcommingSchedule = ref([]);
const feedbacks = ref([]);
const files = ref([]);
const isEdit = ref(false);
const confirmLogout = ref(false);
const showAllCourses = ref(false);
const searchQuery = ref("");

const activeComponent = ref("main");
const switchComponent = (component) => {
  if (activeComponent.value !== component) {
    activeComponent.value = component;
  }
};

const mainView = defineAsyncComponent(() =>
  import("../../components/mentorpage/main.vue")
);

const sessionView = defineAsyncComponent(() =>
  import("../../components/mentorpage/session.vue")
);

const recordsView = defineAsyncComponent(() =>
  import("../../components/mentorpage/records.vue")
);

const filesView = defineAsyncComponent(() =>
  import("../../components/mentorpage/files.vue")
);

const fileManageView = defineAsyncComponent(() =>
  import("../../components/mentorpage/fileManage.vue")
);

const openLogoutDialog = () => {
  confirmLogout.value = true;
};

const componentMap = {
  main: mainView,
  session: sessionView,
  records: recordsView,
  files: filesView,
  fileManage: fileManageView,
};

const displayedCourses = computed(() =>
  userData.value.ment.subjects.slice(0, 5)
);
const remainingCoursesCount = computed(() =>
  Math.max(userData.value.ment.subjects.length - 5, 0)
);
const remainingCourses = computed(() => userData.value.ment.subjects.slice(5));

const toggleShowAllCourses = () => {
  showAllCourses.value = !showAllCourses.value;
};

const openEditInformation = () => {
  isEdit.value = !isEdit.value;
};

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const searchLower = searchQuery.value.toLowerCase();
    return (
      searchQuery.value === "" ||
      user.userName.toLowerCase().includes(searchLower) ||
      user.yearLevel.toLowerCase().includes(searchLower) ||
      user.course.toLowerCase().includes(searchLower)
    );
  });
});

const handleLogout = () => {
  alert("User logged out");
  confirmLogout.value = false;
};

onMounted(async () => {
  console.log("test kung namamount");
  await loggedUserDets();
  await learnersProfile();
  await sessionInfo();
  await getFeedbacks();
  await getFiles();
  // users.value = learnersProfile();
});
</script>

<template>
  <div class="sidebar">
    <div class="upper-element">
      
      <div>
        <h1>Hi, Mentor!</h1>
        <img
          :src="
            'http://localhost:8000/api/image/' + userData.ment.image ||
            'http://placehold.co/600x400'
          "
          alt="profile-pic"
        />
      </div>
      <div>
        <h2>{{ userData.user.name }}</h2>
        <i
          ><p>{{ userData.ment.proficiency }}</p></i
        >
        <div class="stars">
          <span class="filledStar" v-for="i in 5" :key="i">
            <span v-if="i <= Math.round(userData?.ment?.rating_ave || 0)"
              >★</span
            >
            <span v-else>☆</span>
          </span>
        </div>
      </div>
    </div>
    <!-- <div class="wave-curve"></div> -->
    <div class="footer-element">
      <div class="user-information">
        <h1>User Information</h1>
        <div class="lines">
          <h3>Year Level:</h3>
          <div>
            <p>{{ userData.ment.year }}</p>
          </div>
        </div>
        <div class="lines">
          <h3>Department:</h3>
          <div>
            <p>{{ department }}</p>
          </div>
        </div>
        <div class="lines">
          <h3>Program:</h3>
          <div>
            <p>{{ userData.ment.course.match(/\(([^)]+)\)/)?.[1] || userData.ment.course }}</p>
          </div>
        </div>
      </div>
    <div class="availability">
      <h1>Availability</h1>
        <div class="lines">
           <h3>Days:</h3>
        <div>
      <p>{{ userData.ment.availability.join(', ') }}</p>
    </div>
  </div>
  <div class="lines">
          <h3>Duration:</h3>
          <div>
            <p>{{ userData.ment.prefSessDur }}</p>
          </div>
        </div>
      </div>
      <div class="course-offered">
        <h1>Course Offered</h1>
        <div class="course-grid">
          <div
            v-for="(card, index) in displayedCourses"
            :key="index"
            class="course-card"
          >
            <div class="lines">
              <div>
                <p :title="card">{{ card }}</p>
              </div>
            </div>
          </div>
          <div
            v-if="remainingCoursesCount > 0"
            class="course-card remaining-courses"
            @click="toggleShowAllCourses"
          >
            <div class="lines">
              <div>
                <p>+{{ remainingCoursesCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showAllCourses" class="all-courses-popup">
          <div class="popup-content">
            <div class="popup-courses">
              <div
                v-for="(course, index) in userData.ment.subjects"
                :key="index"
                class="popup-course"
              >
                {{ course }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="edit-information">
        <button @click="openEditInformation">
          {{ isEdit ? "Save" : "Edit" }}
        </button>
      </div>
    </div>
  </div>



  <!-- topbar -->
  <div class="topbar">
    <div class="topbar-left">
      <div @click="switchComponent('main')" class="topbar-options">
        <img src="/main.svg" alt="Main" />
        <p>Main</p>
      </div>
      <div @click="switchComponent('session')" class="topbar-options">
        <img src="/calendar.svg" alt="Session" />
        <p>Sessions</p>
      </div>
      <div @click="switchComponent('records')" class="topbar-options">
        <img src="/records.svg" alt="Records" />
        <p>Records</p>
      </div>
      <div @click="switchComponent('files')" class="topbar-options">
        <img src="/uploadCloud.svg" alt="Upload" />
        <p>Files</p>
      </div>
      <div @click="switchComponent('fileManage')" class="topbar-options">
        <img src="/files.svg" alt="Files" />
        <p>File Manager</p>
      </div>
      <div @click="openLogoutDialog" class="topbar-options">
        <img src="/logout.svg" alt="logout" />
        <p>Logout</p>
      </div>
    </div>
    <div class="topbar-right">
      <input
        maxlength="32"
        type="text"
        v-model="searchQuery"
        placeholder="Search"
      />
      <img src="/search.svg" alt="search" />
    </div>
  </div>

  <!-- main content -->
  <div class="main-content">
    <component
      :userInformation="filteredUsers"
      :is="componentMap[activeComponent] || mainView"
      :schedule="todaySchedule"
      :upcomingSchedule="upcommingSchedule"
      :feedbacks="feedbacks"
      :files="files"
    />
  </div>

  <Transition name="fade" mode="out-in">
    <div v-if="isEdit" class="edit-information-popup">
      <Information :userData="userData" @close="openEditInformation" />
    </div>
  </Transition>

  <Transition name="fade" mode="out-in">
    <div v-if="confirmLogout" class="logout-popup">
      <logoutDialog @close="confirmLogout = false" @logout="handleLogout" />
    </div>
  </Transition>
</template>

<style scoped>
@import "@/assets/mentorpage/mentor.css";
@import "@/assets/mentorpage/color.css";
</style>
