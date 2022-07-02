<template>
  <div
    class="grid container screem flex justify-content-center align-content-center"
  >
    <div
      class="col-12 lg:col-7"
      style="
        background-image: url('https://static.diariofemenino.com/uploads/psicologia/218796-pedir-ayuda.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        min-height: 150px;
      "
    ></div>
    <div class="col-12 lg:col-5">
      <form
        action=""
        class="p-4 flex justify-content-center align-content-center"
      >
        <div class="p-fluid">
          <h2>
            Do you need help? <span class="info-color">Send us a message</span>
          </h2>
          <div class="field">
            <label for="email">Correo Electronico</label>
            <pv-input-text placeholder="correo@dominio.com"></pv-input-text>
          </div>
          <div class="field">
            <label for="description">Cuentanos tu problema</label>
            <pv-textarea placeholder="Describe tu problema"></pv-textarea>
          </div>
          <pv-button
            type="submit"
            class="p-button-info w-full"
            label="Enviar"
          ></pv-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppHelp",
};
</script>

<style scoped>
.container {
  width: 100%;
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
