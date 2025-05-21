<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import Information from "../../components/learnerpage/information.vue";
import logoutDialog from "@/components/learnerpage/logoutDialog.vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const getLearnerDets = async () => {
  try {
    await axios
      .get("http://localhost:8000/api/learner/details", {
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
            learn: {
              ...response.data.learn,
              availability: JSON.parse(response.data.learn.availability),
              subjects: JSON.parse(response.data.learn.subjects),
              learn_sty: JSON.parse(response.data.learn.learn_sty),
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

const sessionInfo = async () => {
  try {
    const sessionDeets = await axios
      .get(`http://localhost:8000/api/learner/sched`, {
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

const sessionForReview = async () => {
  try {
    const pastSessionDeets = await axios
      .get(`http://localhost:8000/api/learner/doneSched`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("done session details:", response.data);
        schedForReview.value = response.data.schedules_done;
      });
  } catch (error) {
    console.error("Error fetching session details:", error);
    return null;
  }
};
const mentorProfile = async () => {
  try {
    await axios
      .get("http://localhost:8000/api/learner/users", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("Mentor profiles fetched successfully: ", response.data);
        if (response.status === 200) {
          users.value = response.data.map((item) => ({
            id: item.user.id,
            userName: item.user.name,
            yearLevel: item.mentor_infos.year,
            course: item.mentor_infos.course,
            image_id: item.mentor_infos.image,
            proficiency: item.mentor_infos.proficiency,
            subjects: JSON.parse(item.mentor_infos.subjects),
            availability: JSON.parse(item.mentor_infos.availability),
            rating_ave: item.mentor_infos.rating_ave || 0,
            bio: item.mentor_infos.bio,
            prefSessDur: item.mentor_infos.prefSessDur,
            teach_sty: JSON.parse(item.mentor_infos.teach_sty || "[]"),
            credentials: item.mentor_infos.credentials || [],
          }));
        }
      });
  } catch (error) {
    console.error("Error fetching mentor profiles:", error);
  }
};

const registerMentorRole = async () => {
  try {
    const response = await axios
      .post("http://localhost:8000/api/set/2nd_role", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("Mentor registration:", response.data);
        router.push("/mentor-info/alt");
      });
  } catch (error) {
    console.error("Error registering as learner:", error);
    return null;
  }
};

const switchRole = async () => {
  try {
    const response = await axios
      .post("http://localhost:8000/api/switch", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
        },
      })
      .then((response) => {
        console.log("Role switched:", response.data);
        router.push("/login");
      });
  } catch (error) {
    console.error("Error switching role:", error);
    return null;
  }
};

const userData = ref({
  user: {
    id: null,
    name: "",
    email: "",
    role: "",
  },
  learn: {
    address: "",
    year: "",
    course: "",
    availability: [],
    prefSessDur: "",
    bio: "",
    subjects: [],
    image: "",
    phoneNum: "",
    learn_sty: [],
    goals: "",
    rating_ave: 0,
  },
});

const schedForReview = ref([]);
const todaySchedule = ref([]);
const upcommingSchedule = ref([]);

const isEdit = ref(false);
const users = ref([]);
const confirmLogout = ref(false);
const isHelp = ref(false);

const openHelp = () => {
  isHelp.value = !isHelp.value;
};

const openLogoutDialog = () => {
  confirmLogout.value = !confirmLogout.value;
};

const activeComponent = ref("main");
const switchComponent = (component) => {
  if (activeComponent.value !== component) {
    activeComponent.value = component;
  }
};

const mainView = defineAsyncComponent(() =>
  import("../../components/learnerpage/main.vue")
);

const sessionView = defineAsyncComponent(() =>
  import("../../components/learnerpage/session.vue")
);

const recordsView = defineAsyncComponent(() =>
  import("../../components/learnerpage/records.vue")
);

const componentMap = {
  main: mainView,
  session: sessionView,
  records: recordsView,
};

const courseCard = ref([]);

const displayedCourses = computed(() => courseCard.value.slice(0, 5));
const remainingCoursesCount = computed(() =>
  Math.max(courseCard.value.length - 5, 0)
);
const remainingCourses = computed(() => courseCard.value.slice(5));
const showAllCourses = ref(false);

const toggleShowAllCourses = () => {
  showAllCourses.value = !showAllCourses.value;
};

const openEditInformation = () => {
  isEdit.value = !isEdit.value;
};

const searchQuery = ref("");

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

const createUser = (id, userName, yearLevel, rating = 4) => {
  return {
    id,
    userName,
    yearLevel,
    starFilled: ref(rating),
  };
};

const fetchUserInformation = () => {
  return [
    createUser(1, "Maria Santos", "1st Year"),
    createUser(2, "James Wilson", "3rd Year"),
    createUser(3, "Sofia Rodriguez", "2nd Year"),
    createUser(4, "David Chen", "4th Year"),
    createUser(5, "Ana Reyes", "1st Year"),
    createUser(6, "Marco Tan", "3rd Year", "BSBA | COB"),
    createUser(7, "Ling Xu", "5th Year"),
    createUser(8, "Paulo Cordova", "2nd Year"),
    createUser(9, "Aisha Patel", "4th Year"),
    createUser(10, "Rafael Gutierrez", "3rd Year"),
    createUser(11, "Nina Thompson", "1st Year"),
    createUser(12, "Carlos Mendoza", "2nd Year"),
    createUser(13, "Jennifer Kim", "4th Year"),
    createUser(14, "Hiroshi Tanaka", "3rd Year"),
    createUser(15, "Fatima Ahmed", "2nd Year"),
    createUser(16, "Victor Garcia", "1st Year"),
    createUser(17, "Emily Zhang", "5th Year"),
    createUser(18, "Michael Okafor", "3rd Year"),
    createUser(19, "Isabella Martinez", "2nd Year"),
    createUser(20, "Raj Patel", "4th Year"),
    createUser(21, "Gabriela Silva", "1st Year"),
    createUser(22, "Daniel Lee", "3rd Year"),
    createUser(23, "Fatma Ibrahim", "2nd Year"),
    createUser(24, "Alejandro Diaz", "4th Year"),
    createUser(25, "Mei Lin", "3rd Year"),
    createUser(26, "Mohammed Al-Farsi", "1st Year"),
    createUser(27, "Sarah Johnson", "5th Year"),
    createUser(28, "Juan Dela Cruz", "2nd Year", "BSIT | CSS"),
    createUser(29, "Amara Okonkwo", "4th Year"),
    createUser(30, "Liam O'Connor", "3rd Year"),
    createUser(31, "Priya Sharma", "2nd Year"),
    createUser(32, "Ricardo Torres", "1st Year"),
  ];
};

onMounted(async () => {
  users.value = fetchUserInformation();
  await getLearnerDets();
  await sessionInfo();
  await mentorProfile();
  await sessionForReview();
  console.log("User data:", userData.value);
});
</script>

<template>
  <!-- sidebar -->
  <div class="sidebar">
    <div class="upper-element">
      <div>
        <h1>Hi, Learner!</h1>
        <img
          :src="
            'http://localhost:8000/api/image/' + userData.learn.image ||
            'https://placehold.co/600x400'
          "
          alt="profile-pic"
        />
      </div>
      <div>
        <h2>{{ userData.user.name }}</h2>
        <i
          ><p>{{ userData.learn.year }}</p></i
        >
        <i
          ><p>{{ userData.learn.course }}</p></i
        >
      </div>
    </div>
    <!--<div class="wave-curve"></div>-->
    <div class="footer-element">
      <div class="bio-container">
        <h1>BIO</h1>
        <div>
          <p style="white-space: normal; word-break: break-all">
            {{ userData.learn.bio }}
          </p>
        </div>
      </div>
      <div class="goals-container">
        <h1>LEARNING GOALS</h1>
        <div>
          <p>{{ userData.learn.goals }}</p>
        </div>
      </div>
      <div class="availability">
        <h1>Availability</h1>
        <div class="lines">
          <h3>Days:</h3>
          <div>
            <ul>
              <li
                v-for="(day, index) in userData.learn.availability"
                :key="index"
              >
                {{ day }}
              </li>
            </ul>
          </div>
        </div>
        <div class="lines">
          <h3>Duration:</h3>
          <div>
            <p>{{ userData.learn.prefSessDur }}</p>
          </div>
        </div>
      </div>
      <div class="subject-interest">
        <h1>Subject of Interest</h1>
        <div class="course-grid">
          <div
            v-for="(card, index) in userData.learn.subjects"
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
                v-for="(course, index) in userData.learn.subjects"
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
      <div>
        <button @click="registerMentorRole">Register as Mentor</button>
        <button @click="switchRole">switch Account Role</button>
      </div>
    </div>
  </div>

  <!-- topbar -->
  <div class="topbar">
    <div class="topbar-left">
      <div @click="switchComponent('main')" class="topbar-options">
        <img src="/main.svg" alt="main" />
        <p>Main</p>
      </div>
      <div @click="switchComponent('session')" class="topbar-options">
        <img src="/calendar.svg" alt="calendar" />
        <p>Sessions</p>
      </div>
      <div @click="switchComponent('records')" class="topbar-options">
        <img src="/records.svg" alt="record" />
        <p>Records</p>
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
      :userData="userData"
      :upcomingSchedule="upcommingSchedule"
      :schedule="todaySchedule"
      :schedForReview="schedForReview"
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

  <Transition name="fade" mode="out-in">
    <div v-if="isHelp" class="help-popup">
      <help @close="isHelp = false" />
    </div>
  </Transition>
</template>

<style scoped>
@import "@/assets/learnerpage/learner.css";
@import "@/assets/learnerpage/color.css";
</style>
