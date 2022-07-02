<template>
  <pv-dialog
    style="width: 40vw"
    v-model:visible="dialogAddSecondaryMarketVisible"
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
    <form
      ref="addBondForm"
      @submit.prevent="handleSubmit(!v$.$invalid)"
      class="p-fluid"
    >
      <div class="field">
        <div>
          <div class="field">
            <label
              :class="{ 'p-error': v$.performanceRate.$invalid && submitted }"
              for="performanceRate"
              >Rendimiento de Mercado</label
            >
            <pv-input-number
              v-model="performanceRate"
              :class="{ 'p-invalid': v$.performanceRate.$invalid && submitted }"
              id="performanceRate"
              placeholder="Ingrese la tasa de rendimiento"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
            ></pv-input-number>
            <small
              v-if="
                (v$.performanceRate.$invalid && submitted) ||
                v$.performanceRate.$pending.$response
              "
              class="p-error"
              >{{
                v$.performanceRate.required.$message.replace(
                  "Value",
                  "Performace Rate"
                )
              }}</small
            >
          </div>
          <div class="field">
            <label
              :class="{ 'p-error': v$.buyingPeriod.$invalid && submitted }"
              for="buyingPeriod"
              >Periodo Compra</label
            >
            <pv-calendar
              :class="{ 'p-invalid': v$.buyingPeriod.$invalid && submitted }"
              dateFormat="dd/mm/yy"
              v-model="buyingPeriod"
              id="buyingPeriod"
              placeholder="Ingresa el perido de compra"
            ></pv-calendar>
            <small
              v-if="
                (v$.buyingPeriod.$invalid && submitted) ||
                v$.buyingPeriod.$pending.$response
              "
              class="p-error"
              >{{
                v$.buyingPeriod.required.$message.replace(
                  "Value",
                  "Buying Period"
                )
              }}</small
            >
          </div>
        </div>
      </div>
    </form>
    <template #footer>
      <div class="flex justify-content-end column-gap-2 w-full">
        <pv-button
          @click="closeDialogBondAddSecondaryMarket"
          class="w-7rem p-button-text"
          label="Cerrar"
        ></pv-button>
        <pv-button
          @click="executeSubmitEvent"
          class="w-7rem p-button-success"
          label="Agregar"
        ></pv-button>
      </div>
    </template>
  </pv-dialog>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import BondService from "../services/bond.service";

export default {
  name: "bond-add-secondary-market.dialog",
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      performanceRate: null,
      buyingPeriod: null,
      submitted: false,
    };
  },
  validations() {
    return {
      performanceRate: {
        required,
      },
      buyingPeriod: {
        required,
      },
    };
  },
  props: { dialogAddSecondaryMarketVisible: Boolean, bondId: Number },
  methods: {
    closeDialogBondAddSecondaryMarket() {
      this.$emit("close-dialog-bond-add-secondary");
    },
    complete() {
      this.$emit("complete-add-secondary-market");
    },
    executeSubmitEvent() {
      this.$refs.addBondForm.requestSubmit();
    },
    async handleSubmit(isFormValid) {
      this.submitted = true;
      if (isFormValid) {
        await this.getBoundById();
        this.bond.market = "Secundario";
        this.bond.performanceRate = this.performanceRate;
        this.bond.buyingPeriod = this.buyingPeriod;
        await this.putBond(this.bondId, this.bond);
      }
    },
    async getBoundById() {
      await BondService.getById(this.bondId)
        .then((response) => {
          this.bond = response.data;
          this.complete();
        })
        .catch((error) => {
          this.$toast.add({
            severity: "error",
            summary: "An error occurred",
            detail: `${error.message}`,
            life: 3000,
          });
        });
    },
    async putBond(id, bondResource) {
      await BondService.put(id, bondResource)
        .then((response) => {
          this.bond = response.data;
        })
        .catch((error) => {
          this.$toast.add({
            severity: "error",
            summary: "An error occurred",
            detail: `${error.message}`,
            life: 3000,
          });
        });
    },
  },
};
</script>

<style scoped></style>
