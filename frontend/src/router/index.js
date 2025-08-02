import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  // Có thể thêm route cho các trang khác sau này
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
