<template>
  <pv-toolbar class="md:mx-4">
    <template #start>
      <a href="/" class="flex no-underline p-toolbar-separator mr-4">
        <div class="mr-1">
          <img
            width="46"
            height="46"
            src="../shared/resources/img/logo.png"
            alt=""
          />
        </div>
        <h1 style="font-size: 20px; color: #000000">Founding</h1>
      </a>
      <div class="flex" v-if="currentUser">
        <pv-button
          @click="goToMyBonds"
          label="Mis bonos"
          class="p-button-text p-toolbar-separator visible"
        ></pv-button>
      </div>
      <div class="flex" v-else>
        <pv-button
          label="Inicio"
          class="p-button-text p-toolbar-separator visible"
        ></pv-button>
        <a
          style="color: #000000"
          href="#sign-up"
          v-smooth-scroll
          class="p-button p-button-text no-underline p-toolbar-separator visible"
        >Unirse</a
        >
      </div>
    </template>
    <template #end>
      <div class="flex align-items-center p-toolbar-separator visible">
        <p>Claro</p>
        <pv-input-switch class="mx-3"></pv-input-switch>
        <p>Oscuro</p>
      </div>
      <pv-button
        v-if="currentUser"
        :label="currentUser.username"
        class="p-toolbar-separator ml-5"
        @click="toggleUserMenu"
      ></pv-button>
      <pv-button
        v-else
        @click="toggle"
        class="p-toolbar-separator ml-5"
        label="Iniciar Sesión"
      ></pv-button>
    </template>
  </pv-toolbar>
  <pv-overlay-panel ref="user-options">
    <pv-menu class="border-none" :model="options"></pv-menu>
  </pv-overlay-panel>
  <pv-overlay-panel ref="log-in">
    <form @submit.prevent="handleSubmit(!v$.$invalid)" class="pt-3 px-3">
      <div class="p-fluid">
        <div v-if="submitted && accountNotFound" class="field">
          <p class="p-error">¡Usuario y/o contraseña no existente!</p>
        </div>
        <div class="field">
          <label
            :class="{ 'p-error': v$.email.$invalid && submitted }"
            for="email-log"
            >Nombre de usuario</label
          >
          <pv-input-text
            v-model="email"
            :class="{ 'p-invalid': v$.email.$invalid && submitted }"
            id="email-log"
            placeholder="Ingresa tu correo"
          ></pv-input-text>
        </div>
        <div class="field">
          <label
            :class="{ 'p-error': v$.password.$invalid && submitted }"
            for="password-log"
            >Contraseña</label
          >
          <pv-password
            v-model="password"
            :class="{ 'p-invalid': v$.password.$invalid && submitted }"
            :feedback="false"
            id="password-log"
            placeholder="Ingresa tu contraseña"
          ></pv-password>
        </div>
        <div class="field">
          <a class="no-underline text-black-alpha-70" href=""
            >¿Olvidaste tu contraseña?</a
          >
        </div>
        <div class="field">
          <pv-button
            type="submit"
            :loading="isLoading"
            label="Iniciar"
          ></pv-button>
        </div>
      </div>
    </form>
  </pv-overlay-panel>
</template>

<script>
import { email, maxLength, minLength, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import AuthenticateRequest from "../security/models/authenticate.request";
export default {
  name: "AppNavigation",
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      isLoading: false,
      accountNotFound: false,
      options: [
        {
          label: "Mi Perfil",
          icon: "pi pi-user",
          command: (event) => {
            this.$refs["user-options"].toggle(event);
          }
        },
        {
          label: "Cerrar Sesion",
          icon: "pi pi-sign-in",
          command: (event) => {
            this.$store.dispatch("auth/logout");
            this.$refs["user-options"].toggle(event);
          }
        }
      ]
    };
  },
  validations() {
    return {
      email: {
        required, email
      },
      password: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(15),
      },
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    toggle(event) {
      this.$refs["log-in"].toggle(event);
    },
    toggleUserMenu(event) {
      this.$refs["user-options"].toggle(event);
    },
    goToMyBonds() {
      this.$router.push({name: "user-home", params: {id: this.currentUser.id}});
    },
    handleSubmit(isFormValid, event) {
      this.submitted = true;
      if (isFormValid) {
        setTimeout(() => (this.isLoading = true), 100);
        this.accountNotFound = false;
        const logInRequest = new AuthenticateRequest(
          this.email,
          this.password
        );
        this.$store
          .dispatch("auth/login", logInRequest)
          .then(() => {
            this.accountNotFound = false;
            this.$refs["log-in"].toggle(event);
            this.$toast.add({
              severity: "success",
              summary: `Welcome ${this.currentUser.name} ${this.currentUser.lastname}`,
              detail: "We are ready to work!",
              life: 4000,
            });
            setTimeout(() => (this.isLoading = false), 100);
            this.resetForm();
            this.$router.push({
              name: "user-home",
              params: { id: this.currentUser.id },
            });
          })
          .catch(() => {
            setTimeout(() => (this.isLoading = false), 100);
            this.accountNotFound = true;
          });
      }
    },
    resetForm() {
      this.username = "";
      this.password = "";
      this.submitted = false;
      this.isLoading = false;
      this.accountNotFound = false;
    },
  },
};
</script>

<style scoped>
.visible {
  display: flex !important;
}
@media (max-width: 984px) {
  .visible {
    display: none !important;
  }
}
</style>
