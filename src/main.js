import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// svg Icon
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBell,
  faBook,
  faCalendar,
  faCalendarAlt,
  faClock,
  faCommentDots,
  faEllipsisH,
  faEnvelope,
  faEye,
  faFileArrowUp,
  faFileLines,
  faLifeRing,
  faLink,
  faMapMarkerAlt,
  faRightFromBracket,
  faTimes,
  faUser,
  faX,
  faFile,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faLine } from "@fortawesome/free-brands-svg-icons";

library.add(
  faLifeRing,
  faGoogle,
  faCalendar,
  faEllipsisH,
  faUser,
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faEnvelope,
  faBell,
  faX,
  faTimes,
  faCommentDots,
  faBook,
  faFileLines,
  faFileArrowUp,
  faRightFromBracket,
  faLink,
  faEye,
  faFile,
  faDownload
);

// import App from "./App.vue";
// import router from "./router";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
