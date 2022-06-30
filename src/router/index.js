import { createRouter, createWebHistory } from "vue-router";
import AppHome from "../views/AppHome.vue";
import GermanMethod from "../german-method/german-method-calc.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: "home" },
    },
    {
      path: "/home",
      name: "home",
      component: AppHome,
    },
    {
      path: "/users/:id/bonds",
      name: "user-home",
      component: () => import("../bonds/pages/bond-home.component.vue"),
    },
    {
      path: "/users/:id/bonds/:idBond",
      name: "user-bond",
      component: () => import("../bonds/pages/bond-detail.component.vue"),
    },
    {
      path: "/german-method",
      name: "german-method",
      component: GermanMethod,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/home"];
  const USER_KEY = "user";
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = JSON.parse(localStorage.getItem(USER_KEY));
  if (authRequired && !loggedIn) {
    next("/home");
  } else {
    next();
  }
});

export default router;
