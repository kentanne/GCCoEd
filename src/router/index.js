import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LearnMore from "../views/LearnMore.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import MentorInfo from "../views/MentorInfo.vue";
import LearnerInfo from "../views/LearnerInfo.vue";
import AdminPage from "../views/admin/AdminPage.vue";
import MentorPage from "../views/mentor/MentorPage.vue";
import LearnerPage from "../views/learner/LearnerPage.vue";
import passwordReset from "@/components/password-reset.vue";
import forgotPassword from "../views/forgotPassword.vue";
import MentorInfoAlt from "../views/MentorInfoAlt.vue";
import LearnerInfoAlt from "../views/LearnerInfoAlt.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/learn-more", component: LearnMore },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/mentor-info", component: MentorInfo },
  { path: "/learner-info", component: LearnerInfo },
  { path: "/admin", component: AdminPage },
  { path: "/mentor", component: MentorPage },
  { path: "/learner", component: LearnerPage },
  { path: "/reset-password", name: "password-reset", component: passwordReset },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: forgotPassword,
  },
  {
    path: "/mentor-info/alt",
    name: "mentor-info-alt",
    component: MentorInfoAlt,
  },
  {
    path: "/learner-info/alt",
    name: "learner-info-alt",
    component: LearnerInfoAlt,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
