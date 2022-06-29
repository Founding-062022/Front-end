<template>
  <div class="container h-content">
    <div
      class="flex flex-column md:flex-row md:justify-content-between align-items-center mt-4 mb-2"
    >
      <div>
        <h2>Mis bonos</h2>
      </div>
      <div class="">
        <pv-button
          label="Agregar"
          @click="bondAddDialog = true"
          class="p-button-success mr-2 w-7rem"
        ></pv-button>
        <pv-button
          @click="bondDeleteDialog = true"
          label="Eliminar"
          class="p-button-danger mr-2 w-7rem"
        ></pv-button>
        <pv-button
          :class="{ 'p-disabled': disableCompare }"
          @click="bondCompareDialog = true"
          label="Comparar"
          class="p-button-info w-7rem"
        ></pv-button>
      </div>
    </div>
    <div class="pt-3">
      <pv-data-table
        :value="bounds"
        :rows="10"
        :paginator="true"
        v-model:selection="selectedBounds"
        dataKey="id"
      >
        <pv-column
          selectionMode="multiple"
          headerStyle="width: 3em"
        ></pv-column>
        <pv-column field="id" header="Codigo"></pv-column>
        <pv-column field="name" header="Nombre"></pv-column>
        <pv-column header="Valor Nominal">
          <template #body="slotProps">
            {{ slotProps.data.nominalValue }} {{ slotProps.data.currency }}
          </template>
        </pv-column>
        <pv-column header="Tasa Cupon">
          <template #body="slotProps">
            {{ slotProps.data.couponRate }}%
          </template>
        </pv-column>
        <pv-column field="market" header="Mercado"></pv-column>
        <pv-column
          headerStyle="min-width: 4rem; text-align: center"
          bodyStyle="text-align: center; overflow: visible"
        >
          <template #body="slotProps">
            <pv-button
              @click="goToBondDetail(slotProps.data.id)"
              type="button"
              class="p-button-rounded"
              icon="pi pi-eye"
            ></pv-button>
          </template>
        </pv-column>
      </pv-data-table>
      <bond-add-dialog
        v-on:close-dialog-add="closeDialogAdd"
        v-on:bond-registered="bondRegistered"
        v-bind:dialog-add-visible="bondAddDialog"
      ></bond-add-dialog>
      <bond-compare-dialog
        v-on:close-dialog-compare="closeDialogCompare"
        v-bind:dialog-compare-visible="bondCompareDialog"
        v-bind:selected-bounds="selectedBounds"
      ></bond-compare-dialog>
      <pv-dialog
        :closable="false"
        v-model:visible="bondDeleteDialog"
        :style="{ width: '450px' }"
        :modal="true"
      >
        <template #header>
          <div class="w-full">
            <h2 class="text-center mb-1">Bonos Corporativos</h2>
          </div>
        </template>
        <div class="confirmation-conte">
          <span v-if="selectedBounds.length === 1"
            >¿Esta seguro que quiere eliminar
            <b>{{ selectedBounds.at(0).name }}</b
            >?</span
          >
          <span v-else
            >¿Esta seguro de eliminar los productos seleccionados?</span
          >
        </div>
        <template #footer>
          <pv-button
            label="Cancelar"
            icon="pi pi-times"
            class="p-button-text"
            @click="bondDeleteDialog = false"
          ></pv-button>
          <pv-button
            @click="deleteBondsAsync"
            label="Aceptar"
            icon="pi pi-check"
            class="p-button-danger"
          ></pv-button>
        </template>
      </pv-dialog>
    </div>
  </div>
</template>

<script>
import BondAddDialog from "./bond-add.dialog.vue";
import BondCompareDialog from "./bond-compare.dialog.vue";
import BondService from "../services/bond.service";
export default {
  name: "bond-home",
  components: { BondAddDialog, BondCompareDialog },
  data() {
    return {
      bondAddDialog: false,
      bondCompareDialog: false,
      bondDeleteDialog: false,
      selectedBounds: [],
      bounds: [],
    };
  },
  computed: {
    disableCompare() {
      return this.selectedBounds.length !== 2;
    },
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    closeDialogAdd() {
      this.bondAddDialog = false;
    },
    goToBondDetail(id) {
      this.$router.push({ name: "user-bond", params: { idBond: id } });
    },
    bondRegistered() {
      this.closeDialogAdd();
      this.getBounds();
    },
    closeDialogCompare() {
      this.bondCompareDialog = false;
    },
    async deleteBonds() {
      for (let i = 0; i < this.selectedBounds.length; i++) {
        this.bounds = this.bounds.filter(
          (bound) => bound.id !== this.selectedBounds.at(i).id
        );
        await BondService.delete(this.selectedBounds.at(i).id);
      }
    },
    async deleteBondsAsync() {
      await this.deleteBonds();
      this.bondDeleteDialog = false;
      this.selectedBounds.splice(0, this.selectedBounds.length);
    },
    async getBounds() {
      await BondService.getByUserId(this.currentUser.id)
        .then((response) => {
          this.bounds = response.data;
        })
        .catch((error) => {
          this.$toast.add({
            severity: "error",
            summary: `${error.message}`,
            detail: "An error occurred while fetching the information",
            life: 3000,
          });
        });
    },
    getCurrencies() {},
  },
  mounted() {
    this.getBounds();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
}
.h-content {
  min-height: calc(100vh - 190px);
}
</style>
