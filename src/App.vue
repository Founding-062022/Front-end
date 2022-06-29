<script>
import AppNavigation from "./views/AppNavigation.vue";
import AppFooter from "./views/AppFooter.vue";
export default {
  name: "App",
  components: { AppNavigation, AppFooter },
};
</script>

<template>
  <app-navigation></app-navigation>
  <router-view></router-view>
  <app-footer></app-footer>
  <pv-toast></pv-toast>
</template>

<style>
body {
  margin: 0;
}
</style>
