<template>
  <pv-dialog
    style="width: 40vw"
    v-model:visible="dialogCompareVisible"
    :modal="true"
    :closable="false"
    position="center"
    :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
  >
    <template #header>
      <div class="flex justify-content-center w-full">
        <h2 class="text-center">Bonos Corporativos</h2>
      </div>
    </template>
    <div>Here content</div>
    <template #footer>
      <div class="flex justify-content-end w-full">
        <pv-button @click="closeDialogBondCompare" class="w-7rem p-button-info" label="Cerrar"></pv-button>
      </div>
    </template>
  </pv-dialog>
</template>

<script>
export default {
  name: "bond-compare",
  props: {dialogCompareVisible: Boolean, selectedBounds: Array},
  methods: {
    closeDialogBondCompare() {
      this.$emit("close-dialog-compare");
    }
  }
};
</script>

<style scoped>

</style>
