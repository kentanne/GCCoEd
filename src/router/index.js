import { createRouter, createWebHashHistory } from "vue-router";
import { getToken, removeToken, getUserData } from "@/axios.js";
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
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { requiresAuth: false },
  },
  {
    path: "/learn-more",
    name: "learn-more",
    component: LearnMore,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
    meta: { requiresAuth: false },
  },
  {
    path: "/mentor-info",
    name: "mentor-info",
    component: MentorInfo,
    meta: { requiresAuth: false },
  },
  {
    path: "/learner-info",
    name: "learner-info",
    component: LearnerInfo,
    meta: { requiresAuth: false },
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminPage,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/mentor",
    name: "mentor",
    component: MentorPage,
    meta: { requiresAuth: true, role: "mentor" },
  },
  {
    path: "/learner",
    name: "learner",
    component: LearnerPage,
    meta: { requiresAuth: true, role: "learner" },
  },
  {
    path: "/reset-password",
    name: "password-reset",
    component: passwordReset,
    meta: { requiresAuth: false },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: forgotPassword,
    meta: { requiresAuth: false },
  },
  {
    path: "/mentor-info/alt",
    name: "mentor-info-alt",
    component: MentorInfoAlt,
    meta: { requiresAuth: false },
  },
  {
    path: "/learner-info/alt",
    name: "learner-info-alt",
    component: LearnerInfoAlt,
    meta: { requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Fixed navigation guard
router.beforeEach((to, from, next) => {
  // Clean URL handling
  if (window.location.pathname !== "/" || window.location.search !== "") {
    const hashPart = window.location.hash;
    const cleanUrl = window.location.origin + "/" + hashPart;
    window.history.replaceState(null, "", cleanUrl);
  }

  // Check if token exists in localStorage
  const token = getToken();
  const isAuthenticated = !!token;
  const user = getUserData();

  // Allow access to public routes (requiresAuth: false or undefined)
  if (to.meta.requiresAuth === false || to.meta.requiresAuth === undefined) {
    // If user is authenticated and trying to access login/signup, redirect to dashboard
    if (isAuthenticated && (to.path === "/login" || to.path === "/signup")) {
      if (user) {
        redirectToRolePage(user, next);
        return;
      } else {
        // Clear invalid token/data and allow access to login
        removeToken();
        next();
        return;
      }
    }
    // Allow access to public routes
    next();
    return;
  }

  // Handle routes that require authentication (requiresAuth: true)
  if (to.meta.requiresAuth === true) {
    if (!isAuthenticated) {
      next("/login");
      return;
    }

    // Check if user data exists
    if (!user) {
      // No user data available, redirect to login
      removeToken();
      next("/login");
      return;
    }

    // Check role-specific routes
    if (to.meta.role && user.role !== to.meta.role) {
      redirectToRolePage(user, next);
      return;
    }
  }

  next();
});

function redirectToRolePage(user, next) {
  switch (user.role) {
    case "learner":
      next("/learner");
      break;
    case "mentor":
      next("/mentor");
      break;
    case "admin":
      next("/admin");
      break;
    default:
      next("/signup");
  }
}

export default router;
