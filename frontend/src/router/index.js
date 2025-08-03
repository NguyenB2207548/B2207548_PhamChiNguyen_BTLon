import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";
import Products from "../components/Products.vue";
import BookDetail from "../components/BookDetail.vue";
import Admin from "../components/Admin.vue";
import BorrowHistory from "../components/BorrowHistory.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/products",
    name: "Products",
    component: Products,
  },
  {
    path: "/products/:id",
    name: "BookDetail",
    component: BookDetail,
    props: true,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/borrow-history",
    name: "BorrowHistory",
    component: BorrowHistory,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
