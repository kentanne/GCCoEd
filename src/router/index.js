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
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Enhanced navigation guard
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

  // Always allow access to public routes first
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/learn-more",
    "/mentor-info",
    "/learner-info",
    "/reset-password",
    "/forgot-password",
    "/mentor-info/alt",
    "/learner-info/alt",
  ];

  const isPublicRoute = publicRoutes.includes(to.path);

  // Handle authenticated users trying to access login/signup
  if (isAuthenticated && user?.role) {
    if (to.path === "/login" || to.path === "/signup") {
      // Redirect authenticated users with roles away from login/signup
      return redirectToRolePage(user, next);
    }
  }

  // Handle authenticated users without roles
  if (isAuthenticated && !user?.role) {
    // User has token but no role - send to signup for role selection
    // But allow them to access other public pages for navigation
    if (to.path === "/signup" || isPublicRoute) {
      // Add roleSetup flag only for signup to indicate they need to set their role
      if (to.path === "/signup" && !to.query.roleSetup) {
        return next({ path: "/signup", query: { roleSetup: "true" } });
      }
      return next();
    }
    // If trying to access protected route without role, send to signup
    if (to.meta.requiresAuth) {
      return next({ path: "/signup", query: { roleSetup: "true" } });
    }
  }

  // Handle public routes for unauthenticated users
  if (isPublicRoute) {
    // Force router to properly update the URL hash for navigation consistency
    if (to.path !== from.path) {
      // This ensures the URL hash is properly updated when navigating between public routes
      next();
    } else {
      next();
    }
    return;
  }

  // Handle protected routes
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // No token, go to login
      return next("/login");
    }

    // Token exists but no valid user data
    if (!user) {
      // Invalid token scenario
      removeToken();
      return next("/login");
    }

    // Check if user has the required role for the route
    if (to.meta.role && user.role !== to.meta.role) {
      // User trying to access wrong role page, redirect to their correct page
      return redirectToRolePage(user, next);
    }
  }

  // All checks passed, proceed
  next();
});

function redirectToRolePage(user, next) {
  if (!user || !user.role) {
    // User has no role, send to signup with special flag
    return next({ path: "/signup", query: { roleSetup: "true" } });
  }

  switch (user.role) {
    case "learner":
      return next("/learner");
    case "mentor":
      return next("/mentor");
    case "admin":
      return next("/admin");
    default:
      // Invalid role, clear token and send to signup
      removeToken();
      return next("/login");
  }
}

export default router;
