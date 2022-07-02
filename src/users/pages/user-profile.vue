<template>
  <div class="container">
    <h2>Hola <span class="info-color">{{currentUser.username}}</span></h2>
    <div class="flex justify-content-center align-content-center">
      <div class="p-fluid md:w-30rem">
        <div class="field">
          <pv-input-text :placeholder="currentUser.name" disabled="false"></pv-input-text>
        </div>
        <div class="field">
          <pv-input-text :placeholder="currentUser.lastname" disabled="false"></pv-input-text>
        </div>
        <div class="field">
          <pv-input-text :placeholder="currentUser.country" disabled="false"></pv-input-text>
        </div>
        <div class="field">
          <pv-input-text :placeholder="currentUser.email" disabled="false"></pv-input-text>
        </div>
        <div class="field">
          <label for="password">Contraseña</label>
          <pv-input-text></pv-input-text>
        </div>
        <div class="field">
          <label for="password">Repetir Contraseña</label>
          <pv-input-text></pv-input-text>
        </div>
        <div class="flex gap-2">
          <pv-button class="p-button-text" label="Cancelar"></pv-button>
          <pv-button class="p-button-info" label="Guardar"></pv-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "user-profile",
  data() {
    return {

    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
  },
  mounted() {

  }
};
</script>

<style scoped>
.container {
  width: 95%;
  max-width: 1200px;
  margin: 0 auto;
}
.screem {
  height: 100%;
  min-height: calc(100vh - 180px);
}
.info-color {
  color: #5bc0de;
}
</style>
