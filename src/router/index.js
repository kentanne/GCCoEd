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
import axios from "axios"; // Make sure axios is installed and imported
import api from "@/axios.js";

// Configure axios to always include credentials
axios.defaults.withCredentials = true;

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
    meta: { requiresAuth: false, redirectIfAuth: true },
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
    meta: { requiresAuth: false, redirectIfAuth: true },
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Function to check authentication status
const checkAuth = async () => {
  try {
    // Get the authenticated user info from Laravel backend
    const response = await api.get("/api/auth/check");

    if (response.data.authenticated) {
      return {
        isAuthenticated: true,
        user: response.data.user,
      };
    } else {
      return {
        isAuthenticated: false,
        user: null,
      };
    }
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
    };
  }
};

// Helper function to redirect based on user role
function redirectToRolePage(user, next) {
  if (!user || !user.role) {
    next("/");
    return;
  }

  switch (user.role) {
    case "admin":
      next("/admin");
      break;
    case "mentor":
      next("/mentor");
      break;
    case "learner":
      next("/learner");
      break;
    default:
      next("/");
  }
}

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, user } = await checkAuth();

  // If route requires authentication and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
    return;
  }

  // If user is authenticated but trying to access login/signup pages
  if (isAuthenticated && to.meta.redirectIfAuth) {
    redirectToRolePage(user, next);
    return;
  }

  // If route has role restriction and user doesn't have that role
  if (to.meta.role && to.meta.role !== user?.role) {
    if (isAuthenticated) {
      redirectToRolePage(user, next);
    } else {
      next("/login");
    }
    return;
  }

  // For home page, check if user is authenticated and redirect to role page
  if (to.path === "/" && isAuthenticated) {
    redirectToRolePage(user, next);
    return;
  }

  // For all other cases, continue navigation
  next();
});

export default router;
