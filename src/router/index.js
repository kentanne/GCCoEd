import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LearnMore from "../views/LearnMore.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import MentorInfo from "../views/MentorInfo.vue";
import LearnerInfo from "../views/LearnerInfo.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import MentorDashboard from "../views/mentor/MentorDashboard.vue";
import LearnerDashboard from "../views/learner/LearnerDashboard.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/learn-more", component: LearnMore },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/mentor-info", component: MentorInfo },
  { path: "/learner-info", component: LearnerInfo },
  { path: "/admin", component: AdminDashboard },
  { path: "/mentor", component: MentorDashboard },
  { path: "/learner", component: LearnerDashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;