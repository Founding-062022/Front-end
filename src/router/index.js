import { createRouter, createWebHistory } from "vue-router";
import AppHome from "../views/AppHome.vue";
import GermanMethod from "../german-method/german-method-calc.vue"
import AppHelp from "../views/AppHelp.vue";
import UserProfile from "../users/pages/user-profile.vue";

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
    {
      path: "/help",
      name: "help",
      component: AppHelp,
    },
    {
      path: "/users/:idUser/profile",
      name: "user-profile",
      component: UserProfile,
    }
  ],
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/home", "/help"];
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
