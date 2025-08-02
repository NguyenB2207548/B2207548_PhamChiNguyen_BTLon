import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

import router from "./router";
import { createApp } from "vue";
import App from "./App.vue";

// createApp(App).mount("#app");

const app = createApp(App);
app.use(router);
app.mount("#app");
