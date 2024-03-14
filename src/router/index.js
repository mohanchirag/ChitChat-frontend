import { createRouter, createWebHistory } from "vue-router";
import loginPage from "../components/loginPage.vue";

const routes = [
  {
    path: "/",
    name: "loginPage",
    component: loginPage,
  },
  {
    path: "/signupPage",
    name: "signupPage",
    component: () => import("../components/signupPage.vue"),
  },
  {
    path: "/homePage",
    name: "homePage",
    component: () => import("../components/homePage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
