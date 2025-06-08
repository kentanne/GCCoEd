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

  // Check if the user is trying to access login page directly after logout
  // This is important to prevent redirection loops after logout
  const isFromLogoutAction =
    from.path !== "/" &&
    from.path !== "/login" &&
    to.path === "/login" &&
    !isAuthenticated;

  // Always allow access to login page
  if (to.path === "/login") {
    if (isAuthenticated && user?.role) {
      // If authenticated with role, redirect to appropriate page
      return redirectToRolePage(user, next);
    }
    return next(); // Allow access to login if not authenticated
  }

  // Break potential redirection loops
  // This is to prevent redirection loops when the user is trying to access signup page directly after logout, or from signup to home page
  if (
    (from.path === "/signup" && to.path === "/") ||
    (from.path === "/" && to.path === "/signup") ||
    (isFromLogoutAction && to.path === "/signup")
  ) {
    if (isAuthenticated && !user?.role) {
      // We have auth but no role - this is a legitimate redirect to signup
      // Add a special flag to prevent further loops
      if (to.query.roleSetup) {
        // Already has flag, just proceed to prevent loops
        return next();
      } else {
        // Add flag and proceed to signup
        return next({ path: "/signup", query: { roleSetup: "true" } });
      }
    }
  }

  // Case 1: Public routes (login, signup, info pages, etc.)
  if (to.meta.requiresAuth === false || to.meta.requiresAuth === undefined) {
    if (isAuthenticated && user?.role && to.path === "/signup") {
      // Authenticated users with roles shouldn't access signup
      return redirectToRolePage(user, next);
    }

    // If trying to access home page after logout, redirect to login instead
    if (to.path === "/" && from.path === "/login" && !isAuthenticated) {
      return next("/login");
    }

    // Allow access to public routes
    return next();
  }

  // Case 2: Protected routes
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

  // User has token but no role - send to signup for role selection
  if (!user.role && to.meta.requiresAuth) {
    return next({ path: "/signup", query: { roleSetup: "true" } });
  }

  // Check if user has the required role for the route
  if (to.meta.role && user.role !== to.meta.role) {
    // User trying to access wrong role page, redirect to their correct page
    return redirectToRolePage(user, next);
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
